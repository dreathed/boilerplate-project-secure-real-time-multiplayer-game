class Player {
  constructor(x, y, score, id) {
    
    this.x = x;  
    this.y = y;
    this.score = score;
    this.id = id;
    this.rank = "";
  }

  movePlayer(dir, speed) {
    switch(dir){
      case "up":
        this.y = Math.max(0, this.y - speed);
        break;
      case "down":
        this.y = Math.max(0, this.y + speed);
        break;
      case "left":
        this.x = Math.max(0, this.x - speed);
        break;
      case "right":
        this.x = Math.max(0, this.x + speed);
        break;
    }
  }

  collision(item) {
    if(Math.sqrt(Math.pow(this.x-item.x, 2)+Math.pow(this.y-item.y, 2)) <= 10){
      return true
    }
    return false
  }

  calculateRank(arr) {
    arr = arr.sort((player1, player2) => player1.score < player2.score)
    for(let i=0; i<arr.length;i++){
      if(arr[i].id == this.id){
        return "Rank: "+String(i+1)+"/"+String(arr.length)
      }
    }
  }
}

export default Player;
