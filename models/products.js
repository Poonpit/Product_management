// use mongoose
const mongoose = require('mongoose')

// connect mongoDB
const dbUrl = 'mongodb://0.0.0.0:27017/productDB'
mongoose.connect(dbUrl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).catch(err=>console.log(err))

// design Schema
let productSchema = mongoose.Schema({
    name:String,
    price:Number,
    image:String,
    description:String
})

// build model
let Product = mongoose.model("products",productSchema)

// export model
module.exports = Product

//design function for save data
module.exports.saveProduct=function(model,data){
    model.save(data)
}