const express=require("express")
const cors=require("cors")
const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const{registermodel}=require("./models/register")
const { postModel } = require("./models/post")

const generateHashedPassword=async(password)=>{
    const salt=await bcrypt.genSalt(10)
    return bcrypt.hash(password,salt)
}

const app=express()
app.use(cors())
app.use(express.json())
mongoose.connect("mongodb+srv://sreya:sreya123@cluster0.rk6cqoj.mongodb.net/bloggdb?retryWrites=true&w=majority&appName=Cluster0")

app.post("/add",async(req,res)=>{
    let input=req.body
    let token=req.headers.token
    jwt.verify(token,"blogg-app",async(error,decoded)=>{
        if (decoded && decoded.email) {
            let result=new postModel(input)
            await result.save()
            res.json({"status":"success"})
        } else {
            res.json({"status":"invalid authentication"})
        }
    })
})



app.post("/signup",async(req,res)=>{
    let input=req.body
    let hashedPassword=await generateHashedPassword(input.password)
    console.log(hashedPassword)
    input.password=hashedPassword
    let register=new registermodel(input)
    register.save()
    console.log(register)
    res.json({"status":"success"})
})

app.post("/signin",(req,res)=>{
    let input=req.body
    registermodel.find({"email":req.body.email}).then(
     (response)=>{
         if (response.length>0) {
             let dbPassword=response[0].password
             console.log(dbPassword)
             bcrypt.compare(input.password,dbPassword,(error,isMatch)=>{
                 if (isMatch) {
                    jwt.sign({email:input.email},"blogg-app",{expiresIn:"1d"},
                    (error,token)=>{
                     if (error) {
                         res.json({"status":"unable to create token"})
                     } else {
                         res.json({"status":"success","userid":response[0]._id,"token":token})
                     }
                    }
                 )
                 } else {
                     res.json({"status":"incorrect"})
                 }
             })
             
         } else {
             res.json({"status":"user not found"})
         }
         }
    ).catch()
 })

 app.listen(8081,()=>{
    console.log("server started")
})