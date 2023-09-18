require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const Person = require('./models/persons')
const now = new Date(); const day = now

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())


app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id

  Person.findById(id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).send('Person not found')
      }
    })
    .catch(error => next(error))
})


app.get('/api/testerror', (req, res, next) => {
  const error = new Error('This is a test error')
  next(error)
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  console.log('Received data:', body)

  const person = new Person({
    name: body.name,
    phoneNumber: body.phoneNumber,
  })
  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson)
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        const validationErrors = {}
        for (const field in error.errors) {
          validationErrors[field] = error.errors[field].message
        }
        return res.status(400).json({ errors: validationErrors })
      }
      next(error)
    })
})

app.get('/info', (req, res) => {
  res.send(`<h1>Phonebook has info for ${Person.length} persons</h1> </br> <h1>${day}`)
})


app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      console.log('Deleted person:', result)
      res.status(204).end()
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })

  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
