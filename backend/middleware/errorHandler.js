const ErrorResponse = require('../utils/errorResponse')

const errorHandler = (err,req,res,next) =>{
    let error = {...err}
    error.message = err.message ? err.message : "Erro desconhecido"

    console.log(err)

    if(err.code === 11000){
        const message = `Um objeto com um valor único ja existente no BD foi inserido - Duplicate Field Value Error`
        error = new ErrorResponse(message,400,11000)
    }

    if(err.name === "ValidationError"){
        const message = Object.values(err.errors).map((val)=>val.message)
        error = new ErrorResponse(message,400,1)
    }

    res.status(error.status || 500).json({
        success:false,
        error: error.message || "Server Error"
    })
}

module.exports = errorHandler