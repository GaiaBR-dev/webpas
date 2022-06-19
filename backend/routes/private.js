const express = require('express')
const router = express.Router()
const {protect} = require("../middleware/auth")


router.route("/").get(protect,(req,res)=>{
 res.status(200).json({
     success:true,
     data:"you've got access to the private blabla"
 })
})

module.exports = router
