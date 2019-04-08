"use strict";

var randomImages = "";

chrome.storage.sync.get('key', function (obj) {
    let randomImages = obj.key;
    replace(randomImages);
});

function replace(randomImages) {
    var imagesOld = document.getElementsByTagName("img");

    for (var i = 0; i < imagesOld.length; i++) {
        imagesOld[i].src = randomImages[rand(0, randomImages.length-1)];
    }
}
function rand(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}
