/**
 * Author: codebymick
 * Date: 25.01.19
 */

$(document).on('keyup', '.url-item', function () {

  let source = $(this).val(), thisClass = $(this).attr("id"),
      fallback                          = "https://imagebank.codebymick.com/image-swap/logo.png",
      thisError                         = $(this).siblings('.errorImage');
  if (source) {
    let image     = new Image();
    image.onload  = function () {
      $('.' + thisClass).attr("src", source).removeClass('invalid');
      thisError.removeClass('show');
      $('.saveError').removeClass('show');
    };
    image.onerror = function () {
      $('.' + thisClass).attr("src", fallback).addClass('invalid');
      thisError.addClass('show');
    };
    image.src     = source;
  }
  $('#submit').text('Save');

});

$(document).on('click', '#zero', function (e) {
  e.preventDefault();
  $(this).closest('.input-wrapper').remove();
});

$(document).on('click', '#enabled', function () {
  status();
});

$(document).ready(function () {
  document.getElementById('enabled').checked = false;



  if ($('form').find('.input-wrapper').length === 1) {
    $('#zero').hide();
  }

  $.fn.valuesArr = function () {
    let a = [];
    $.each(this, function (i, field) {
      a.push(field.value);
    });
    return a;
  };

  $('#submit').click(function () {
    if ($('.invalid').length == 0) {
      let urlArr = $('.url-item').valuesArr();
      save(urlArr);
    } else {
      $('.saveError').addClass('show');
    }
  });

  let inputCount = 1, fallbackIMG = "https://imagebank.codebymick.com/image-swap/logo.png";
  $('.add').click(function () {
    $('#url-content')
    .append('<div class="input-wrapper"><div class="image-wrapper"><img class="img-' + inputCount + '" src="' + fallbackIMG + '"/>' +
      '</div><div class="source-wrapper">' +
      '<input class="url-item" id="img-' + inputCount + '" value="' + fallbackIMG + '" "  />' +
      '<button id="zero" class="btn btn-warning">delete row</button>' +
      '<div class="errorImage">the url you entered is not a valid image file.</div>' +
      '</div></div>');
    inputCount++;
  });

});
function save(urlArr) {
  let imageBank = urlArr;
  chrome.storage.sync.set({
    key: imageBank});
  $('#submit').text('Saved');
  restore();
}
function status(){
  chrome.storage.sync.set({
    enabled: document.getElementById("enabled").checked});
}

function restore() {
  chrome.storage.sync.get(null, function (items) {

  });
}


