const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');

app.use(express.json());

app.use('/api/users', userRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);  
});

module.exports = app;