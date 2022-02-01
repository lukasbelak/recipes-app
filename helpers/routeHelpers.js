const Joi = require("joi");

module.exports = {
  validateBody: (schema) => {
    return (req, res, next) => {
      const result = Joi.validate(req.body, schema);
      if (result.error) {
        return res.status(400).json(result.error);
      }

      if (!req.value) {
        req.value = {};
      }

      console.log(result.value);
      req.value["body"] = result.value;
      next();
    };
  },

  schemas: {
    authSchema: Joi.object().keys({
      userName: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      firstName: Joi.string(),
      lastName: Joi.string(),
    }),
  },
};
