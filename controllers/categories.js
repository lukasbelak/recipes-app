const Category = require('../models/Category');

module.exports = {
    get: async (req,res,next) => {
        try{
            console.log('before get cats');
            await Category.find().then(categories => res.json(categories));
            console.log('in get cats');
        }catch(err){
            res.json({message:err.message})
        }
    },

    getById: async (req,res,next) => {
        try{
            await Category.findById(req.params.id)
                .then(category=>res.json(category))
    
        }catch(err){
            res.json({message:err.message})
        }
    },

    create: async (req,res,next) => {
        const newCategory={
            name:req.body.name
        };
    
        try{
            const category = await Category.create(newCategory)
            res.json(category._id);
        }catch(err){
            res.json({message:err.message})
        }
    },

    deleteById: async (req,res,next) => {
        try{
            const category = await Category.deleteOne({_id:req.params.id})
            res.json(category);
        }catch(err){
            res.json({message:err.message})
        }
    },

    deleteByName: async (req,res,next) => {
        try{
            const category = await Category.deleteOne({name:req.params.name})
            res.json(category);
        }catch(err){
            res.json({message:err.message})
        }
    },
};
