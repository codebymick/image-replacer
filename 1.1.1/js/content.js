"use strict";

var randomImage = "";

function replace() {
    var images = document.getElementsByTagName("img");
    for (var i = 0; i < images.length; i++) {
        images[i].src = randomImage;
    }
}
function rand(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

chrome.storage.sync.get('key', function (obj) {
    let randomImage = obj.key[rand(0, obj.key.length)];
    console.log(randomImage);
    let css = document.createElement("style");
    css.innerHTML = "img { content: url(\"" + randomImage + "\") !important; }";
    document.body.appendChild(css);
    window.setInterval(replace, 3000);
    replace();
});

