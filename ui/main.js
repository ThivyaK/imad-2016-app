//console.log('Loaded!');

//change the value of main-text div

//var element = document.getElementById('main-text');

//element.innerHTML = 'New value !';

//Move the image
//var imgElement = document.getElementById('coder');
//var marginLeft = 0;
//function moveRight() {
//marginLeft = marginLeft + 1;
//coder.style.marginLeft = marginLeft + 'px';
//}
//imgElement.onclick = function() {
  //  var interval = setInterval(moveRight,50);
//};


//counter code

// var button = document.getElementById('counterbtn');
// button.onclick = function() {
//   // create a request object
  
//   var request = new XMLHttpRequest();
  
//   //capture the response & store it in a variable
//   request.onreadystatechange = function() {
//     if(request.readyState === XMLHttpRequest.DONE )
//     //Take some action
//     {
//         if(request.status === 200)
//         {
//             var counterResponse = request.responseText;
//             var span = document.getElementById('count');
//             span.innerHTML = counterResponse.toString();
//         }
        
//         //Not done yet
//     }
    
//   }

//   //Make the request to the counter endpoint
//   request.open('GET','http://thivyak.imad.hasura-app.io/counter',true);
//   request.send(null);
// };


//Submit username/password to login
var submitbtn = document.getElementById('submit');
     submitbtn.onclick = function() {
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
              console.log('user logged in');
              alert('Logged in successfully');
            }
              else if(request.status === 403){
                  alert('Username/password is incorrect');
              }
              else if(request.status === 500){
                  alert('Something went wrong on the server');
              }
           
        }
      }
         //Make the request
          var username = document.getElementById('username').value;
          var password = document.getElementById('password').value;
          console.log(username);
          console.log(password);
          var name = nameInput.value;
          request.open('POST','http://thivyak.imad.hasura-app.io/login',true);
          request.setRequestHeader('Content-Type','application/json');
          request.send(JSON.stringify({username:username,password:password}));
};







    

      
    
