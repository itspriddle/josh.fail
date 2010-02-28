;(function ($) {
  $.fn.extend({
    autocomplete: function(url)
    {
      return this.each(function()
      {
        var text_input  = $(this);
        text_input.after('<ul class="autocomplete" style="display:none"></ul>');
        var search_res  = text_input.next();
        var search_size = 0;
        var timeout_interval;
        var selected = 0;
        function search_payload(search_text)
        {
          if ( ! search_text)
          {
            search_text = text_input.val();
          }
          window.clearInterval(timeout_interval);
          if (search_text)
          {
            $.getJSON(url, function (data) {
              if (data)
              {
                var output = '';
                var datalen = data.length;
                for (i = 0; i < datalen; i++)
                {
                  var title = data[i].title;
                  if (title.match(new RegExp(search_text, 'i')))
                  {
                    output += '<li value="' + title + '">' + title.replace(new RegExp("(" + search_text + ")", "i"), "<strong>$1</strong>") + '</li>';
                  }
                  search_res.html(output);
                  search_res.show();
                  search_res.children().
                    hover(function() { $(this).addClass('selected').siblings().removeClass('selected'); }, function() { $(this).removeClass("selected"); }).
                    click(function() { text_input.val($(this).attr('value')); });
                }
              }
            })
          }
        }

        function clear_search()
        {
          search_res.hide();
          search_size = 0;
          selected = 0;
        }
        
        text_input.keydown(function(e) {
          window.clearInterval(timeout_interval);
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
              else
              {
                clear_search();
              }
              e.preventDefault();
              return false;
              break;
              
            // up/down
            case 40:
            case  9:
            case 38:
              switch (e.which)
              {
                case 40:
                case  9:
                  selected = selected >= search_size - 1 ? 0 : selected + 1;
                  break;
                case 38:
                  selected = selected <= 0 ? search_size - 1 : selected - 1;
                  break;
              }
              text_input.val(search_res.children().removeClass('selected').eq(selected).addClass('selected').text());
              break;
              
            default:
              timeout_interval = window.setTimeout(function() {
                search_payload()
              }, 1000);
              break;
          }
        });
      });
    }
  })
})(jQuery);
