jQuery(document).ready(function($) {
  $('#testing').click(
    alert('clicked testing');
    $.getJSON('/javascripts/posts.js', function(data) {
      $.each(data.posts, function (i, item) {
        alert(item.title);
      });
    });
  );
});
