;(function ($) {
  $.fn.extend({
    autocomplete: function(url)
    {
      return this.each(function()
      {
        var text_input  = $(this);
        var search_res  = text_input.after('<ul class="autocomplete" style="display:none;"></ul>') && text_input.next('ul.autocomplete');
        var search_size = 0;
        var selected    = -1;
        var last_search = '';
        var observer;
        function search_payload(search_text)
        {
          if ( ! search_text)
          {
            search_text = text_input.val();
          }
          window.clearTimeout(observer);
          if (search_text && search_text != last_search)
          {
            last_search = search_text;
            $.getJSON(url, function (posts) {
              if (posts)
              {
                var output = '';
                $.each(posts, function(index, post) {
                  var title = post.title;
                  var pdate = post.date;
                  //alert(post.url);
                  var check = new RegExp("(" + search_text + ")", "i");
                  if (title.match(check))
                  {
                    search_size = search_size + 1;
                    output += '<li href="' + post.url + '">' + pdate + ' - ' + title.replace(check, "<strong>$1</strong>") + '</li>';
                  }
                });
                if (output == '')
                {
                  output = "<li>No results</li>";
                  search_res.html(output);
                  search_res.show();                  
                }
                else
                {
                  search_res.html(output);
                  search_res.show().children().
                  hover(function() { 
                    $(this).addClass('selected').siblings().removeClass('selected');
                  }, function() { 
                    $(this).removeClass("selected");
                  }).
                  click(function() { 
                    window.location = $(this).attr('href'); 
                  });
                }
              }
            });
          }
          else
          {
            search_res.children().remove();
            search_res.hide();
          }
        }

        function clear_search()
        {
          search_res.hide();
          search_size = 0;
          selected = -1;
        }

        text_input.keydown(function(e) {
          window.clearTimeout(observer);
          switch (e.which)
          {
            // Escape button
            case 27:
              clear_search();
              break;

            // Delete and backspace
            case 46:
            case  8:
              clear_search();
              break;

            // Enter
            case 13:
              if (search_res.css('display') == 'none')
              {
                search_payload();
              }
              else if (search_res.children('li[href]').length > 0)
              {
                window.location = search_res.children('li.selected').eq(0).attr('href');
              }
              else
              {
                clear_search();
              }
              e.preventDefault();
              return false;
              break;

            // up/down
            case 40: // down
            case 38: // up
              if (e.which == 40)
              {
                selected = selected >= search_size - 1 ? 0 : selected + 1;
              }
              else if (e.which == 38)
              {
                selected = selected <= 0 ? search_size - 1 : selected - 1;
              }
              search_res.children().eq(selected).addClass('selected').siblings().removeClass('selected');
              break;

            default:
              observer = window.setTimeout(function() { search_payload(); }, 1000);
              break;
          }
        });
      });
    }
  });
})(jQuery);
