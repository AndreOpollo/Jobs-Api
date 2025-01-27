const { StatusCodes } = require('http-status-codes')
const Job = require('../models/Job')
const { NotFoundError, BadRequestError } = require('../errors')
const getJob = async (req,res)=>{
    const {user:{userId},params:{id:jobId}} = req
    const job = await Job.findOne({
        _id:jobId,
        createdBy:userId
    })
    if(!job){
        throw new NotFoundError(`No job with id: ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job})
}
const getAllJobs = async (req,res)=>{
    const jobs = await Job.find({createdBy:req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({jobs,count:jobs.length})
}
const deleteJob = async(req,res)=>{
   const{user:{userId},params:{id:jobId}}=req
   const job = await Job.findByIdAndDelete({createdBy:userId,_id:jobId})
   if(!job){
    throw new NotFoundError(`No job with id: ${jobId}`)
   }
   res.status(StatusCodes.OK).json({msg:"success",job})
}
const createJob =async (req,res)=>{
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({job})
}
const updateJob = async (req,res)=>{
    const {
        body:{company,position},
        params:{id:jobId},
        user:{userId}
    } = req
    if(company === ''||position===''){
        throw new BadRequestError('Company or Position fields cannot be empty')
    }
    const job = await Job.findByIdAndUpdate({_id:jobId,createdBy:userId},
        req.body,
        {new:true,runValidators:true}
    )
    if(!job){
        throw new NotFoundError(`Not job with id :${jobId}`)
    }
    res.status(StatusCodes.OK).json({job})
}
module.exports = {
    getJob,
    getAllJobs,
    deleteJob,
    createJob,
    updateJob
}