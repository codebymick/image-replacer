/**
 * Author: m.white
 * Date: 25.01.19
 */
$(document).ready(function () {
  $('#dLabel').change(function () {
    let $option     = $('#dLabel').find('option:selected'),
        selected    = $option.attr('class'),
        initialText = $('.editable').val(),
        imageFolder = $option.val();

    $('.editOption').val(initialText);
    if (selected == "editable") {
      $('.editOption').show();
      $('.editOption').keyup(function () {
        let editText = $('.editOption').val();
        $('.editable').val(editText);
        $('.editable').html(editText);
        imageFolder = editText;
      });

    } else {
      $('.editOption').hide();
    }
  });

  $('.submit').click(function () {
    let $option     = $('#dLabel').find('option:selected'),
        selected    = $option.attr('class'),
        initialText = $('.editable').val(),
        imageFolder = $option.val(),
        unset       = null || `example: https://example.com/images/`;

    $('.editOption').val(initialText);
    if (selected == "editable") {
      $('.editOption').show();
      $('.editOption').keyup(function () {
        let editText = $('.editOption').val();
        $('.editable').val(editText);
        $('.editable').html(editText);
        imageFolder = editText;
      });

    } else {
      $('.editOption').hide();
    }

    imageFolder !== unset ? $('#prompt').removeClass('show') : null;
    // console.log(imageFolder);
    $('.button.submit').click(searchImages(imageFolder));

    function searchImages(imageFolder) {
      imageFolder !== unset ? getFiles() : alert("you haven't selected a correct file location");
    }
  });
});

function getFiles() {
  chrome.runtime.onMessage.addListener(function (msg, sender, cb) {
    if (msg.action == 'pr_change_power') {
      $('#change_status .btn').removeClass('btn-success');
      $('#change_status [data-power=' + msg.power + ']').addClass('btn-success');
    }
    if (msg.action == 'pr_check_data') {
      let $check_status = $('#check_status'),
          $random_image = $('#random_image');
      $check_status.slideDown();
      if (msg.status == 'start') {
        $check_status.text('Start checking images (please wait while checking)');
      } else if (msg.status == 'finish') {
        $check_status.text('Finish checking images').slideUp(1000);
        $random_image.fadeIn(1000)
        .find('img').attr('src', msg.check_data[Math.floor(Math.random() * msg.check_data.length)]);
      } else if (msg.status == 'load') {
        $check_status.text('Checking images: ' + (msg.index + 1) + ' of ' + msg.data.code.length + ' (please wait while checking)');
        $random_image.fadeIn(1000).find('img').attr('src', msg.check_data[msg.check_data.length - 1]);
      }
    }
  });

  chrome.runtime.sendMessage({action: "pr_get_power"}, function (power) {
    $('#change_status .btn').removeClass('btn-success');
    $('#change_status [data-power=' + power + ']').addClass('btn-success');
  });

  chrome.runtime.sendMessage({action: "pr_get_data"}, function (data) {
    if (data.length) {
      // console.log(data);
      $('#random_image').slideDown().find('img').attr('src', data[Math.floor(Math.random() * data.length)]);
    } else {
      $('#check_status').slideDown().text('Start checking images (please wait while checking)');
    }
  });

  $('#change_status .btn').on('click', function () {
    chrome.runtime.sendMessage({action: "pr_set_power", power: $(this).data('power')});
  })
}
