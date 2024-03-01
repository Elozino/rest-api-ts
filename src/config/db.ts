import mongoose from "mongoose";

export default async function connectDB(){
  try {
    // mongoose.Promise = Promise;
    // mongoose.connect(process.env.MONGO_URI)
    // mongoose.connection.on("connected", () => {
    //   console.log(`MongoDB connected`)
    // })
    // mongoose.connection.on('error', (error)=>{
    //   console.log('mongo error', error)
    // }) 
    // OR USE THE BELOW
    await mongoose.connect(process.env.MONGO_URI);
    console.log('db connected');
  } catch (error) {
    console.error(error);
  }
}