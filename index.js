const express = require('express');
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dns = require('dns');
const urlparser = require('url');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/views'));


// Basic Configuration
mongoose.connect('mongodb+srv://jashan1995:Khushman@cluster0.wb8mi.mongodb.net/Url_Shortener', { useNewUrlParser: true, useUnifiedTopology: true });
console.log(mongoose.connection.readyState);

const Schema = mongoose.Schema;
const userSchema = new Schema (
  {
    url: { type: String, unique: true }
  }
);

const Url = mongoose.model('Url', userSchema);

app.get('/', function (req, res) {

  res.sendFile(__dirname + "/index.html");
    
    
  });


app.post('/shorturl', async (req,res) => {

    const bodyurl = req.body.url;
  
        console.log("2");

        dns.lookup(urlparser.parse(bodyurl).hostname, (error,address) => {
         
          if(!address)
          {
            res.json({error:"Invalid URL"})
          }
          else
          {
            let insertUrl = new Url({url: bodyurl})
            insertUrl.save((err,data) => {
              if(err){
                console.log("o");
                res.json("Url already exists in the Database");
              }
              else{
                res.json({
                    original_url: data.url,
                    short_url: data.id
              
                })
              }
            })
        }
  });
  }); 

app.get("/shorturl/:id", (req,res) => {
    const id = req.params.id;
    Url.findById(id, (err,data) => {
        if(!data){

            res.json({error: "Invalid Url"})
        }
        else{
            res.redirect(data.url);
        }
    })
})
   
app.listen(3000, () => {

    console.log("Server started at port 3000");
  
  }) 