require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const socket = require('socket.io');
const cors = require('cors');
const helmet = require("helmet")

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');
const { default: Player } = require('./public/Player.mjs');
const { default: Collectible } = require('./public/Collectible.mjs');

const app = express();



app.use(helmet({
  noSniff: true,
  xXssProtection: false,
  noCache: true,
  xPoweredBy: true
}))

app.use((req, res, next) => {
  res.setHeader("X-Powered-By", "PHP 7.4.3");
  next();
})

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({origin: '*'}));

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  }); 

//For FCC testing purposes
fccTestingRoutes(app);
    
// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const portNum = process.env.PORT || 3000;

// Set up server and tests
const server = app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

let players = [];

const io = socket(server);


const PLAYER_SPEED = 10;

io.on("connection", socket => {
  let newPlayer = new Player(0,0,0,socket.id)
  players.push(newPlayer);

  // new collectable
  let coll = new Collectible(Math.floor(Math.random()*640), Math.floor(Math.random()*480), 10, "a")


  function getPlayer(id){
    let Player = players.filter((p)=>p.id == id)
    if(Player.length == 0){
      return null;
    }
    return Player[0];
  }

  function updateGameState(id, dir){
    let player = getPlayer(id);
    player.movePlayer(dir, PLAYER_SPEED);
    if(player.collision(coll)){
      // remove old collectable from game state.
      players = players.filter((p) => p.id != "a")
      player.score += coll.value;
      for(let p of players){
        p.calculateRank(players);
      }
      coll = new Collectible(Math.floor(Math.random()*640), Math.floor(Math.random()*480), 10, "a")
    }
  }

  socket.on("up", () => {
    updateGameState(socket.id, "up")
    players.push(coll)
    io.emit("rerender", players);
  })

  socket.on("down", () => {
    updateGameState(socket.id, "down")
    players.push(coll)
    io.emit("rerender", players);
  })

  socket.on("left", () => {
    updateGameState(socket.id, "left")
     players.push(coll)
    io.emit("rerender", players);
  })

  socket.on("right", () => {
    updateGameState(socket.id, "right")
    players.push(coll)
    io.emit("rerender", players);
  })
})



module.exports = app; // For testing
