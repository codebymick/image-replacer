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
      $('.' + thisClass).css('background-image', 'url(' + source + ')').removeClass('invalid');
      thisError.removeClass('visible');
      $('.saveError').removeClass('visible');
      $('.' + thisClass + ' .fallback-text').removeClass('visible');
      $('.submit').removeClass('inactive');

    };
    image.onerror = function () {
      $('.' + thisClass).css('background-image', 'url(' + fallback + ')').addClass('invalid');
      thisError.addClass('visible');
      $('.' + thisClass + ' .fallback-text').addClass('visible');
      $('.submit').addClass('inactive');
    };
    image.src     = source;
  }
  $('#submit').text('Save');

});

$(document).on('click', '#zero', function (e) {
  e.preventDefault();
  $('.saveError').removeClass('visible');
  $(this).closest('.input-wrapper').remove();
});

$(document).on('click', '#enabled', function () {
  status();
});

$(document).ready(function () {
  document.getElementById('enabled').checked = false;
  $('#zero').hide();


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
      $('.saveError').addClass('visible');
    }
  });

  $('.reset').click(function(){
    chrome.tabs.reload();
  });

  $(document).on('click', ['.add', '#zero'], function () {
    if($('form').children().length < 2){
      $('#zero').hide();
    } else {
      $('#zero').show();
    }
  });

    let inputCount = 1, fallbackIMG = "https://imagebank.codebymick.com/image-swap/logo.png";


  $('.add').click(function () {
    $('#url-content')
    .append('<div class="input-wrapper"><div class="image-wrapper"><div class="img-' + inputCount + '">' +
      '<div class="fallback-text">Fallback Image</div></div></div><div class="source-wrapper">' +
      '<input class="url-item" id="img-' + inputCount + '" value="' + fallbackIMG + '" "  />' +
      '<button id="zero" class="btn btn-warning">delete row</button>' +
      '<div class="errorImage">Invalid image file.</div>' +
      '</div></div>');
    $('.image-wrapper .img-' + inputCount).css('background-image', 'url(' + fallbackIMG + ')');
    inputCount++;
  });

});

function save(urlArr) {
  let imageBank = urlArr;
  chrome.storage.sync.set({
    key: imageBank
  });
  $('#submit').text('Saved');
  restore();
}

function status() {
  chrome.storage.sync.set({
    enabled: document.getElementById("enabled").checked
  });
  if (!document.getElementById("enabled").checked) {
    $('.ui-wrapper').removeClass('active');
  } else {
    $('.ui-wrapper').addClass('active');
  }
}

function restore() {
  chrome.storage.sync.get(null, function (items) {
  });
}


