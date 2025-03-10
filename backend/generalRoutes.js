const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();
const pool = new Pool({ 
	connectionString: process.env.DATABASE_URL,
	user: "web_anon",
	host: "localhost",
	database: "bearcatboard",
	port: 5432,
});

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_SECRET = process.env.COOKIE_SECRET;
const SITE_URL = process.env.SITE_URL || 'http://localhost:5000';

// Same purpose as in authRoutes.
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user;
        next();
    });
}

// Creates a post. It needs post title and content. It returns the newly created post's ID.
router.post("/post", authenticateToken, async (req, res) => {

	const { title, content } = req.body;

	if (!content) {
	    return res.status(400).json({ error: "Your post needs content!" });
	}

	let useTitle = null;

	if (title) {
	    useTitle = title;
	}

	try {
	    const result = await pool.query(
		"INSERT INTO posts (author_id, title, content, nsfw, sensitive) VALUES ($1, $2, $3, false, false) RETURNING id",
		[req.user.id, useTitle, content]
	    );
	    res.status(201).json({ result: result.rows[0].id });
	} catch (err) {
	    res.status(500).json({ error: "Error creating post." });
	}

});

// Retrieves a certain amount of posts offset by the page number. Good for pagination, which is much easier to implement than infinite scroll. Uses a URL for its params, much like profiles. It is formatted like so: /api/posts/?page=[page]&limit=[limit]  replace [page] with page number and [limit] with the number of posts per page. Returns 
router.get("/posts", authenticateToken, async (req, res) => {
    let page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 posts per page
    const offset = (page - 1) * limit; 

    try {
        const result = await pool.query(
            "SELECT posts.id, posts.title, posts.content, users.username, posts.created_at, users.avatar, BOOL_OR(likes.user_id = $1) AS has_liked, COUNT(likes.post_id) AS like_count FROM posts JOIN users ON posts.author_id = users.id LEFT JOIN likes ON posts.id = likes.post_id GROUP BY posts.id, users.id ORDER BY posts.created_at DESC LIMIT $2 OFFSET $3",
            [req.user.id, limit, offset]
        );
        res.status(200).json({ posts: result.rows });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// Likes/unlikes a post. Only allows for one like per user per post. Automatically unlikes if liked. It needs the post ID. It returns nothing.
router.post("/like", authenticateToken, async (req, res) => {
    
    const { post_id } = req.body;

    try {
	const liked = await pool.query(
	    "SELECT * FROM likes WHERE user_id = $1 AND post_id = $2",
	    [ req.user.id, post_id ]
	);
	if (liked.rows.length === 0) {
	    await pool.query(
		"INSERT INTO likes (post_id, user_id) VALUES ($1, $2)",
		[ post_id, req.user.id ]
	    );
	} else {
	    await pool.query(
		"DELETE FROM likes WHERE user_id = $1 AND post_id = $2",
		[ req.user.id, post_id ]
	    );
	}
	res.status(200)json({ success: true, message: "Liked successfully" });
    } catch (err) {
	res.status(500).json({ error: "Like failed" });
    }
});

// Gets posts created by a certain user. Good for profiles. It works similar to /posts: /api/user/posts/?page=[page]&limit=[limit]&username=[username]
router.get("/user/posts", authenticateToken, async (req, res) => {
    let page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Default to 10 posts per page
    const username = req.query.username;
    const offset = (page - 1) * limit;

    try {
        const result = await pool.query(
            "SELECT posts.id, posts.content, users.username, posts.created_at, users.avatar, BOOL_OR(likes.user_id = $1) AS has_liked, COUNT(likes.post_id) AS like_count FROM posts JOIN users ON posts.author_id = users.id LEFT JOIN likes ON posts.id = likes.post_id WHERE users.username = $2 GROUP BY posts.id, users.id ORDER BY posts.created_at DESC LIMIT $3 OFFSET $4",
            [req.user.id, username, limit, offset]
        );
        res.json({ posts: result.rows });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// Deletes a post. Needs post ID and post author username. Returns nothing.
router.put("/deletepost", authenticateToken, async (req, res) => {
    const { post_id, post_author } = req.body;

    if (req.user.username === post_author) {
        try {
	    const result = await pool.query(
	        "DELETE FROM posts WHERE id = $1",
		[ post_id ]
	    );
	    res.status(200).json({ success: true, message: "Deleted successfully" });
        } catch (err) {
	    res.status(500).json({ error: "Error deleting post"});
	}
    } else {
	res.status(403).json({ error: "You must own the post to delete it" });
    } 
});




module.exports = router;
