const express = require("express");
const Cors =require('cors');
const morgan=require('morgan');
const path = require('path');
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
const tags = require('./routes/api/tags');
app.use('/api/tags', tags);

const uri = process.env.DB_CONNECTION;
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology:true,useFindAndModify:false }, ()=>{
    console.log('mongoose connected');
});

// app.get('/*', (req,res) => {
//     res.sendFile('index.html',{root: __dirname+'/client/build/'});
// });
app.get('*', (req,res) => {
    res.sendFile(path.resolve(__dirname,"../client","build","index.html"));
});

if(process.env.NODE_ENV==='production'){
    app.use(express.static('client/build'));
}

const port=process.env.PORT || 5002;

app.listen(port, ()=>console.log('Server started on port: '+port));