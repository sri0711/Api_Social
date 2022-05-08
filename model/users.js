const mongoose = require('mongoose');

let mongooseSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    }
})