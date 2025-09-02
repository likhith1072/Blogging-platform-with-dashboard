import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{console.log('Connected to mongoDB');}).catch((err)=>{console.log(err);}); 

// A more reliable way to get __dirname in a modern ES module environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app=express();
const origin = process.env.NODE_ENV === 'production'
  ? 'https://blogging-platform-with-dashboard.onrender.com'
  : 'http://localhost:5173';

app.use(cors({
    // origin: 'http://localhost:5173', // Frontend domain
    // origin: 'https://blogging-platform-with-dashboard.onrender.com', // Frontend domain
    origin:origin,
    credentials: true, // If you plan to send cookies/auth headers
  }));

  // app.use((req, res, next) => {
  //   res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  //   res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp'); // Optional but helpful
  //   next();
  // });

app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});

app.use('/api/user',userRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/post',postRoutes);
app.use('/api/comment',commentRoutes);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => { 
  res.sendFile(path.join(__dirname, 'client','dist','index.html'));
});

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode || 500;
    const message =err.message || "internal Server Error";
    res.status(statusCode).json({
        success:false,
        statusCode,
        message,
    });
});
