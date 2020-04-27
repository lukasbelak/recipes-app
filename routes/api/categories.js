const express = require('express');
const router = express.Router();

const Category = require('../../models/Category');

// @route GET api/categories
router.get('/',async(req,res)=>{ 
    try{
        console.log('before get cats');
        await Category.find().then(categories => res.json(categories));
        console.log('in get cats');
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
router.delete('/byid/:id', async(req,res)=>{
    try{
        const category = await Category.deleteOne({_id:req.params.id})
        res.json(category);
    }catch(err){
        res.json({message:err.message})
    }

    // try{
    //     await Category.findById({_id:req.params.id})
    //     .then(category=>{
    //         Category.deleteMany({category:category._id}, (err, result)=>{
    //             if(err) {
    //                 console.log(err.message);
    //                 res.json(err.message);
    //             } else {
    //                 category.deleteOne();
    //                 res.json(category);
    //             }
    //         });
    //     });
    // }catch(err){
    //     res.json({message:err.message});
    // }
});

// @route DELETE api/categories
router.delete('/byname/:name', async(req,res)=>{
    try{
        const category = await Category.deleteOne({name:req.params.name})
        res.json(category);
    }catch(err){
        res.json({message:err.message})
    }

    // console.log('delete');
    // try{
    //     await Category.find({name:req.params.name})
    //     .then(category=>{
    //         console.log('found for delete '+category._id + 'origName: '+ req.params.name);
    //         if(category){
    //             Category.delete({category:category._id}, (err, result)=>{
    //                 if(err) {
    //                     console.log(err.message);
    //                     res.json(err.message);
    //                 } else {
    //                     //category.delete();
    //                     res.json(category);
    //                     console.log('deleted');
    //                 }
    //             });
    //         }
    //     });
    // }catch(err){
    //     res.json({message:err.message});
    // }
});

module.exports=router;