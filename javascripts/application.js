jQuery(document).ready(function($) {
  $('#testing').click(function() {
    alert('clicked testing');
    $.ajax({
      url: '/javascripts/posts.json',
      dataType: 'json',
      success: function(data) {
        $.each(data.posts, function (i, item) {
          alert(item.title);
        });
      }
    });
  });
});
