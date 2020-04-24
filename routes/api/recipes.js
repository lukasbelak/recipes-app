const express = require('express');
const router = express.Router();
const Recipe = require('../../models/Recipe');
const Ingredient = require('../../models/Ingredient');

// @route GET api/recipes/:activePage/:sortBy/:isAscSort
router.get('/:activePage/:sortBy/:isAscSort',async(req,res)=>{ 
    try{
        const sortByValue = req.params.sortBy;
        let isAscSort = req.params.isAscSort;

        const options = {
            page: req.params.activePage,
            limit: 12,
            collation: {
              locale: 'en'
            }
          };

          let isAsc = isAscSort === 'true' ? 'asc': 'desc';
          switch(sortByValue)
          {
              case 'Name': options.sort={name: isAsc}; break;
              case 'Category': options.sort={category: isAsc}; break;
              case 'Date': options.sort={date: isAsc}; break;
              default:break;
          }

          await Recipe.paginate({},options, (err, result) => {
            debugger;
            res.json(result);
            });
    }catch(err){
        res.json({message:err.message});
    }
});

// @route GET api/recipes/bysearch/:search/:activePage/:sortBy/:isAscSort
router.get('/bysearch/:search/:activePage/:sortBy/:isAscSort',async(req,res)=>{
    try{
        let filter = req.params.search;
        let sortByValue = req.params.sortBy;
        let isAscSort = req.params.isAscSort;

        const options = {
            page: req.params.activePage,
            limit: 12,
            collation: {
              locale: 'en'
            }
          };

          let isAsc = isAscSort === 'true' ? 'asc': 'desc';
          switch(sortByValue)
          {
              case 'Name': options.sort={name: isAsc}; break;
              case 'Category': options.sort={category: isAsc}; break;
              case 'Date': options.sort={date: isAsc}; break;
              default:break;
          }

          await Recipe.paginate({name :new RegExp(filter, 'i')}, options, (err, result)=>{
            debugger;
            res.json(result);
            });
    }catch(err){
        res.json({message:err.message});
    }
});

// @route GET api/recipes/byid/:id
router.get('/byid/:id',async(req,res)=>{
    try{
        await Recipe.findById(req.params.id)
            .then(recipe=>res.json(recipe))

    }catch(err){
        res.json({message:err.message});
    }
});

const createRecipe = (recipe) => {
    return Recipe.create(recipe).then(docRecipe => {
        return docRecipe;});
};

// @route POST api/recipes
router.post('/', async(req,res,next)=>{
    
    let newRecipe={
        name:req.body.name,
        description:req.body.description,
        category: req.body.category,
        youtube: req.body.youtube,
        img:null,
        ingredients:req.body.ingredients
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

        res.json(recipe._id);
    }catch(err){
        res.json({message:err.message});
    }
});

// @route PATCH api/recipes/:id
router.patch('/:id', async(req,res)=>{
    try{
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).send('The recipe with the given ID was not found.');

        let query = {$set: {}};
        for (let key in req.body) {
            if (recipe[key] && recipe[key] !== req.body[key]  ) {
                query.$set[key] = req.body[key];
            }
        }

        await Recipe.findOneAndUpdate({_id: req.params.id}, query,{new:true},(err, recipe)=>{
            console.log(recipe);
                res.json(recipe);
        });
    }catch(err){
        res.json({message:err.message});
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
        res.json({message:err.message});
    }
});

module.exports=router;