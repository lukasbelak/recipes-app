const express = require('express');
const router = express.Router();
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
        await Recipe.find({name :new RegExp(filter, 'i')}).populate('ingredients')
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

const createIngredient = (ingredients) => {
    return Ingredient.create(ingredients).then(docIngredients => {
        return docIngredients;
    });
};

// @route POST api/recipes
router.post('/', async(req,res,next)=>{
    
    let newRecipe={
        name:req.body.name,
        description:req.body.description,
        category: req.body.category,
        youtube: req.body.youtube,
        img:null
    };

    if(req.body.img){
        let fileDataSplit = req.body.img.data.split(',');
        let imgData = Buffer.from(fileDataSplit[1], "base64");
        newRecipe.img={
            data: imgData,
            contentType: req.body.img.contentType
        };
    }

    try{
        let recipe = await createRecipe(newRecipe);

        let ingredients = [];
        req.body.ingredients.forEach(ingredient=>{
            let newIngredient = {
                recipe: recipe._id,
                name:ingredient.name,
                quantity:ingredient.quantity,
                unit:ingredient.unit
            }
            ingredients.push(newIngredient);
        });

        let newIngredients= await createIngredient(ingredients)
        recipe.ingredients=newIngredients;       
        await recipe.save();

        res.json(recipe._id);
    }catch(err){
        res.json({message:err.message})
    }
});

// @route PATCH api/recipes/:id
router.patch('/:id', async(req,res)=>{
    try{
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).send('The recipe with the given ID was not found.');

        let query = {$set: {}};
        for (let key in req.body) {
            if (recipe[key] && recipe[key] !== req.body[key]) {// if the field we have in req.body exists, we're gonna update it
                query.$set[key] = req.body[key];
            }
        }

        await Recipe.updateOne({_id: req.params.id}, query)
                .then(recipe=>res.json(recipe));

        //res.send(recipe);

        // await Recipe.updateOne({_id:req.params.id},
        //     {$set:{
        //         name:req.body.name,
        //         description:req.body.description,
        //         ingredients:[{
        //             name:req.body.ingredients.name,
        //             quantity:req.body.ingredients.quantity,
        //             unit:req.body.ingredients.unit
        //         }] }})
        //     .then(recipe=>res.json(recipe))

    }catch(err){
        res.json({message:err.message})
    }
});

// @route DELETE api/recipes/:id
router.delete('/:id',async(req,res,next)=>{
    try{
        await Recipe.findById({_id:req.params.id})
        .then(recipe=>{
            Ingredient.deleteMany({recipe:recipe._id}, (err, result)=>{
                if(err) {
                    res.json(err.message);
                } else {
                    recipe.deleteOne();
                    res.json(recipe);
                }
            });
        });
    }catch(err){
        res.json({message:err.message})
    }
});

module.exports=router;