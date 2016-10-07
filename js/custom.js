// Category select
$('.category-notice select').change(function() {
  var dest = $(this).val() == "all"?"/":"/categories/"+ $(this).val();
  window.location.href = dest;
});