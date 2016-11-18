var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var config = {
    username:'thivyak',
    Database:'thivyak',
    host:'db.imad.hasura-app.io',
    port:'5432',
    password:process.env.DB_PASSWORD,
};

var app = express();
app.use(morgan('combined'));

function createTemplate(data) {
var title = data.title;
var heading = data.heading;
var date = data.date;
var content = data.content;
var htmlTemplate = `
<html>
    <head>
        <title>
            ${title}
        </title>
         <meta name="viewport" content="width=device-width,initial-scale=1"/>
         <link href="/ui/style.css" rel="stylesheet"/>
    </head>
    <body>
        <div class="container">
            <div>
                <a href="/">Home</a>
            </div>
            <hr/>
            <h3>
                ${heading}
            </h3>
            <div>
                ${date.toDateString()}
            </div>
            <div>
                ${content}
                
            </div>
            <hr/>
            <div class="footer">
                <h3>
                  Post your comments:
                </h3>
               <textarea id="comment" placeholder="Add Comments" rows="4" cols="50"></textarea>
                   <ul id="comment-list" class="">
                   </ul>
               <br/><br/>
               <input type="submit" id="submitbtn" value="Submit">
            </div>
        </div>
        <script type="text/javascript" src="/ui/articleName.js">
        </script>
    </body>
</html>
 `;
 return htmlTemplate;
}

    var counter = 0;
app.get('/counter',function(req,res) {
    counter = counter + 1;
    res.send(counter.toString());
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/about', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'about.html'));
});

var pool = new Pool(config);
app.get('/test-db', function(req, res){
    //make a select request
    //return with the response results
    pool.query('SELECT * FROM Test', function(err, result){
        if(err){
            res.status(500).send(err.toString());
        } else {
            res.send(JSON.stringify(result));
          }
    });
});

var names = [];
app.get('/submit-name',function(req,res){ //URL:/submit-name?name=xxx
   var name = req.query.name;
   names.push(name);
   res.send(JSON.stringify(names));
});

var comments = [];
app.get('/articleName',function(req,res){ //URL:/articleName/?comment=xxx
   var comment = req.params.comment;
   comments.push(comment);
   res.send(JSON.stringify(comments));
});

app.get('/articles/:articleName', function(req, res){
//articleName==='article-one'
//articles[articleName]=== {} content object for article-one
pool.query("SELECT * FROM article WHERE title = $1",[req.params.articleName], function(err, result){
    if(err){
        res.status(500).send(err.toString());
    }else
    if(result.rows.length===0){
        res.status(404).send('Article not found');
    }else {
        var articledata = result.rows[0];
        res.send(createTemplate(articledata));
      }
});
});


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui' , 'main.js'));
});

app.get('/ui/articleName.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui' , 'articleName.js'));
});

app.get('/ui/about.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'about.jpg'));
});

app.get('/ui/Linkedin.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'Linkedin.png'));
});

app.get('/ui/fb.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'fb.png'));
});

app.get('/ui/bground.jpg', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'bground.jpg'));
});

app.get('/ui/logo.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'logo.png'));
});

app.get('/ui/pROFILEPIC.JPG', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'pROFILEPIC.JPG'));
});



var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
