import express from 'express'
const app = express()
import dotenv from 'dotenv';
dotenv.config();

// this is news router
import newsRouter from './routes/news.route.js'
app.use('/', newsRouter)

export default app