$(document).ready(function() {
  // Stuff to do as soon as the DOM is ready;
});

function testing() {
  $.getJSON('/javascripts/posts.json', function(data) {
    alert(data);
  });
}
