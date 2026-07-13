const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(cors());
require("dotenv").config();
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(express.static(__dirname));
//mysql connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

db.connect((err)=>{
    if (err){
        console.error("Error connecting to MySQL :" , err);
    } else{
        console.log("connected to MySQL");
    }
});

//submission
app.post("/signup",(req,res)=> {
    const { username, password } = req.body;
    //check if the username already exists
const checkQuery = "SELECT * FROM users WHERE username = ?";
db.query(checkQuery,[username],(err,results)=> {
    if(err){
        console.error("error checking username",err);
        return res.status(500).json({success: false,message:"Error checking username"});
    } if (results.length > 0){
        return res.status(400).json({success: false,message: "username already in use"});
    }
// insert data into database
const insertQuery = "INSERT INTO users (username,password) VALUES(?,?)";
db.query(insertQuery, [username,password],(err,results)=>{
    if (err){
        console.error("error inserting data:",err);
     return  res.status(500).json({ success: false, message:"Error saving data"});
    }
     res.json({success: true, message:"User registered successfully"});
});
});
});
// Route for login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if the username exists and validate password
  const query = "SELECT * FROM users WHERE username = ?";
  db.query(query, [username], (err, results) => {
      if (err) {
          console.error("Error checking username:", err);
          return res.status(500).json({ success: false });
      }

      if (results.length === 0) {
          // Username not found
          return res.status(400).json({ success: false });
      }

      // Validate password
      const user = results[0];
      if (user.password === password) {
          // Check if a user is already stored in `currentuser`
          const checkCurrentUserQuery = "SELECT * FROM currentuser";
          db.query(checkCurrentUserQuery, (err, currentResults) => {
              if (err) {
                  console.error("Error checking current user:", err);
                  return res.status(500).json({ success: false });
              }

              if (currentResults.length === 0) {
                  // If no user is stored, insert the logged-in username
                  const insertQuery = "INSERT INTO currentuser (username) VALUES (?)";
                  db.query(insertQuery, [username], (err) => {
                      if (err) {
                          console.error("Error inserting current user:", err);
                          return res.status(500).json({ success: false });
                      }
                      return res.json({ success: true }); // Login successful
                  });
              } else {
                  // If a user is already stored, update it with the new username
                  const updateQuery = "UPDATE currentuser SET username = ? WHERE id = ?";
                  db.query(updateQuery, [username, currentResults[0].id], (err) => {
                      if (err) {
                          console.error("Error updating current user:", err);
                          return res.status(500).json({ success: false });
                      }
                      return res.json({ success: true }); // Login successful
                  });
              }
          });
      } else {
          // Password does not match
          return res.status(400).json({ success: false });
      }
  });
});
// Route to fetch the currently logged-in username
app.get("/current-user", (req, res) => {
  const query = "SELECT username FROM currentuser LIMIT 1";
  db.query(query, (err, results) => {
      if (err) {
          console.error("Error fetching current user:", err);
          return res.status(500).json({ success: false });
      }
      if (results.length === 0) {
          return res.status(404).json({ success: false, message: "No user logged in" });
      }
      res.json({ success: true, username: results[0].username });
  });
});

/* app.post("/save-note", (req, res) => {
    const { title, content } = req.body;
  
    const getCurrentUserQuery = "SELECT username FROM currentuser LIMIT 1";
    db.query(getCurrentUserQuery, (err, currentUserResults) => {
      if (err || currentUserResults.length === 0) {
        return res.status(500).json({ success: false, message: "No user logged in" });
      }
  
      const username = currentUserResults[0].username;
      const insertQuery = "INSERT INTO user_notes (username, title, content) VALUES (?, ?, ?)";
      db.query(insertQuery, [username, title, content], (err, results) => {
        if (err) {
          console.error("Error saving note:", err);
          return res.status(500).json({ success: false });
        }
        res.json({ success: true, noteId: results.insertId, message: "Note saved successfully" });
      });
    });
  });
*/
// Create a table for the currently logged-in user (if it doesn't exist)
function createTableForUser(username, callback) {
    const tableName = `${username}`;
  
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS ${tableName} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title TEXT,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
db.query(createTableQuery, (err, results) => {
    if (err) {
      console.error(`Error creating table for user ${username}:`, err);
      return callback(err);
    }
    console.log(`Table '${tableName}' created or already exists.`);
    callback(null, tableName);
  });
}

