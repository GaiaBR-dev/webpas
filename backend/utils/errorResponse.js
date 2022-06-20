class ErrorResponse extends Error{
    constructor(message,status,code){
        super(message)
        this.status = status
        this.code = code
    }
}

module.exports = ErrorResponse