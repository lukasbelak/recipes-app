const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const IngredientSchema = new Schema({
    recipe:{
        type: mongoose.ObjectId, 
        ref: 'Recipe'
    },
    name:{
        type: String,
        required:true
    },
    quantity:{
        type: Number,
        required:true
    },
    unit:{
        type: String,
        required:true
    }
});

// eslint-disable-next-line no-undef
module.exports= Ingredient = mongoose.model('Ingredient', IngredientSchema,'ingredients');