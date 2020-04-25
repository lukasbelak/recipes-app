const express = require('express');
const router = express.Router();
const Recipe = require('../../models/Recipe');

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

          console.log('before get');
          await Recipe.paginate({},options, (err, result) => {
            debugger;
            console.log('in get');
            res.json(result);
            });
    }catch(err){
        console.log(err.message);
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
        console.log(err.message);
        res.json({message:err.message});
    }
});

// @route GET api/recipes/byid/:id
router.get('/byid/:id',async(req,res)=>{
    try{
        await Recipe.findById(req.params.id)
            .then(recipe=>res.json(recipe))

    }catch(err){
        console.log(err.message);
        res.json({message:err.message});
    }
});

const createRecipe = (recipe) => {
    return Recipe.create(recipe).then(docRecipe => {
        return docRecipe;});
};

// @route POST api/recipes
router.post('/', async(req,res,next)=>{
    //console.log(req.body.youtube);
    let youtube=req.body.youtube!=='false'?req.body.youtube:null

    let newRecipe={
        name:req.body.name,
        description:req.body.description,
        category: req.body.category,
        youtube: youtube,
        img:null,
        ingredients:req.body.ingredients
    };

    //console.log(req.body.img);
    if(req.body.img.data && req.body.img.contentType){
        let imgData = Buffer.from(req.body.img.data,"base64");
        newRecipe.img={
            data: imgData,
            contentType: req.body.img.contentType
        };
    }

    try{
        let recipe = await createRecipe(newRecipe);

        res.json(recipe._id);
    }catch(err){
        console.log(err.message);
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
            //console.log(recipe);
                res.json(recipe);
        });
    }catch(err){
        console.log(err.message);
        res.json({message:err.message});
    }
});

// @route DELETE api/recipes/:id
router.delete('/:id',async(req,res,next)=>{
    try{
        await Recipe.findById({_id:req.params.id})
        .then(recipe=>{
            Recipe.deleteMany({recipe:recipe._id}, (err, result)=>{
                if(err) {
                    console.log(err.message);
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