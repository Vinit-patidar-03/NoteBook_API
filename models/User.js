const mongoose= require('mongoose');
const { Schema } = mongoose;
const UserSchema = new Schema({
     name:{
         type:String,
         required:true
     }
    ,
    email:{
        type:String,
        required:true,
        unique:true
    },

     passward:{
        type:String,
        required:true,
        // unique:true
    }
   ,
   timestamp:
   {
        type:Date,
        default:Date.now
   }
  });

  const User = mongoose.model('User',UserSchema);
//   User.createIndexes();
  module.exports= User