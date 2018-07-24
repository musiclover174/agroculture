(function () {
  
  $('.career__form').submit(function(){
    if (window.agroculture.form.checkForm($(this)[0])){
      // ajax here
      $(this).addClass('success')
    }
    return false;
  })
  
})();