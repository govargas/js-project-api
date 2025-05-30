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

// 2) Collection endpoint: get all thoughts with optional filter by hearts
app.get('/thoughts', (req, res) => {
  const { hearts } = req.query
  let results = thoughts

  if (hearts) { // Filter by hearts if query parameter is provided
    const h = Number(hearts) // Convert to number
    results = results.filter((t) => t.hearts === h) // Filter thoughts by hearts count
  }

  res.status(200).json(results) // Return the filtered or unfiltered thoughts
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