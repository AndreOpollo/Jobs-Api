const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema({
    company:{
        type:String,
        required:[true,'Please provide company name'],
        maxlength:20
    },
    position:{
        type:String,
        required:[true,'Please provide position name'],
        maxlength:50
    },
    status:{
        type:String,
        enum:['interview','pending','declined'],
        default:'pending'
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true,'Please provide user']
    }
},{timestamps:true})

module.exports = mongoose.model('Job',JobSchema)