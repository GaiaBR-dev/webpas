const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
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

app.use('/salas',salasRouter)
app.use('/turmas',turmasRouter)
app.use('/distancias',distanciasRouter)
app.use('/resultados',resultadosRouter)

app.listen(port,()=>{
    console.log(`Server running on port : ${port}`)
})