import {asyncHandlers} from '../utils/asyncHandler.utils.js'
const news = asyncHandlers(async(req ,res)=>{
    
    res.json({
        message : "This is your anchor Piyush !"
    })
})
export {news}