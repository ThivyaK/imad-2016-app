console.log('Loaded!');

//change the value of main-text div

//var element = document.getElementById('main-text');

//element.innerHTML = 'New value !';

//Move the image

var imgElement = document.getElementById('coder');
var marginLeft = 0;
function moveRight() {
marginLeft = marginLeft + 1;
coder.style.marginLeft = marginLeft + 'px';
}
imgElement.onclick = function() {
    var interval = setInterval(moveRight,50);
};

var button = document.getElementById('counterbtn');
button.onclick = function() {
  // Make a request to the server
  
  //process the request and get the response
  
  //Render the response
  var counter = 0;
  counter = counter + 1;
  
  
};

