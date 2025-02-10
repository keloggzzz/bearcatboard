// backend start
const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");

const authRoutes = require("./authRoutes");

const port = 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // Allow credentials (cookies, etc.)
}));

app.use("/auth", authRoutes);

const corsOptions = {
  origin: 'http://localhost:5173',  // Allow requests only from your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,  // Allow credentials like cookies or headers
};

// Enable CORS for all origins
app.use(cors());

// Start the server
app.listen(port, () => {
	console.log('Server running on http://localhost:' + port);
});