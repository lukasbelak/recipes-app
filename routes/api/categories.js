const express = require('express');
const router = express.Router();

const Category = require('../../models/Category');

// @route GET api/categories
router.get('/',async(req,res)=>{ 
    try{
        await Category.find().then(categories => res.json(categories))
    }catch(err){
        res.json({message:err.message})
    }
});

// @route GET api/categories/:id
router.get('/:id',async(req,res)=>{
    try{
        await Category.findById(req.params.id)
            .then(category=>res.json(category))

    }catch(err){
        res.json({message:err.message})
    }
});

// @route POST api/categories
router.post('/', async(req,res)=>{
    const newCategory={
        name:req.body.name
    };

    try{
        const category = await Category.create(newCategory)
        res.json(category._id);
    }catch(err){
        res.json({message:err.message})
    }
});

// @route DELETE api/categories
router.delete('/:id', async(req,res)=>{
    try{
        const category = await Category.deleteOne({_id:req.params.id})
        res.json(category);
    }catch(err){
        res.json({message:err.message})
    }
});

module.exports=router;