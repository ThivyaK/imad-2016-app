console.log('Loaded!');

//change the value of main-text div
var element = document.getElementById('main-text');

element.innerHtml = 'New value !';

//Move the image

var imgElement = document.getElementById('coder');
var marginLeft = 0;

marginLeft = marginLeft + 10;
coder.style.marginLeft = marginLeft + 'px';
imgElement.onclick = function() {
    var interval = setInterval(moveRight,100);
}