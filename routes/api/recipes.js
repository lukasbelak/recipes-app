const express = require('express');
const router = express.Router();

const Recipe = require('../../models/Recipe');

// @route GET api/recipes
router.get('/',async(req,res)=>{ 
    try{
        await Recipe.find()
            .then(recipes => res.json(recipes))
    }catch(err){
        res.json({message:err})
    }
});

// @route GET api/recipes/:filter
router.get('/:filter',async(req,res)=>{
    try{
        let filter = req.params.filter;
        await Recipe.find({name :new RegExp(filter, 'i')}) //{ $contains: filter }
            .then(recipes => res.json(recipes))
    }catch(err){
        res.json({message:err})
    }
});

// @route GET api/recipes/:id
router.get('/:id',async(req,res)=>{
    try{
        await Recipe.findById(req.params.id)
            .then(recipe=>res.json(recipe))
    }catch(err){
        res.json({message:err})
    }
});

// @route POST api/recipes
router.post('/', async(req,res)=>{
    const newRecipe=new Recipe({
        name:req.body.name
    });
    try{
        await newRecipe.save().then(recipe=>res.json(recipe));
    }catch(err){
        res.json({message:err})
    }
});

// @route PATCH api/recipes/:id
router.patch('/:id', async(req,res)=>{
    try{
        await Recipe.updateOne({_id:req.params.id},
            {$set:{name:req.body.name}})
            .then(recipe=>res.json(recipe))
    }catch(err){
        res.json({message:err})
    }
});

// @route DELETE api/recipes/:id
router.delete('/:id',async(req,res)=>{
    try{
        await Recipe.deleteOne({_id:req.params.id})
        .then(recipe=>res.json(recipe));
    }catch(err){
        res.json({message:err})
    }
});

module.exports=router;