// Save a note for the current user
app.post("/save-note", (req, res) => {
  const { title, content } = req.body;

  // Get the currently logged-in username
  const getCurrentUserQuery = "SELECT username FROM currentuser LIMIT 1";
  db.query(getCurrentUserQuery, (err, currentUserResults) => {
    if (err || currentUserResults.length === 0) {
      return res.status(500).json({ success: false, message: "No user logged in" });
    }

    const username = currentUserResults[0].username;

    // Create a table for the user (if it doesn't exist)
    createTableForUser(username, (err, tableName) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Error creating user table" });
      }

      // Insert the note into the user's table
      const insertQuery = `INSERT INTO ${tableName} (title, content) VALUES (?, ?)`;
      db.query(insertQuery, [title, content], (err, results) => {
        if (err) {
          console.error("Error saving note:", err);
          return res.status(500).json({ success: false, message: "Error saving note" });
        }
        res.json({ success: true, noteId: results.insertId, message: "Note saved successfully" });
      });
    });
  });
});
// Route to delete a note
app.post("/delete-note", (req, res) => {
  const { id } = req.body;
  const getCurrentUserQuery = "SELECT username FROM currentuser LIMIT 1";

  db.query(getCurrentUserQuery, (err, currentUserResults) => {
    if (err || currentUserResults.length === 0) {
      return res.status(500).json({ success: false, message: "No user logged in" });
    }

    const username = currentUserResults[0].username;

    const deleteQuery = `DELETE FROM ${username} WHERE id = ?`;
    db.query(deleteQuery, [id], (err) => {
      if (err) {
        console.error("Error deleting note:", err);
        return res.status(500).json({ success: false, message: "Error deleting note" });
      }
      res.json({ success: true, message: "Note deleted successfully" });
    });
  });
});
// Route to fetch all notes for the logged-in user
app.get("/get-notes", (req, res) => {
  const getCurrentUserQuery = "SELECT username FROM currentuser LIMIT 1";
  db.query(getCurrentUserQuery, (err, currentUserResults) => {
    if (err || currentUserResults.length === 0) {
      return res.status(500).json({ success: false, message: "No user logged in" });
    }

    const username = currentUserResults[0].username;

    // Fetch notes for the logged-in user from their table
    const fetchNotesQuery = `SELECT * FROM ${username}`;
    db.query(fetchNotesQuery, (err, notes) => {
      if (err) {
        console.error("Error fetching notes:", err);
        return res.status(500).json({ success: false, message: "Error fetching notes" });
      }
      res.json({ success: true, notes });
    });
  });
});
// Route to delete all notes for the currently logged-in user
app.post("/delete-all-notes", (req, res) => {
  // Get the currently logged-in username
  const getCurrentUserQuery = "SELECT username FROM currentuser LIMIT 1";
  db.query(getCurrentUserQuery, (err, currentUserResults) => {
    if (err || currentUserResults.length === 0) {
      return res.status(500).json({ success: false, message: "No user logged in" });
    }

    const username = currentUserResults[0].username;
    const userTable = `${username}`;

    // Delete all notes and reset AUTO_INCREMENT
    const deleteNotesQuery = `TRUNCATE TABLE ${userTable}`;
    db.query(deleteNotesQuery, (err) => {
      if (err) {
        console.error(`Error deleting notes for user ${username}:`, err);
        return res.status(500).json({ success: false, message: "Error deleting notes" });
      }

      res.json({ success: true, message: "All notes deleted successfully" });
    });
  });
});

// Route to update a note
app.post("/update-note", (req, res) => {
  const { id, title, content } = req.body;

  // Get the currently logged-in username
  const getCurrentUserQuery = "SELECT username FROM currentuser LIMIT 1";
  db.query(getCurrentUserQuery, (err, currentUserResults) => {
    if (err || currentUserResults.length === 0) {
      return res.status(500).json({ success: false, message: "No user logged in" });
    }

    const username = currentUserResults[0].username;

    // Update the note in the user's table
    const updateQuery = `UPDATE ${username} SET title = ?, content = ? WHERE id = ?`;
    db.query(updateQuery, [title, content, id], (err, results) => {
      if (err) {
        console.error("Error updating note:", err);
        return res.status(500).json({ success: false, message: "Error updating note" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Note not found" });
      }

      res.json({ success: true, message: "Note updated successfully" });
    });
  });
});


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "front.html"));
});

app.listen(port, ()=> {
   console.log(`Server running on port ${port}`);
});
