const Joi = require('joi')

const bookSchema = Joi.object({
  name: Joi.string(),
  year: Joi.number(),
  author: Joi.string(),
  summary: Joi.string(),
  publisher: Joi.string(),
  pageCount: Joi.number(),
  readPage: Joi.number(),
  reading: Joi.boolean(),
})

module.exports = bookSchema
