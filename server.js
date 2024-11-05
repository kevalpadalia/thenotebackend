// require('dotenv').config();
// const express = require("express");
// const cors = require('cors');
// const mongoose = require("mongoose");
// // const expressValidator=require('express-validator');
// const bearerToken = require('express-bearer-token');
// const accountRoutes = require('./routes/accounts');
// const projectRoutes = require('./routes/projects');
// const notesRoutes = require('./routes/notes');
// import { app } from './socketIo/server.js';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bearerToken from 'express-bearer-token';

import accountRoutes from './routes/accounts.js';
import projectRoutes from './routes/projects.js';
import notesRoutes from './routes/notes.js';
import { app, server } from './socketIo/server.js';
// Express App
// const app = express();

// CORS
const config={
    origin:true,
    methods:'*',
    // credentials: true
}
app.use(cors(config));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(bearerToken());
// app.use(expressValidator()); 
app.use(express.json())
app.use((req,res,next) => {
    console.log(req.path, req.method)
    next()
})

// Routes
app.use('/api/accounts', accountRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/notes', notesRoutes)

//Connect To DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // Listen Requests
        const port=process.env.PORT
        server.listen(port, () => {
            console.log(`Connection to DB Successfull & Server is listenening on port ${port}`)
        })
    }).catch((error) => {
        console.log(error)
    })
