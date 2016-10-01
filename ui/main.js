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

//counter

var button = document.getElementById('counterbtn');
button.onclick = function() {
  // Make a request to the counter endpoint
  
  //capture the response & store it in a variable
  
  //Render the variable in the correct span
  counter = counter + 1;
  var span = document.getElementById('count');
  span.innerHTML = counter.toString();
  
};

