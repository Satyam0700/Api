const erpress = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = erpress();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded( {extended: true}));
app.use(erpress.static("public"));

mongoose.connect("mongodb://localhost:27017/wifDB");

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

///////////////////////////////Requests targeting Articles//////////////////


app.route("/articles")

.get(function(req, res){
    Article.find( function(err, foundArticles){
        if(!err){
        res.send(foundArticles)
        }else{
            res.send(err)
        }
    });
})

.post( function(req, res){
    const tit = req.body.title
    const cont = req.body.content

    const article1 = new Article({
        title: tit,
        content: cont
    });
    article1.save(function(err){
        if(!err){
            res.send("Successfully added a new article")
        }else{
            res.send(err)
        }
    });
})

.delete( function(req, res){
    Article.deleteMany(function(err){
        if(!err){
            console.log("Success")
        }else{
            console.log(err)
        }
    });
});

///////////////////////////////Requests targeting a Specific Articles//////////////////

app.route("/articles/:articleTile")

.get(function(req, res){
    Article.findOne({title: req.params.articleTile}, function(err, foundArticles){
        if(foundArticles){
            res.send(foundArticles);
        }else{
            res.send("No article matching that title was found.");
        }
    });
})

.put(function(req, res){
    Article.update(
        {title: req.params.articleTile},
         {title: req.body.title, 
          content: req.body.content  
        }, 
         {overwrite: true},
          function(err){
            if(!err){
                console.log("Successfully updated articles")
            }else{
                console.log(err)
            }
    });
})

.patch(function(req, res){
    Article.update(
        {title: req.params.articleTile},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Sucess update articles.")
            }else{
                res.send(err)
            }
    });
})

.delete(function(req, res){
    Article.deleteOne({title: req.params.articleTile}, function(err){
        if(!err){
            console.log("Success")
        }else{
            console.log(err)
        }
    })
})


app.listen(PORT, function(req, res){
    console.log("Running on " + PORT)
});