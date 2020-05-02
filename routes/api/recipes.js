const router = require('express-promise-router')();
const RecipesController = require('../../controllers/recipes');
// const {validateBody, schemas}=require('../../helpers/routeHelpers');
const passport  = require('passport');
require('../../passport');

const passportJwt = passport.authenticate('jwt',{session:false});

// @route GET api/recipes/getAll
router.route('/').get(passportJwt,RecipesController.getAll); 

// @route GET api/recipes/:activePage/:sortBy/:isAscSort/:category
router.route('/:activePage/:sortBy/:isAscSort/:category').get(passportJwt,RecipesController.get);

// @route GET api/recipes/bysearch/:search/:activePage/:sortBy/:isAscSort/:category
router.route('/bysearch/:search/:activePage/:sortBy/:isAscSort/:category').get(passportJwt,RecipesController.getBySearch);

// @route GET api/recipes/byid/:id
router.route('/byid/:id').get(passportJwt,RecipesController.getById);

// @route POST api/recipes
router.route('/').post(passportJwt,RecipesController.create);

// @route PATCH api/recipes/:id
router.route('/:id').patch(passportJwt,RecipesController.update);

// @route DELETE api/recipes/:id
router.route('/:id').delete(passportJwt,RecipesController.delete);

module.exports=router;