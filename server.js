var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');

var config = {
    username:'thivyak',
    Database:'thivyak',
    host:'db.imad.hasura-app.io',
    port:'5432',
    password:process.env.DB_PASSWORD,
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());

function createTemplate(data) {
var title = data.title;
var heading = data.heading;
var date = data.date;
var content = data.content;
var htmlTemplate = `
<!doctype html>
    <head>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <title>ThivyaKanagendran - Personal Blog</title>
        <link rel="shortcut icon" type="image/x-icon" href="/ui/favicon.ico">
        <link href="https://fonts.googleapis.com/css?family=Open+Sans:400i" rel="stylesheet">
        <link href="/ui/style.css" rel="stylesheet" />

    </head>
    <body>
        <div id="head">
          <div class="header">
                    <img class="logo" src="/ui/logo.png" />
                    
                    <nav>
                       <a class="navbar" href="/">Home</a>
                       <a class="navbar" href="/about">About</a>
                       <a class="navbar" href="/articles/article-three">Articles</a>
                    </nav>
            </div>
                <span>
                    <h1 class="about">Articles</h1>
                </span>
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
            <div class="comments">
                <h3>
                  Post your comments:
                </h3>
               <textarea id="comment" placeholder="Add Comments" rows="4" cols="50"></textarea>
                   <ul id="comment-list" class="">
                   </ul>
               <br/><br/>
               <input type="submit" id="submitbtn" value="Submit">
            </div>
            
            <footer>
            <div id="footer-container">
            	<div class="social">
            	    <h3>Stay Connected</h3>
            	    
            	    <a class="social LinkedIn" href="https://in.linkedin.com/in/thivya-kanagendran-9b16185b">
            	    <img src="/ui/Linkedin.png"/>
            	    </a>
            	    
            	    <a class="social Facebook" href="https://www.facebook.com/thivya.kanagendran">
            	    <img src="/ui/fb.png"/>
            	    </a>
            	    
            	</div>
            	
            	<div class="contact">
            	    <h3>Contact Us</h3>
            	    <form class="contact" name="form" method="post">
            	        <label for="name">Name</label><br>
            	        <input class="text" name="name" type="text" />
            	        <br><br>
            	        
            	        <label for="email">Email</label><br>
            	        <input class="text" name="email" type="text" />
            	        <br><br>
            	        
            	        <label for="message">Message</label><br>
            	        <textarea class="message" name="message"></textarea>
            	        <br><br>
            	        
            	        <input class="submit" name="submit" type="submit" value="Submit" />
            	        
            	    </form>
            	</div>
            	
            	<div class="copyright">
            	    <h4>Copyright © Thivya Kanagendran</h4>
            	</div>
            </div>
        </footer>
            
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

function hash(input,salt)
{
    //how do we create a hash
    var hashed = crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
    return ["pbkdf2",10000,salt,hashed.toString('hex')].join('$');
}

app.get('/hash/:input',function(req,res) {
    var hashedString=hash(req.params.input,'this-is-a-random-string');
    res.send(hashedString);
    });
    
app.post('/create-user',function(req,res){
    //username
    //password
    //In JSON format
    var username = req.body.username;
    var password = req.body.password;
    var salt = crypto.randomBytes(128).toString('hex');
    var dbString = hash(password,salt);
    pool.query('INSERT INTO "user" (username,password) values ($1,$2)', [username,dbString], function(err, result){
        if(err){
            res.status(500).send(err.toString());
        } else {
            res.send('User created Successfully:' + username);
          }
    });
});


app.post('/login',function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    
    pool.query('SELECT * from "user" WHERE username = $1',[username], function(err, result){
        if(err){
            res.status(500).send(err.toString());
        } else {
            if(result.rows.length===0)
            {
                res.send(403).send('username/password is invalid');
            }
            else{
                //Match the password
                var dbString = result.rows[0].password;
                var salt = dbString.split('$')[2];
                var hashedPassword = hash(password,salt); //creating a hash based on the password submitted and orginial salt.
                if(hashedPassword===dbString)
                {
                      res.send('Right Credentials!');
                }
                else
                {
                    res.send(403).send('username/password is invalid');
                }
            }
          }
    });
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
app.get('/submit-comment',function(req,res){ //URL:/articleName/?comment=xxx
   var comment = req.query.comment;
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

app.get('/ui/favicon.ico', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'favicon.ico'));
});



var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
