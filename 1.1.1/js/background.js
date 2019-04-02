 /**
 * Created by PhpStorm.
 * Author: m.white
 * Date: 25.01.19
 */

var pr = {
    debug: false,
    time_upload_cash: 3600 * 24 * 3 * 1000,
    name_menu_item: "Custom Picture Replacement",
    setting: {
        set: function (name, value) {
            localStorage[name] = value;
        },
        get: function (name) {
            if (localStorage[name] === 'true') return true;
            return false;
        }
    },
    data: {
        url: chrome.extension.getURL('/data/images.json'),
        check_data: [],
        check_active: false,
        get: function (cb) {
            pr.debug && console.log('data.get', arguments);
            $.get(pr.data.url, cb, 'json');
        },
        check: function (data, cb) {
            pr.debug && console.log('data.check', arguments);

            pr.data.check_data = [];
            pr.data.check_active = true;
            chrome.runtime.sendMessage({action: "pr_check_data", status: 'start', data: data});

            function load(i) {
                pr.debug && console.log('data.check load', arguments);
                i = i ? i : 0;

                var img = new Image();
                img.src = data[i];
                (function (image, index) {
                    image.onload = function (e) {
                        if ('naturalHeight' in this) {
                            if (this.naturalHeight + this.naturalWidth === 0) {
                                this.onerror();
                                return;
                            }
                        } else if (this.width + this.height == 0) {
                            this.onerror();
                            return;
                        }

                        pr.data.check_data.push(image.src);
                        chrome.runtime.sendMessage({action: "pr_check_data", status: 'load', data: data, check_data: pr.data.check_data, index: index});

                        check(++index);
                    }
                    image.onerror = function () {
                        check(++index);
                    }
                })(img, i)
            }

            function check(index) {
                pr.debug && console.log('data.check check', arguments);

                if (index <= data.length - 1) {

                    setTimeout(function () {
                        load(index)
                    }, 2000)

                } else {
                    pr.data.check_active = false;
                    chrome.runtime.sendMessage({action: "pr_check_data", status: 'finish', data: data, check_data: pr.data.check_data});
                    cb && cb()
                }
            }
            load();
        },
        init: function () {
            pr.debug && console.log('data.init', arguments);

            if (new Date(pr.setting.get('time_check')).getTime() < new Date().getTime() - pr.time_upload_cash) {

                pr.data.get(function (data) {
                    pr.data.check(data, function () {
                        pr.debug && console.log('data.init save data');
                        pr.setting.set('data.category', JSON.stringify(pr.data.check_data));
                        pr.setting.set('time_check', new Date());
                    })
                })
            } else {
                pr.debug && console.log('data.init set data');
                pr.check_data = JSON.parse(pr.setting.get('data'));
            }
        }
    },
    menu: {
        root_id: null,
        setting_id: null,
        power_id: null,
        create: function () {
            pr.debug && console.log('menu.create', arguments);

            pr.menu.root_id = chrome.contextMenus.create({
                title: pr.name_menu_item
            });

            pr.menu.power_id = chrome.contextMenus.create({
                title: pr.setting.get('power') ? 'Off' : 'On',
                parentId: pr.menu.root_id,
                onclick: function () {
                    pr.controller.powerChange();
                }
            });

            pr.menu.setting_id = chrome.contextMenus.create({
                title: 'Setting',
                parentId: pr.menu.root_id,
                onclick: function () {
                    pr.controller.settingOpen();
                }
            });

        },
        change: function () {
            pr.debug && console.log('menu.change', arguments);

            chrome.contextMenus.update(pr.menu.power_id, {
                title: pr.setting.get('power') ? 'Off' : 'On',
                onclick: function () {
                    pr.controller.powerChange();
                }
            });
        }
    },
    controller: {
        reloadTabs: function () {
            chrome.tabs.query({}, function (tabs) {
                for (var key in tabs) {
                    if (!/^chrome/.test(tabs[key].url)) {
                        chrome.tabs.reload(tabs[key].id);
                    }
                }
            });
        },
        powerChange: function (power) {
            pr.debug && console.log('controller.powerChange', arguments);

            if (power != undefined) pr.setting.set('power', power);
            else pr.setting.set('power', !pr.setting.get('power'));

            pr.menu.change();

            chrome.tabs.query({}, function (tabs) {
                for (var i = 0; i < tabs.length; ++i)
                    chrome.tabs.sendMessage(tabs[i].id, {action: "pr_change_power", power: pr.setting.get('power')});
            });
        },
        settingOpen: function () {
            pr.debug && console.log('controller.settingOpen', arguments);

            chrome.tabs.query({
                url: chrome.runtime.getURL('views/options.html')
            }, function (tabs) {
                if (tabs.length > 0) {
                    chrome.tabs.update(tabs[0].id, {active: true});
                } else {
                    chrome.tabs.create({
                        url: chrome.runtime.getURL('views/options.html')
                    });
                }
            });
        }
    },
    init: function (details) {
        pr.debug && console.log('init', arguments);

        if (!pr.setting.get('time_check')) {
            pr.setting.set('power', true);
            pr.setting.set('time_check', new Date());

            pr.controller.settingOpen();
            pr.controller.reloadTabs();
        }
        pr.menu.create();
        pr.data.init();
    }
}

chrome.runtime.onMessage.addListener(function (msg, sender, cb) {
    pr.debug && console.log('runtime.onMessage', arguments);

    if (msg.action == 'pr_set_power') {
        pr.controller.powerChange(msg.power);
    }
    if (msg.action == 'pr_get_power') {
        cb((localStorage.power === 'true'));
    }
    if (msg.action == 'pr_get_data') {
        cb(!pr.data.check_active ? pr.data.check_data : []);
    }
});

pr.init();
