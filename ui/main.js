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


function loadLoginForm () {
    var loginHtml = `
        <h3>Login/Register to unlock awesome features</h3>
        <input class="text" type="text" id="username" placeholder="username" />
        <br/><br/>
        <input class="text" type="password" id="password" />
        <br/><br/>
        <input class="submit" type="submit" id="login_btn" value="Login" />
        <input class="submit" type="submit" id="register_btn" value="Register" />
        `;
    document.getElementById('login_area').innerHTML = loginHtml;
    
    
    //register username/password
    var register = document.getElementById('register_btn');
    register.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  alert('User created successfully');
                  register.value = 'Registered!';
              } else {
                  alert('Could not register the user');
                  register.value = 'Register';
              }
          }
        };
        
        // Make the request
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        console.log(username);
        console.log(password);
        request.open('POST', '/create-user', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({username: username, password: password}));  
        register.value = 'Registering...';
    
    };
}

function loadLoggedInUser (username) {
    var loginArea = document.getElementById('login_area');
    loginArea.innerHTML = `
        <h3> Hi <i>${username}</i></h3>
        <a href="/logout">Logout</a>
    `;
}

function loadLogin () {
    // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                loadLoggedInUser(this.responseText);
            } else {
                loadLoginForm();
            }
        }
    };
    
    request.open('GET', '/check-login', true);
    request.send(null);
}

function loadArticles () {
        // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var articles = document.getElementById('articles');
            if (request.status === 200) {
                var content = '<ul>';
                var articleData = JSON.parse(this.responseText);
                for (var i=0; i< articleData.length; i++) {
                    content += `<li>
                    <a href="/articles/${articleData[i].title}">${articleData[i].heading}</a>
                    (${articleData[i].date.split('T')[0]})</li>`;
                }
                content += "</ul>";
                articles.innerHTML = content;
            } else {
                articles.innerHTML('Oops! Could not load all articles!');
            }
        }
    };
    
    request.open('GET', '/get-articles', true);
    request.send(null);
}


// The first thing to do is to check if the user is logged in!
loadLogin();

// Now this is something that we could have directly done on the server-side using templating too!
loadArticles();


//Submit username/password to login
window.onload = function(){
var submitbtn = document.getElementById('login_btn');
     submitbtn.onclick = function() {
      // Make a request to the server and send the name
       var request = new XMLHttpRequest();
      
      //capture the response & store it in a variable
      request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
              // Take some action
              if (request.status === 200) {
                  submitbtn.value = 'Success!';
              } else if (request.status === 403) {
                  submitbtn.value = 'Invalid credentials. Try again?';
              } else if (request.status === 500) {
                  alert('Something went wrong on the server');
                  submitbtn.value = 'Login';
              } else {
                  alert('Something went wrong on the server');
                  submitbtn.value = 'Login';
              }
              loadLogin();
          }  
          // Not done yet
        };
         //Make the request
          var username = document.getElementById('username').value;
          var password = document.getElementById('password').value;
          console.log(username);
          console.log(password);
          request.open('POST', '/login',true);
          request.setRequestHeader('Content-Type', 'application/json');
          request.send(JSON.stringify({username: username, password: password}));  
          submitbtn.value = 'Logging in...';
};
};


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







    

      
    
