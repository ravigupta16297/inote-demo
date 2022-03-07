const mongoose=require('mongoose');
const mongoUri="mongodb://127.0.0.1:27017/inote?readPreference=primary&appname=MongoDB%20Compass&ssl=false"

const connectToMongo=()=>{
    mongoose.connect(mongoUri,()=>{
        console.log("connected to mongo successfully");
    })
}

module.exports=connectToMongo;