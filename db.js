//Connecting MongoDB with Express Server using mongoose
const mongoose= require('mongoose');
const mongoURI= "mongodb+srv://vinitpatidar780:1234567890@cluster0.xo9ypka.mongodb.net/?retryWrites=true&w=majority";

const connectToMongo= async ()=>
{
    await mongoose.connect(mongoURI)
    console.log('connected to mongoose successfully')
}

module.exports= connectToMongo;