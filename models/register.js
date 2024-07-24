const mongoose=require("mongoose")
const schema=mongoose.Schema(
    {
        "name":{type:String,required:true},
        "dob":String,
        "email":String,
        "gender":String,
        "password":{type:String,required:true}
        
    }
)
let registermodel=mongoose.model("registers",schema)
    module.exports={registermodel}