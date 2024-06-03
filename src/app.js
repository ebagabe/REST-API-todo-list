require('dotenv').config();
const express = require('express');
const fs = require('fs');
const https = require('https');
const cors = require('cors');

const app = express();

const userRoutes = require('./routes/userRoutes');
const todoRoutes = require('./routes/todoRoutes');

app.use(express.json());
app.use(cors());

app.use('/api/users', userRoutes);
app.use('/api/todos', todoRoutes);

const PORT = process.env.PORT;
const HTTPS = process.env.HTTPS_PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);  
});

https.createServer({
  cert: fs.readFileSync('src/SSL/code.crt'),
  key: fs.readFileSync('src/SSL/code.key')
}, app).listen(HTTPS, () => console.log(`HTTPS Running in ${HTTPS}`));

module.exports = app;