const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('Connected persons_mongo to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

  const personSchema = new mongoose.Schema({
    name: {
      type: String,
      minLength: [3, 'Name must be at least 3 characters long'],
      required: [true, 'Name is required'],
    },
    phoneNumber: {
      type: String,
      validate: {
        validator: function (value) {
          const pattern = /^(?:\d{2}-\d{7}|\d{3}-\d{7,8})$/;
          return pattern.test(value) && value.length >= 8
        },
        message: 'Number must be in the format "xx-xxxxxxx" or "xxx-xxxxxxxx"',
      },
    },
  });

  personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
  
  module.exports = mongoose.model('Person', personSchema)