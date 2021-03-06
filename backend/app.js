const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const postsRoutes = require('./Routes/posts');
const usersRoutes = require('./Routes/users');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/images', express.static(path.join('Images')));

mongoose.connect(`mongodb+srv://Aritro:${process.env.MONGO_PASS}@cluster0-nzmvx.mongodb.net/postApp?retryWrites=true&w=majority`).then(() => {
  console.log('Connected to database.');
}).catch(() => {
  console.log('Connection failed.');
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Auth');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/users', usersRoutes);

module.exports = app;
