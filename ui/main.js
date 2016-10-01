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


//counter code

var button = document.getElementById('counterbtn');
button.onclick = function() {
  // create a request object
  
  var request = new XMLHttpRequest();
  
  //capture the response & store it in a variable
  request.onreadystatechange = function() {
    if(request.readyState === XMLHttpRequest.DONE )
    //Take some action
    {
        if(request.state === 200)
        {
            var counterResponse = request.responseText;
            var span = document.getElementById('count');
            span.innerHTML = counterResponse.toString();
        }
    }
    
    //Not done yet
      
  };
  
  //Make the request to the counter endpoint
  request.open('GET','http://thivyak.imad.hasura-app.io/counter',true);
  request.send(null);
  
  
  
};

