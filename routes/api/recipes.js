const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Schema=mongoose.Schema;

const Recipe = require('../../models/Recipe');
const Ingredient = require('../../models/Ingredient');

// @route GET api/recipes
router.get('/',async(req,res)=>{ 
    try{
        await Recipe.find().populate("ingredients").then(recipes => res.json(recipes))
    }catch(err){
        res.json({message:err.message})
    }
});

// @route GET api/recipes/byfilter/:filter
router.get('/byfilter/:filter',async(req,res)=>{
    try{
        let filter = req.params.filter;
        await Recipe.find({name :new RegExp(filter, 'i')}).populate('ingredients') //{ $contains: filter }
            .then(recipes => res.json(recipes))
    }catch(err){
        res.json({message:err.message})
    }
});

// @route GET api/recipes/byid/:id
router.get('/byid/:id',async(req,res)=>{
    try{
        await Recipe.findById(req.params.id).populate('ingredients')
            .then(recipe=>res.json(recipe))

    }catch(err){
        res.json({message:err.message})
    }
});

const createRecipe = (recipe) => {
    return Recipe.create(recipe).then(docRecipe => {
        return docRecipe;});
};

const createIngredient = (ingredient) => {
    return Ingredient.create(ingredient).then(docIngredient => {
        return docIngredient;
    });
};

// @route POST api/recipes
router.post('/', async(req,res)=>{
    const newRecipe={
        name:req.body.name,
        description:req.body.description
    };

    try{
        let recipe = await createRecipe(newRecipe);

        req.body.ingredients.forEach(async ingredient=>{
            let newIngredient = {
                recipe: recipe._id,
                name:ingredient.name,
                quantity:ingredient.quantity,
                unit:ingredient.unit
            }
            
            ingredient = await createIngredient(newIngredient);
            recipe.ingredients.push(ingredient);
            await recipe.save();
        });
                  
        res.json(recipe._id);
    }catch(err){
        res.json({message:err.message})
    }
});

// @route PATCH api/recipes/:id
router.patch('/:id', async(req,res)=>{
    try{
        await Recipe.updateOne({_id:req.params.id},
            {$set:{
                name:req.body.name,
                description:req.body.description,
                ingredients:[{
                    name:req.body.ingredients.name,
                    quantity:req.body.ingredients.quantity,
                    unit:req.body.ingredients.unit
                }] }})
            .then(recipe=>res.json(recipe))
    }catch(err){
        res.json({message:err.message})
    }
});

// @route DELETE api/recipes/:id
router.delete('/:id',async(req,res)=>{
    try{
        await Recipe.deleteOne({_id:req.params.id})
        .then(recipe=>res.json(recipe));
    }catch(err){
        res.json({message:err.message})
    }
});

module.exports=router;