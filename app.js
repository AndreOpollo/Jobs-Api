require('dotenv').config()
require('express-async-errors')
const express = require('express')
const errorHandlerMiddleware = require('./middleware/error-handler')
const notFoundMiddleware = require('./middleware/not-found')
const authenticatedUser =require('./middleware/auth')
const cors = require('cors')
const helmet = require('helmet')
const rateLimiter = require('express-rate-limit')
const app = express()
//DB
const connectDB = require('./db/connect')

//router
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')
const { StatusCodes } = require('http-status-codes')
app.use(express.json())
app.use(cors())
app.use(helmet())
app.set('trust proxy',1)
app.use(rateLimiter({
    windowsMs:15 * 60 * 1000, //15mins
    max:100
}))

//routes
app.get('/',(req,res)=>{
    res.status(StatusCodes.OK).send('Jobs Api')
})
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/jobs',authenticatedUser,jobsRouter)
//middleware
app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)

const port = process.env.PORT || 3000

const start = async ()=>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log(`Server is listening on port: ${port}`))
    } catch (error) {
        console.log(error);
    }
}
start()

