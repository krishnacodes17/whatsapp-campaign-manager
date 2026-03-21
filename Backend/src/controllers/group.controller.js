const Group = require("../models/group.model")


//  create group
async function createGroup(req,res) {
    try {
        const {name , description } = req.body

        const group = await Group.create({
            name,
            description,
            createdBy:req.user.id
        })


        res.status(200).json({
            success:true,
            group:{
                name:group.name,
                description: group.description,
            }
        })

    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}



//  get All group 

async function getGroup(req,res) {
    try {
        const groups = await Group.find().select("name , description");
        res.status(200).json({
            success:true,
            groups
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}



module.exports = {createGroup , getGroup}