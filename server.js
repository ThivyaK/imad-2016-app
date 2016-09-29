var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

var articles= {
   'article-one':{
title:'Article-One | Thivya Kanagendran',
date:'Sep5 , 2016',
heading:'Article One',
content:`
	<p>
   		This is the content for my first article.This is the content for my first article.This is the content for my first articl. This is the content for my first article.This is the content for my first article.This is the content for my first article.
	</p>
	<p>
   		This is the content for my first article.This is the content for my first article.This is the content for my first articl. This is the content for my first article.This is the content for my first article.This is the content for my first article.
	</p>
	<p>
   		This is the content for my first article.This is the content for my first article.This is the content for my first articl. This is the content for my first article.This is the content for my first article.This is the content for my first article.
	</p>`

},

  'article-two':{
title:'Article-Two| Thivya Kanagendran',
date:'Sep10 , 2016',
heading:'Article Two',
content:`
	<p>
   		This is the content for my second article.
	</p>
	<p>
   		This is the content for my second article.
	</p>
	<p>
   		This is the content for my second article.
	</p>`

},

   'article-three':{
title:'Article-Three| Thivya Kanagendran',
date:'Sep15 , 2016',
heading:'Article Three',
content:`
	<p>
   		This is the content for my Third article.
	</p>
	<p>
   		This is the content for my Third article.
	</p>
	<p>
   		This is the content for my Third article. 
	</p>`
    }

};



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
                ${date}
            </div>
            <div>
                ${content}
                
            </div>
        </div>
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
  res.sendFile(path.join(__dirname, 'ui', 'Hi.html'));
});

app.get('/:articleName', function(req, res){
//articleName==='article-one'
//articles[articleName]=== {} content object for article-one
    var articleName = req.params.articleName;
    res.send(createTemplate(articles[articleName]));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui' , 'main.js'));
});

app.get('/ui/pROFILEPIC.JPG', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'pROFILEPIC.JPG'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
