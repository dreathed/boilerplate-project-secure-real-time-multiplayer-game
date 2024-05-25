import Player from './Player.mjs';
import Collectible from './Collectible.mjs';

const socket = io();
const canvas = document.getElementById('game-window');
const context = canvas.getContext('2d');

function draw(gameState){
  context.clearRect(0,0,640,480)
  for(let player of gameState){
    if(player.id == "a"){
      context.fillStyle = "blue"
    }else{
      context.fillStyle = "black"
    }
    context.fillRect(player.x, player.y,10 , 10);
  }
}

socket.on("connect", () => {
    document.addEventListener("keydown", (evt)=>{
        switch(evt.keyCode){
          case 87:
          case 38:
            socket.emit("up");
            break;
          case 65:
          case 37:
            socket.emit("left");
            break;
          case 83:
          case 40:
            socket.emit("down");
            break;
          case 68:
          case 39:
            socket.emit("right");
            break;
        }
      })
})

socket.on("rerender", (data) => {
    console.log("rerender")
  draw(data);
})

