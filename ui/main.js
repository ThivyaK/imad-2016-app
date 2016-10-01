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
        if(request.status === 200)
        {
            var counterResponse = request.responseText;
            var span = document.getElementById('count');
            span.innerHTML = counterResponse.toString();
        }
        
        //Not done yet
    }
    
   }

  //Make the request to the counter endpoint
  request.open('GET','http://thivyak.imad.hasura-app.io/counter',true);
  request.send(null);
};


//Submit name  code
var submitbtn = document.getElementById('submit');
submit.onclick = function() {
      // Make a request to the server and send the name
       var request = new XMLHttpRequest();
      
      //capture the response & store it in a variable
      request.onreadystatechange = function() {
        if(request.readyState === XMLHttpRequest.DONE )
        //Take some action
        {
            if(request.status === 200)
            {
              //capture the list of names and render it as a list
              var names = request.responseText;
              names = JSON.parse(names);
              var list = "";
              for(var i=0; i<names.length; i++)
              {
                  list += '<li>' + names[i] + '</li>';
              }
              
              var ul = document.getElementById('ul-list');
              ul.innerHTML = list;
            }
            
            //Not done yet
        }
      }
         //Make the request
          var nameInput = document.getElementById('name');
          var name = nameInput.value;
          request.open('GET','http://thivyak.imad.hasura-app.io/submit-name/?name=' + name,true);
          request.send(null);
};

//Submit comment code
var commentInput = document.getElementById('comment');
var comment = commentInput.value;
var submit = document.getElementById('submit-comment');
submit.onclick = function() {
  //Make a request to the server and send the comments
  
  //capture the comment list and store it in a variable
  var comments = ['comment1','comment2','comment3','comment4'];
  var list="";
  for(var i=0;i<comments.length;i++) {
      list += '<li>' + comments[i] + '</li>'
  }
  //Make the request
};
    

      
    
