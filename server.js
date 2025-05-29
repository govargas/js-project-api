import express from 'express'
import cors from 'cors'
import listEndpoints from 'express-list-endpoints'
import dotenv from 'dotenv'

import thoughts from './data/thoughts.json'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080

// Enable CORS and JSON body parsing
app.use(cors())
app.use(express.json())

// 1) API documentation & welcome message
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Happy Thoughts API',
    endpoints: listEndpoints(app)
  })
})

// 2) Collection endpoint: get all thoughts
app.get('/thoughts', (req, res) => {
  res.status(200).json(thoughts)
})

// 3) Single-item endpoint: get one thought by ID
app.get('/thoughts/:id', (req, res) => {
  const { id } = req.params
  const found = thoughts.find((t) => t._id === id)

  if (!found) {
    return res
      .status(404)
      .json({ error: `Thought with ID '${id}' not found` })
  }

  res.status(200).json(found)
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})