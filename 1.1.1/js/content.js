 /**
 * Created by PhpStorm.
 * Author: m.white
 * Date: 25.01.19
 */

let pr = chrome.storage.sync.get(['key'], function (result) {
 });
pr.debug = false;
pr.setting = {
    class_name: 'pr-image-replace',
    variation: 4
}
pr.image = {
    change: function () {
        pr.debug && console.log('image.change');

            chrome.storage.sync.get(['key'], function (data) {

            if (data.length) {
                $('img:not([src *= "codebymick.com"])')/*$("img:not('." + pr.setting.class_name + "')")*/.each(function () {
                    if ($(this).width() / $(this).height() < pr.setting.variation && $(this).height() / $(this).width() < pr.setting.variation) {
                        $(this).css({width: $(this).width(), height: $(this).height()})
                            .data('pr-url-origin', this.src)
                            .attr('src', data[Math.floor(Math.random() * data.length)])/*
                            .addClass(pr.setting.class_name)*/;
                    }
                })
            }
        });
        setTimeout(function () {
            pr.image.change();
        }, 2000);
    },
    retrieve: function () {
        pr.debug && console.log('image.retrieve');

        $('img[src *= "codebymick.com"]')/*$('img.' + pr.setting.class_name)*/.each(function () {
            $(this).attr('src', $(this).data('pr-url-origin'))/*.removeClass(pr.setting.class_name)*/;
        });
    }
}

chrome.runtime.onMessage.addListener(function (msg, sender, cb) {
    pr.debug && console.log('chrome.runtime message', arguments);
    if (msg.action == 'pr_change_power') {
        if (msg.power) {
            pr.image.change();
        } else {
            pr.image.retrieve();
        }
    }
    if (msg.action == 'pr_check_data') {
        if (msg.status == 'start') {
            pr.image.retrieve();
        } else if (msg.status == 'finish') {
            pr.image.change();
        } else if (msg.status == 'load') {
            pr.image.retrieve();
        }
    }
});

chrome.runtime.sendMessage({action: "pr_get_power"}, function (power) {
    pr.debug && console.log('chrome.runtime pr_get_power', power);
    if (power) {
        pr.image.change();
    } else {
        pr.image.retrieve();
    }
});
