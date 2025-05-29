import express from 'express'
const app = express()

// this is news router
import newsRouter from './routes/news.route.js'
app.use('/', newsRouter)

export default app