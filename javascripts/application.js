jQuery(document).ready(function($) {
  $('input#searchfield').autocomplete('/javascripts/posts.json');
  // $('#testing').click(function() {
  //   alert('clicked testing');
  //   $.getJSON('/javascripts/posts.json', function(data) {
  //     $.each(data.posts, function (i, item) {
  //       alert(item.title);
  //     });
  //   });
  // });
});
