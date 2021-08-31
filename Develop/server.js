const express = require('express');
const path = require('path');
const db = require('./db/db.json')
const uniqId = require('uniqid');
const fs = require('fs');


const PORT = 3002;
const app = express();

//Middleware that takes data from front end, creates an object, and grants access to object through req
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//server will look for index.html so do not need to create a path
app.use(express.static("public"));

app.get('/api/notes', (req, res) => res.json(db));

app.post('/api/notes', (req, res) => {
  //Object with title and text
  req.body.id = uniqId();
//push new note to the array
  db.push(req.body)
//writes to the db.json file and turning it into a string to add to the array
  fs.writeFile(__dirname + "/db/db.json", JSON.stringify(db), err => {
    if (err) throw err
  })
  //stops the connection
  res.end()
})
//path is a built in package to Node that goes through the local file system to show a specific file
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, "./public/notes.html")));
//* is a catchall to catch anything that has not been done and points to a file to render
app.get('*', (req, res) => res.sendFile(path.join(__dirname, "./public/index.html")));

// app.delete('/notes', (req, res))


app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
