const express = require("express");
const Cors =require('cors');
const morgan=require('morgan');
require('dotenv/config');

const app = express();

app.use(Cors());
app.use(morgan('dev'));
app.use(express.json({limit:'50mb'}));
app.use(express.static('./client/build/'));

const recipes = require('./routes/api/recipes');
app.use('/api/recipes', recipes);
const categories = require('./routes/api/categories');
app.use('/api/categories', categories);
const users = require('./routes/api/users');
app.use('/api/users', users);

const uri = process.env.DB_CONNECTION;
const mongoose = require('mongoose');
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology:true,useFindAndModify:false }, ()=>{
    console.log('mongoose connected');
});

app.get('/*', (req,res) => {
    res.sendFile('index.html',{root: __dirname+'/client/build/'});
});

const port=process.env.PORT || 5002;

app.listen(port, ()=>console.log('Server started on port: '+port));