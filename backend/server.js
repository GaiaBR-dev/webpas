const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const {protect} = require("./middleware/auth")

require('dotenv').config()

const app = express()
app.use(cookieParser())
const port = process.env.PORT || 5000

app.use(cors({credentials:true,origin:'http://localhost:3000'}))
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));

const uri = process.env.ATLAS_URI
mongoose.connect(uri,{useNewUrlParser:true})
const connection = mongoose.connection
connection.once('open',()=>{
    console.log("MongoDB database connection estabilished successfully")
})

const salasRouter = require('./routes/salas')
const turmasRouter = require('./routes/turmas')
const distanciasRouter = require('./routes/distancias')
const resultadosRouter = require('./routes/resultados')
const configsRouter = require('./routes/config')
const authenticationRouter = require('./routes/authentication')
const privateRouter = require('./routes/private')

app.use('/salas',salasRouter)
app.use('/turmas',turmasRouter)
app.use('/distancias',distanciasRouter)
app.use('/resultados',resultadosRouter)
app.use('/configs',configsRouter)
app.use('/auth',authenticationRouter)
app.use('/private',privateRouter)

app.use(errorHandler)

const server = app.listen(port,()=>{
    console.log(`Server running on port : ${port}`)
})

process.on("unhandledRejection",(err,promise)=>{
    console.log(`Logged Error : ${err}`)
    server.close(()=>process.exit(1))
})