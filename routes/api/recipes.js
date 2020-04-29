const router = require('express-promise-router')();
const RecipesController = require('../../controllers/recipes');
const {validateBody, schemas}=require('../../helpers/routeHelpers');

// @route GET api/recipes/getAll
router.route('/').get(RecipesController.getAll); 

// @route GET api/recipes/:activePage/:sortBy/:isAscSort/:category
router.route('/:activePage/:sortBy/:isAscSort/:category').get(RecipesController.get);

// @route GET api/recipes/bysearch/:search/:activePage/:sortBy/:isAscSort/:category
router.route('/bysearch/:search/:activePage/:sortBy/:isAscSort/:category').get(RecipesController.getBySearch);

// @route GET api/recipes/byid/:id
router.route('/byid/:id').get(RecipesController.getById);

// @route POST api/recipes
router.route('/').post(RecipesController.create);

// @route PATCH api/recipes/:id
router.route('/:id').patch(RecipesController.update);

// @route DELETE api/recipes/:id
router.route('/:id').delete(RecipesController.delete);

module.exports=router;