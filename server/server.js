import dotenv from 'dotenv';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';

dotenv.config();

//__________( connecting database )__________
connectDB();

const app = express();

const PORT = process.env.PORT || 4000;

//___________( Middlewares )_______________

app.use(express.json());
app.use(cookieParser());


// __________( Routes Middleware )____________________
app.use("/api/auth", authRoutes);


app.get("/", (req,res)=>{
    return res.send("API is working");
});

app.listen(PORT, ()=>{
    console.log(`Server is listing on port number: ${PORT} `);
    
})