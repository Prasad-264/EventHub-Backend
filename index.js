const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');
const friendRoutes = require('./routes/friendRoutes');

dotenv.config();
const app = express();

app.use(express.json());
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(cors());
app.use(morgan("common"));

// Connect to database
connectDB().then(() => {
  console.log('MongoDB connected successfully');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/friend', friendRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('Hello World! Our server is running');
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});