const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/db');
require('./models');
const authRoutes = require('./routes/auth');
const groupRoutes = require('./routes/group');
const assignmentRoutes = require('./routes/assignment');
const submissionRoutes = require('./routes/submission');
const courseRoutes = require('./routes/courses');



const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/auth', authRoutes);
app.use('/groups', groupRoutes);
app.use('/assignments', assignmentRoutes);
app.use('/submissions', submissionRoutes);
app.use('/courses', courseRoutes);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('DB connected');
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Unable to start server:', err);
  }
}

start();

module.exports = app;