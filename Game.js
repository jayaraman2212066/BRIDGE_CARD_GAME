const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const hash = require("./hash.js");
const fs = require("fs");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/login",(req,res)=>{
  res.sendFile(path.join(__dirname,'login.html'))
})

app.post("/index", (req, res) => {
  const { username, password } = req.body;

  hashobject = hash.createInstance();

  fileData = JSON.parse(fs.readFileSync("storedHash.json"));
  fileData.push([[username, password]]);

  fileData.forEach((element) => {
    element.forEach((element1) => {
      hashData = hash.insertToHash(hashobject, [element1[0], element1[1]]);
    });
  });
  fs.writeFileSync("storedHash.json", JSON.stringify(hashData));

  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/startGame", (req,res)=>{
  
  const { username, password } = req.body;

  hashobject = hash.createInstance();

  fileData = JSON.parse(fs.readFileSync("storedHash.json"));
  fileData.forEach((element) => {
    element.forEach((element1) => {
      hashData = hash.insertToHash(hashobject, [element1[0], element1[1]]);
    });
  });

  const isThere = hashobject.checkUser(username,password);

  if (isThere)
    res.sendFile(path.join(__dirname, 'public', "startgame.html"));
  else{
    res.send(`
      <script>
        alert("Invalid Username or password");
        window.location.href = '/';
      </script>
    `);
    res.sendFile(path.join(__dirname, "index.html"));
  }
});

app.get("/startGame", (req,res)=>{
  res.sendFile(path.join(__dirname, 'public', "startgame.html"));
});

let game;

app.get("/SinglePlayer", (req, res) => {
  game = "s";
  res.sendFile(path.join(__dirname, "public", "SP.html"));
});

app.get("/MultiPlayer", (req, res) => {
  game = "m";
  res.sendFile(path.join(__dirname, "public", "MP.html"));
});

app.get("/ScorePage", (req, res) => {
  // let game = 's'
  if (game === "m") {
    console.log(game);
    res.sendFile(path.join(__dirname, "public", "MPscorePage.html"));
  } else if (game === "s") {
    console.log(game);
    res.sendFile(path.join(__dirname, "public", "SPscorePage.html"));
  }
});

app.get("/test",(req,res)=>{
  res.sendFile(path.join(__dirname, "public", "testing.html"))
})

app.listen(3000, () => {
  console.log(`Server is running on port ${3000}`);
});

// ------------------------------------------------------------------------------------------------

// let temp = {
//   1 : 'mohana',
//   2 : 'Krishnaa'
// }

// const string = JSON.stringify(temp)

// fs.writeFileSync('temp.json', string, 'UTF-8', (err)=>{
//   if (err) throw err;
//   console.log('Data added to file');
// });

// const data1 = fs.readFileSync('temp.json');
// const data2 = JSON.parse(data1);

// console.log(data2);

// data2[3] = 'Mukesk';

// const string1 = JSON.stringify(data2)

// fs.writeFileSync('temp.json', string1, 'UTF-8', (err)=>{
//   if (err) throw err;
//   console.log('Data added to file');
// });
