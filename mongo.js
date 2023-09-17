const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>');
  process.exit(1);
}

const password = process.argv[2]

const url = `mongodb+srv://fullstackilmo:${password}@cluster0.ve4fzml.mongodb.net/Phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    phoneNumber: String,
});

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: process.argv[3],
    phoneNumber: process.argv[4]
})

if (process.argv.length > 3) {
    person.save().then(result => {
        console.log(`added ${person.name} number ${person.phoneNumber} to phonebook`)
        mongoose.connection.close()
    })
}


if (process.argv.length === 3) {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
}
