const express = require("express");
const mongoose = require("mongoose");
const route = require("./routes/routes");
const app = express()


app.use(express.json());   


mongoose.connect("mongodb+srv://kunal0709:Singhkunal7@cluster0.u5yk4f2.mongodb.net/group38Database",{
    useNewUrlParser:true  
}) 

.then(()=> console.log("MongoDB is connected"))  
.catch(err => console.log(err))


app.use("/",route) 

app.use( (req ,res) => {
    res.status(404).send({status : false , message :`Page Not Found , Given URL ${req.url} is incorrect for this application.`})
})

app.listen(process.env.PORT || 3001, function(){
    console.log("express app runing on port "+(process.env.PORT || 3001) )
})