const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const RecipeSchema = new Schema({
    name:{
        type: String, 
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

// eslint-disable-next-line no-undef
module.exports= Recipe =mongoose.model('recipe', RecipeSchema);