const router = require('express-promise-router')();
const CategoriesController = require('../../controllers/categories');
const passport  = require('passport');
require('../../passport');

const passportJwt = passport.authenticate('jwt',{session:false});

// @route GET api/categories
router.route('/').get(passportJwt,CategoriesController.get);

// @route GET api/categories/:id
router.route('/:id').get(passportJwt,CategoriesController.getById);

// @route POST api/categories
router.route('/').post(passportJwt,CategoriesController.create);

// @route DELETE api/categories
router.route('/byid/:id').delete(passportJwt,CategoriesController.deleteById);

// @route DELETE api/categories
router.route('/byname/:name').delete(passportJwt,CategoriesController.deleteByName);

module.exports=router;