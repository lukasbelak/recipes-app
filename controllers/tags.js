const Tag = require('../models/Tag');

module.exports = {
    get: async (req,res,next) => {
        try{
            console.log('before get tags');
            await Tag.find().then(tags => res.json(tags));
            console.log('in get tags');
        }catch(err){
            res.json({message:err.message})
        }
    },

    getByName: async (req,res,next) => {
        try{
            await Tag.findOne({name:req.params.name})
                .then(tag=>res.json(tag))
    
        }catch(err){
            res.json({message:err.message})
        }
    },

    getById: async (req,res,next) => {
        try{
            await Tag.findById(req.params.id)
                .then(tag=>res.json(tag))
    
        }catch(err){
            res.json({message:err.message})
        }
    },

    create: async (req,res,next) => {
        const newTag={
            name:req.body.name
        };
    
        try{
            const tag = await Tag.create(newTag)
            res.json(tag._id);
        }catch(err){
            res.json({message:err.message})
        }
    },

    deleteById: async (req,res,next) => {
        try{
            const tag = await Tag.deleteOne({_id:req.params.id})
            res.json(tag);
        }catch(err){
            res.json({message:err.message})
        }
    },

    deleteByName: async (req,res,next) => {
        try{
            const tag = await Tag.deleteOne({name:req.params.name})
            res.json(tag);
        }catch(err){
            res.json({message:err.message})
        }
    },
};
