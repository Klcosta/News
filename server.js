// Dependencies 
var express = require("express");
var mongoose = require("mongoose");

//Scrapping requirements
var axios = require("axios");
var cheerio = require("cheerio");

//Configure Databases
var databaseUrl = "scraper";
var collections = ["scrapedData"];

//Connect mongojs to db variables
var db = require("./models")
// var PORT = 3000

var PORT = process.env.PORT || 3000;

//Set up server
var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Static public folder
app.use(express.static("public"));

// Connect to the Mongto DB
// mongoose.connect("mongodb://localhost/articlesdb")

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

//ROUTES

//index route
app.get("/", function(req,res){
    res.sendFile(path.join(__dirname + "./public/index.html"))
})


app.get("/scrape", function(req,res){
    axios.get("https://www.marca.com/futbol/futbol-femenino/mundial.html?intcmp=MENUMIGA&s_kw=mundial").then(function(response){
        var $ = cheerio.load(response.data);
        
        $(".mod-title").each(function(i, element){
           var result = {}
            
            const article = $(element).find("a").attr("title")
            const link = $(element).find("a").attr("href")
            console.log(article)
            console.log(link)

            result.title = article
            result.url = link

            console.log(result)

            db.Article.create(result)
                .then(function(dbArticle){
                    console.log(dbArticle)
                })
                .catch(function(err){
                    console.log(err);
                });
        });
        res.send("Scrape Complete");
    });
});

//Get all the articles
app.get("/articles", function(req,res){
    db.Article.find({})
        .then(function(dbArticle){
            res.json(dbArticle)
        })
        .catch(function(err){
            res.json(err)
        })
})

app.get("/notes", function(req,res){
    db.Note.find({})
        .then(function(dbNote){
            res.json(dbNote)
        })
        .catch(function(err){
            res.json(err)
        })
})

app.post("/articles/:id", function(req,res){
    console.log("req.body:")
    console.log(req.body)
    db.Note.create(req.body)
        .then(function(dbNote){
            return db.Article.findOneAndUpdate({_id: req.params.id}, {note:dbNote._id}, {new:true});
        })
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err){
            res.json(err);
        })
})

app.get("/notes/:id" , function(req,res){
    db.Article.findOne({_id:req.params.id})
})


//Start Server

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });