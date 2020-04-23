const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
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
        type: String,
        required: true
    },
    img: { 
        data: Buffer, 
        contentType: String
    },
    youtube:{
        type:String
    }
});

RecipeSchema.plugin(mongoosePaginate);

// eslint-disable-next-line no-undef
module.exports= Recipe =mongoose.model('Recipe', RecipeSchema, 'recipes');