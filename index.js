const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const multer = require('multer');
require('dotenv').config();

var port = process.env.PORT || 8080;
var posts=[];

// Initialize Express
const app = express();

const storage = multer.diskStorage({
    destination : function (req, file, callBack){
        return callBack(null,path.join(__dirname, 'public', 'uploads') );
    },
    filename : function (req, file, callBack){
        return callBack(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });


// Setting up template engine
app.set('view engine', 'ejs');

// bodyParser Initialized
app.use(bodyParser.urlencoded({
    extended: true
}));

//Static Files Served
app.use('/public', express.static('public'));
 

// Home Route
app.get('/', (req, res) => {
    res.render("home.ejs", {
        posts: posts,
        // title: posts
    });
});
app.get('/posts/:activepost',(req,res)=>{
    posts.forEach((post)=>{
        if(_.lowerCase(post.title)==_.lowerCase(req.params.activepost)){
            res.render('post.ejs',{
                title:post.title,
                image: post.image,
                content:post.content
            });
        }
    });
});

app.get('/compose',(req,res)=>{
    res.render('compose.ejs');
});

// app.get("/image.png", (req,res) => {
//     res.sendFile(path.join(__dirname, `./uploads/${Date.now()}-${file.originalname}`));
// });

app.get('/', (req,res) => res.render('upload'))

app.post('/uploads', upload.single('upoad'), async(req , res)  =>{
    res.redirect("/")
})

app.post('/compose', upload.single('image'),(req,res)=>{
    const post={
        content:req.body.content,
        image : req.file.filename,
        title:req.body.title,
    }
    posts.push(post);
    res.redirect('/');
});

app.listen(port, () => {
    console.log("Server Up At " + port);
});