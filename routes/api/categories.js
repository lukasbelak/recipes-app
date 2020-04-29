const router = require('express-promise-router')();
const CategoriesController = require('../../controllers/categories');

// @route GET api/categories
router.route('/').get(CategoriesController.get);

// @route GET api/categories/:id
router.route('/:id').get(CategoriesController.getById);

// @route POST api/categories
router.route('/').post(CategoriesController.create);

// @route DELETE api/categories
router.route('/byid/:id').delete(CategoriesController.deleteById);

// @route DELETE api/categories
router.route('/byname/:name').delete(CategoriesController.deleteByName);

module.exports=router;