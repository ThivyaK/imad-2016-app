
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
              var list="";
              for(var i=0;i<comments.length;i++) {
                  list += '<li>' + comments[i] + '</li>';
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
        request.open('GET','http://thivyak.imad.hasura-app.io/articleName/?comment=' + comment,true);
        request.send(comment);
        
};
