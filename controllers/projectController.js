const projects = require('../models/projectModel')

//add project
exports.addProjectController = async(req,res)=>{
   console.log("inside addProjectController");
   const userId = req.userId
   console.log(userId);
   console.log(req.body);
   console.log(req.file);
   const {title,language, overview, github, website}= req.body
   const projectImage = req.file.filename
try{
   const existingProject = await projects.findOne({github})
   if(existingProject){
      res.status(406).json("project already exists ..please upload another")
   }else{
      const newProject = new projects({
         title,language, overview, github, website,projectImage,userId
      })
      await newProject.save()
      res.status(200).json(newProject)
   }
}catch(err){
   res.status(401).json(err)
}
   
}

//get home projects - guest user 
exports.getHomeProjectsController = async(req,res)=>{
console.log("inside getHomeProjectsController");
try{
   const allHomeProjects = await projects.find().limit(3)
   res.status(200).json(allHomeProjects)
}catch(err){
   res.status(401).json(err)
}
}

//get user projects - authorised user 
exports.getUserProjectsController = async(req,res)=>{
console.log("inside getuserProjectsController");
const userId = req.userId
try{
   const allUserProjects = await projects.find({userId})
   res.status(200).json(allUserProjects)
}catch(err){
   res.status(401).json(err)
}
}

//get all projects - authorised user 
exports.getAllProjectsController = async(req,res)=>{
console.log("inside getAllProjectsController");
const userId = req.userId
const searchKey = req.query.search
const query={
   language:{
      $regex: searchKey,$options:"i"
   }
}
try{
   const allProjects = await projects.find(query)
   res.status(200).json(allProjects)
}catch(err){
   res.status(401).json(err)
}
}

// edit project - use findByIdAndUpdate in model
exports.editProjectController = async(req,res)=>{
console.log("inside editProjectController");
//get projectid from request params
const {id} = req.params
// req.body contain only text type data
const {title,language,overview,github,website,projectImage} = req.body
// to get file data
const reUploadImageFile = req.file?req.file.filename:projectImage
// to get userid - use jwtmiddleware
const userId = req.userId
console.log(id,title,language,overview,github,website,projectImage);
try{
   const updatedProject = await projects.findByIdAndUpdate({_id:id},{
      title,language,overview,github,website,projectImage:reUploadImageFile,userId
   },{new:true})
   await updatedProject.save()
   res.status(200).json(updatedProject)
}catch(err){
   res.status(401).json(err)
}

}

// remove project
 exports.removeProjectController = async (req,res)=>{
   console.log("inside removeProjectController");
  // 1. get id of the project to be deleted from req params
  const {id}= req.params
   // 2. delete project with given id from model
   try{
      const removeProject = await projects.findByIdAndDelete({_id:id})
      res.status(200).json(removeProject)
  }catch(err){
      res.status(401).json(err)
  }
   
 } 