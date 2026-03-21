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


//  delete group
async function deleteGroup(req,res) {
    try {
        const {id} = req.params;
        await Group.findByIdAndDelete(id)

        res.status(200).json({
            success:true,
            message:"Group Deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


async function updateGroup (req, res) {
     try {
    const { id } = req.params;
    const { name, description } = req.body;

    const group = await Group.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    res.status(200).json({
      success: true,
      group,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}





module.exports = {createGroup , getGroup , deleteGroup, updateGroup}