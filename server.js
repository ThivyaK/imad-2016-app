var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

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
app.use(session({
    secret:'RandomSecretValue',
    cookie:{maxAge:1000*60*60*24*30}
}));

function createTemplate(data) {
var title = data.title;
var heading = data.heading;
var date = data.date;
var content = data.content;
var htmlTemplate = `
<!doctype html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>ThivyaKanagendran - Personal Blog</title>
        <link rel="shortcut icon" type="image/x-icon" href="/ui/favicon.ico">
        <link href="https://fonts.googleapis.com/css?family=Delius+Unicase:700" rel="stylesheet">
        <link href="/ui/style.css" rel="stylesheet" />
        <script src="https://use.fontawesome.com/57e7ff26f3.js"></script>

    </head>
    <body>
        <div id="head">
          <div class="header">
                    <img class="logo" src="/ui/logo.png" />
                    
                    <nav>
                       <a class="navbar" href="/">HOME</a>
                       <a class="navbar" href="/about">ABOUT</a>
                       <a class="navbar" href="/articles/article-three">ARTICLES</a>
                       <a class="navbar" href="/contact">CONTACT</a>
                    </nav>
            </div>
                <span>
                    <h1 class="about">Articles</h1>
                </span>
        </div>
        
        <div id="articles-container">
            <span>
                <h3>My Articles</h3>
            </span>
            <div id="articles">
                <center>Loading articles...</center>
            </div>
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
            
            <h4>Comments</h4>
            
              <div id="comment_form">
              </div>
              
              <div id="comments">
                <center>Loading comments...</center>
              </div>
            
            <footer class="footer">
            <div class="social">
                <a href="https://www.facebook.com/thivya.kanagendran"><i class="fa fa-facebook-square" aria-hidden="true"></i></a>
                <a href="https://in.linkedin.com/in/thivya-kanagendran-9b16185b"><i class="fa fa-linkedin-square" aria-hidden="true">
                </i></a>
                <a href="#"><i class="fa fa-twitter-square" aria-hidden="true"></i></a>
            </div>   
            <div class="copyright">
                <p>Copyright © 2016|Thivya Kanagendran</p>
            </div>
        </footer>
        <script type="text/javascript" src="/ui/main.js"></script>    
        <script type="text/javascript" src="/ui/articleName.js"></script>
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

app.get('/contact', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'contact.html'));
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
                    //set session
                    
                      req.session.auth = {userId: result.rows[0].id};
                    
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

app.get('/check-login', function (req, res) {
   if (req.session && req.session.auth && req.session.auth.userId) {
       // Load the user object
       pool.query('SELECT * FROM "user" WHERE id = $1', [req.session.auth.userId], function (err, result) {
           if (err) {
              res.status(500).send(err.toString());
           } else {
              res.send(result.rows[0].username);    
           }
       });
   } else {
       res.status(400).send('You are not logged in');
   }
});

app.get('/logout', function (req, res) {
   delete req.session.auth;
   res.send('<html><body>Logged out!<br/><br/><a href="/">Back to home</a></body></html>');
});


var pool = new Pool(config);

app.get('/get-articles', function (req, res) {
   // make a select request
   // return a response with the results
   pool.query('SELECT * FROM article ORDER BY date DESC', function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
});


app.get('/get-comments/:articleName', function (req, res) {
   // make a select request
   // return a response with the results
   pool.query('SELECT comment.*, "user".username FROM article, comment, "user" WHERE article.title = $1 AND article.id = comment.article_id AND comment.user_id = "user".id ORDER BY comment.timestamp DESC', [req.params.articleName], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
});


app.post('/submit-comment/:articleName', function (req, res) {
   // Check if the user is logged in
    if (req.session && req.session.auth && req.session.auth.userId) {
        // First check if the article exists and get the article-id
        pool.query('SELECT * from article where title = $1', [req.params.articleName], function (err, result) {
            if (err) {
                res.status(500).send(err.toString());
            } else {
                if (result.rows.length === 0) {
                    res.status(400).send('Article not found');
                } else {
                    var articleId = result.rows[0].id;
                    // Now insert the right comment for this article
                    pool.query(
                        "INSERT INTO comment (comment, article_id, user_id) VALUES ($1, $2, $3)",
                        [req.body.comment, articleId, req.session.auth.userId],
                        function (err, result) {
                            if (err) {
                                res.status(500).send(err.toString());
                            } else {
                                res.status(200).send('Comment inserted!');
                            }
                        });
                }
            }
       });     
    } else {
        res.status(403).send('Only logged in users can comment');
    }
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

app.get('/ui/icon-linkedin.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'icon-linkedin.png'));
});

app.get('/ui/fbs.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'fbs.png'));
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
