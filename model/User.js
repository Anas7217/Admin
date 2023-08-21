// User.js

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');
var userSchema = new Schema({
	username: {
		type: String
	},
	password: {
		type: String
	}
})

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

const fixLaptopSchema = new mongoose.Schema({
            productName:{type:String},
            imageLink: {type:String},
            price:{type:Number},
            oldPrice:{type:Number},
            description:{type:String},
            condition:{type:String},
            processor:{type:String},
            ram:{type:String},
            hardDisk:{type:String},
            display:{type:String},
            warranty:{type:String},
            shipping:{type:String},
            referenceNumber:{type:String},
  });
  
  const FixLaptop = mongoose.model("FixLaptop", fixLaptopSchema);
  
  module.exports = { User, FixLaptop };


