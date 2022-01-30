const router = require('express-promise-router')();
const TagsController = require('../../controllers/tags');
const passport  = require('passport');
require('../../passport');

const passportJwt = passport.authenticate('jwt',{session:false});

// @route GET api/tags
router.route('/').get(passportJwt,TagsController.get);

// @route GET api/tags/:id
router.route('/:id').get(passportJwt,TagsController.getById);

// @route GET api/tags/byname/:name
router.route('/byname/:name').get(passportJwt,TagsController.getByName);

// @route POST api/tags
router.route('/').post(passportJwt,TagsController.create);

// @route DELETE api/tags
router.route('/byid/:id').delete(passportJwt,TagsController.deleteById);

// @route DELETE api/tags
router.route('/byname/:name').delete(passportJwt,TagsController.deleteByName);

module.exports=router;