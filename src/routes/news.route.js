import { Router } from "express";
import { news } from "../controllers/news.controllers.js";

const newsRouter = Router()
newsRouter.route('/news').post(news)

export default newsRouter