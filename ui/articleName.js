
//Submit comment code

var submitcomment = document.getElementById('submitbtn');
submitcomment.onclick = function() {
  //Make a request to the server and send the comments
        var request = new XMLHttpRequest();
      
      //capture the response & store it in a variable
      request.onreadystatechange = function() {
        if(request.readyState === XMLHttpRequest.DONE )
        //Take some action
        {
            if(request.status === 200)
            {
 
              var comments = request.responseText;
              comments = JSON.parse(comments);
              var list="";
              for(var i=0;i<comments.length;i++) {
                  list += '<li>' + comments[i] + '<hr/>' + '</li>';
              }
              
              var ulcomment = document.getElementById('comment-list');
              ulcomment.innerHTML = list;
            }
            //Not done
        }
      }
        //Make the request
        var commentInput = document.getElementById('comment');
        var comment = commentInput.value;
        request.open('GET','http://thivyak.imad.hasura-app.io/articlecomment/?comment' + comment,true);
        request.send(comment);
        
};
//Submit name code
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