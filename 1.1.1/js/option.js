 /**
 * Created by PhpStorm.
 * Author: m.white
 * Date: 25.01.19
 */

$(document).ready(function () {
    $('.dropdown').click(function(){
        $('.dropdown-menu').addClass('active');
    });
    chrome.runtime.onMessage.addListener(function (msg, sender, cb) {
        if (msg.action == 'pr_change_power') {
            $('#change_status .btn').removeClass('btn-success')
            $('#change_status [data-power=' + msg.power + ']').addClass('btn-success');
        }
        if (msg.action == 'pr_check_data') {
            var $check_status = $('#check_status');
            var $random_image = $('#random_image');
            $check_status.slideDown();
            if (msg.status == 'start') {
                $check_status.text('Start checking images (please wait while checking)');
            } else if (msg.status == 'finish') {
                $check_status.text('Finish checking images').slideUp(1000);
//                $random_image.slideDown(1000)
//                    .find('img').attr('src', msg.check_data[Math.floor(Math.random() * msg.check_data.length)]);
            } else if (msg.status == 'load') {
                $check_status.text('Checking images: ' + (msg.index + 1) + ' of ' + msg.data.length + ' (please wait while checking)');
                $random_image.slideDown(1000).find('img').attr('src', msg.check_data[msg.check_data.length - 1]);
            }
        }
    });

    chrome.runtime.sendMessage({action: "pr_get_power"}, function (power) {
        $('#change_status .btn').removeClass('btn-success');
        $('#change_status [data-power=' + power + ']').addClass('btn-success');
    });

    chrome.runtime.sendMessage({action: "pr_get_data"}, function (data) {
        if (data.length) {
            $('#random_image').slideDown().find('img').attr('src', data[Math.floor(Math.random() * data.length)]);
        } else {
            $('#check_status').slideDown().text('Start checking images (please wait while checking)');
        }
    });

    $('#change_status .btn').on('click', function () {
        chrome.runtime.sendMessage({action: "pr_set_power", power: $(this).data('power')});
    })

})
