// backend start
const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const { Pool} = require("pg");

const authRoutes = require("./authRoutes");
const generalRoutes = require("./generalRoutes");
const port = 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // Allow credentials (cookies, etc.)
}));

const router = express.Router();
const pool = new Pool({ 
	connectionString: process.env.DATABASE_URL,
	user: "web_anon",
	host: "localhost",
	database: "bearcatboard",
	port: 5432,
});

app.use("/auth", authRoutes);
app.use("/api", generalRoutes);



const corsOptions = {
  origin: 'http://localhost:5173',  // Allow requests only from your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,  // Allow credentials like cookies or headers
};

// Start the server
app.listen(port, () => {
	console.log('Server running on http://localhost:' + port);
});

