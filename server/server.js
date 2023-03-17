import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import connect from './database/conn.js'
import router from './router/route.js'
const app = express()

//middlewares
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))
app.disable('x-powered-by');//less hackers know about your stack

const port=8000;

//HTTP GET REQ
app.get('/', (req,res)=>{
    res.status(201).json("Home")
})

//API ROUTES
app.use('/api',router)


//start server
//connect() gonna return a promise if it is succesful promise we wil get it in the then otherwise in the catch
connect().then(()=>{
    try {
        app.listen(port, ()=>{
            console.log(`server connected to ${port}`);
        })
    } catch (error) {
        console.log('cannot connect to the server')
    }
}).catch(error =>{
    console.log('Invalid database connection')
})
