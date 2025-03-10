const mongoose=require('mongoose')
const dotenv=require('dotenv')
dotenv.config();

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGO_DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("✅ Successfully Connected With Database");
    } catch (error) {
      console.error("❌ Database Connection Failed:", error.message);
      process.exit(1); // Exit process with failure
    }
  };
module.exports=connectDB