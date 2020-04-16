const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const RecipeSchema = new Schema({
    name:{
        type: String, 
        required:true
    },
    description:{
        type: String,
        required:true
    },
    date:{
        type: Date,
        default:Date.now
    },
    ingredients:[{
        type: mongoose.ObjectId, 
        ref: 'Ingredient'
    }],
    category: {
        type: mongoose.ObjectId,
        ref: 'Category'
    }
});

// eslint-disable-next-line no-undef
module.exports= Recipe =mongoose.model('Recipe', RecipeSchema, 'recipes');