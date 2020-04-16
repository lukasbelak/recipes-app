const express = require("express");
const bodyParser = require("body-parser");
require('dotenv/config');

const app = express();

app.use(bodyParser.json());
app.use(express.static('./client/build/'));

const recipes = require('./routes/api/recipes');
app.use('/api/recipes', recipes);
const categories = require('./routes/api/categories');
app.use('/api/categories', categories);

// const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DB_CONNECTION;
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//     console.log('mongodb connected');
//   const collection = client.db("mw_recipes").collection("recipes");
//   // perform actions on the collection object
//   client.close();
// });

const mongoose = require('mongoose');
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology:true }, ()=>{
    console.log('mongoose connected');
});

app.get('/*', (req,res) => {
    res.sendFile('index.html',{root: __dirname+'/client/build/'});
});

const port=process.env.PORT || 5000;

app.listen(port, ()=>console.log('Server started on port: '+port));