import express from 'express'
import cors from 'cors'
import listEndpoints from 'express-list-endpoints'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Thought from './models/Thought.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8080

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err))

// Middleware
app.use(cors())
app.use(express.json())

// 1) API documentation & welcome message
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Happy Thoughts API',
    endpoints: listEndpoints(app)
  })
})

// 2) Collection endpoint: get all thoughts, optional filter by hearts
app.get('/thoughts', async (req, res, next) => {
  try {
    const { hearts } = req.query
    const filter = hearts ? { hearts: Number(hearts) } : {}
    const thoughts = await Thought.find(filter).sort({ createdAt: -1 })
    res.status(200).json(thoughts)
  } catch (err) {
    next(err)
  }
})

// 3) Single‐item endpoint: get one thought by ID
app.get('/thoughts/:id', async (req, res, next) => {
  try {
    const thought = await Thought.findById(req.params.id)
    if (!thought) {
      return res
        .status(404)
        .json({ error: `Thought with ID '${req.params.id}' not found` })
    }
    res.status(200).json(thought)
  } catch (err) {
    next(err)
  }
})

// Error handler
app.use((err, req, res, next) => {
  res.status(400).json({ error: err.message })
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})