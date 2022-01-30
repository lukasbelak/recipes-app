const Recipe = require('../models/Recipe');

const createRecipe = (recipe) => {
    return Recipe.create(recipe).then(docRecipe => {
        return docRecipe;});
};

module.exports = {
    getAll: async (req,res,next) => {
        try{
            await Recipe.find().then(recipes => res.json(recipes));
        }catch(err){
            console.log(err.message);
            res.json({message:err.message});
        }
    },

    get: async (req,res,next) => {
        try{
            console.log("in get recipe: ");

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
                  case 'name': options.sort={name: isAsc}; break;
                  case 'category': options.sort={category: isAsc}; break;
                  case 'date': options.sort={date: isAsc}; break;
                  case 'season': options.sort={season: isAsc}; break;
                  default: options.sort={name: isAsc};break;
              }
    
              let query={};
              if(req.params.category!=='All'){
                query={category:req.params.category}
              }
    
              //let token = req.headers.authorization;

              console.log('before get '+req.params.category);
              await Recipe.paginate(query,options, (err, result) => {
                //  debugger;
                // if(result){
                //  let requestOptions={
                //     method: 'GETmethod',
                //     headers: { 'Authorization': token }
                //   };

                // for(var i=0;i<result.docs.length;i++){
                //     var recipe=result.docs[i];
                //     const resp =  fetch('/api/users/byid/'+recipe.user_id,requestOptions);
                //     let user= resp.json();
                //     recipe.createdBy=user.firstName + " " + user.lastName;
                // }     
                res.json(result);
            //}
                });
        }catch(err){
            console.log(err.message);
            res.json({message:err.message});
        }
    },
    
    getBySearch: async (req,res,next)=>{
        try{
            console.log("in getBySearch recipe: ");

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
                  case 'name': options.sort={name: isAsc}; break;
                  case 'category': options.sort={category: isAsc}; break;
                  case 'date': options.sort={date: isAsc}; break;
                  case 'season': options.sort={season: isAsc}; break;
                  default: options.sort={name: isAsc}; break;
              }
    
              let query={name :new RegExp(filter, 'i')};
              if(req.params.category!=='All'){
                query={
                    name :new RegExp(filter, 'i'),
                    category:req.params.category
                }
              }
    
              await Recipe.paginate(query, options, (err, result)=>{
                  console.log("RecipePaginate: "+result);
                res.json(result);
                });
        }catch(err){
            console.log(err.message);
            res.json({message:err.message});
        }
    },

    getById: async (req,res,next)=>{
        try{
            console.log("in getById recipe: ");

            await Recipe.findById(req.params.id)
                .then(async(recipe)=>{

                    let requestOptions={
                        method: 'GETmethod',
                        headers: { 'Authorization': localStorage.getItem('rcp_token') }
                      };
                    const resp = await fetch('/api/users/byid/'+recipe.user_id,requestOptions);
                    let user=await resp.json();
                    recipe.createdBy=user.firstName + " " + user.lastName;

                    res.json(recipe)
                })
    
        }catch(err){
            console.log(err.message);
            res.json({message:err.message});
        }
    },

    create: async (req,res,next) =>{
        let youtube=req.body.youtube!=='false'?req.body.youtube:null

        let newRecipe={
            name:req.body.name,
            description:req.body.description,
            category: req.body.category,
            youtube: youtube,
            img:null,
            user_id: req.body.userId,
            season: req.body.season
        };

        let ings=[];
        req.body.ingredients.forEach(ing=>{
            if(ing.name!==''){
                ings.push(ing);
            }
        });

        newRecipe.ingredients=ings;

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
    },

    update: async (req,res,next) => {
        try{
            const recipe = await Recipe.findById(req.params.id);
            if (!recipe) return res.status(404).send('The recipe with the given ID was not found.');
    
            let query = {$set: {}};
            for (let key in req.body) {
                console.log('Key: '+key);
                if (recipe[key] !== req.body[key] && key!=='img') {
                    query.$set[key] = req.body[key];
                }
            }
    
            if(req.body.img){
                let imgData = Buffer.from(req.body.img.data,"base64");
                query.$set['img']={
                    data: imgData,
                    contentType:req.body.img.contentType
                }
            }
    
            await Recipe.findOneAndUpdate({_id: req.params.id}, query,{new:true},(err, recipe)=>{
                    console.log('created:'+recipe);
                    res.json(recipe);
            });
        }catch(err){
            console.log(err.message);
            res.json({message:err.message});
        }
    },

    delete: async (req,res,next) => {
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
    }
};