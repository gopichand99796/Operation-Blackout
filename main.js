const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
window.addEventListener(
    "resize",
    ()=>{
        location.reload();
    }
);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight ;
class Player {

    constructor(x, y, radius, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.health=100;
this.maxHealth=100;
this.damage = 10;

this.fireRate = 1;

this.shield = 0;

this.speed = 4;
    }
    aim(mouse){
    this.angle = Math.atan2(
        mouse.y - this.y,
        mouse.x - this.x

    );
}
    move(keys ) {

        if(keys["w"]) this.y -= this.speed;
        if(keys["s"]) this.y += this.speed;
        if(keys["a"]) this.x -= this.speed;
        if(keys["d"]) this.x += this.speed;


    }
    

    draw() {
        ctx.beginPath();
        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI * 2
        );
        ctx.fillStyle = "#00ffff";
        ctx.fill();
        const lineLength = 30;

       ctx.beginPath();

      ctx.moveTo(
    this.x,
    this.y
);

    ctx.lineTo(

    this.x + Math.cos(this.angle)*lineLength,

    this.y + Math.sin(this.angle)*lineLength

);

    ctx.strokeStyle="white";
    ctx.stroke();

    }
}
class Bullet{

    constructor(x,y,dx,dy,owner){

        this.x=x;
        this.y=y;
        this.bounces = 20;
        this.dx=dx;
        this.dy=dy;
        this.owner=owner;
        this.radius=5;

    }

    update(){

        this.x+=this.dx;
        this.y+=this.dy;

    }

    draw(){

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI*2
        );

        ctx.fillStyle="white";
        ctx.fill();

    }

}
class Enemy{

    constructor(x,y){

        this.x=x;
        this.y=y;
        this.homeRoom = null;
        this.radius=15;
        this.angle = 0;
        this.health=100;
        this.maxHealth=100;
        this.state = "idle";
        this.patrolDirection = 1;
        this.type = "room";
this.speed = 1.5;

    }
    update(player){
            if(
    this.type !== "roamer" &&
    !game.isPlayerInEnemyRoom(this)
){
    this.state = "idle";
    return;
} 
    const dx = player.x - this.x;
    const dy = player.y - this.y;

    const distance = Math.sqrt(
        dx*dx + dy*dy
    );
    if(
        this.state==="idle" &&
        distance < 250
    ){
        this.state="alert";
    }
    if(
        this.state==="alert" &&
        distance < 200
    ){
        this.state="chase";
    }    if(
        this.state==="chase" &&
        distance < 120
    ){
        this.state="attack";
    }
    if(
        this.state==="attack" &&
        distance > 150
    ){
        this.state="chase";
    }
    if(
        this.state==="chase" || this.state==="attack"
    ){

        this.x +=
        dx/distance *
        this.speed;

        this.y +=
        dy/distance *
        this.speed;
    }

    if(this.state==="idle"){

    this.x +=
    this.patrolDirection *
    1.5;

    if(
        Math.random()<0.02
    ){
        this.patrolDirection *= -1;
    }

}


    if(this.type==="room"){

    const room =
    this.homeRoom;

    if(this.x < room.x + this.radius)
        this.x =
        room.x + this.radius;

    if(this.x >
       room.x + room.width - this.radius)

        this.x =
        room.x + room.width -
        this.radius;

    if(this.y < room.y + this.radius)
        this.y =
        room.y + this.radius;

    if(this.y >
       room.y + room.height -
       this.radius)

        this.y =
        room.y + room.height -
        this.radius;

}

}
    draw(){
        ctx.beginPath();
        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0,
            Math.PI*2
        );
if(this.type==="roamer"){
    ctx.fillStyle="orange";
}
else{
    ctx.fillStyle="#ff3333";
}        ctx.fill();
        const lineLength = 25;

ctx.beginPath();

ctx.moveTo(
    this.x,
    this.y
);
      ctx.fillStyle = "white";

ctx.fillText(
    this.state,
    this.x-10,
    this.y+25
);
ctx.lineTo(

    this.x +
    Math.cos(this.angle)
    * lineLength,

    this.y +
    Math.sin(this.angle)
    * lineLength

);

ctx.strokeStyle = "white";

ctx.stroke();

        ctx.fillStyle="black";

        ctx.fillRect(
            this.x-25,
            this.y-35,
            50,
            8
        );


        ctx.fillStyle="lime";

        ctx.fillRect(
            this.x-25,
            this.y-35,

            (this.health/
            this.maxHealth)*50,

            8
        );

    }

}
class Room {
 constructor(x,y,width,height,color){

    this.x=x;
    this.y=y;
    this.width=width;
    this.height=height;
    this.color=color;
    this.walls=[];
    this.doors=[];
    this.enemies=[];
}
    draw(){

     
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.x,
            this.y,
            this.width,
            this.height
        );
        for(let door of this.doors){

        ctx.fillStyle="orange";

        ctx.fillRect(
            door.x,
            door.y,
            door.width,
            door.height
        );

    }
  for(let wall of this.walls){

    ctx.fillStyle="#606060";

    ctx.fillRect(
        wall.x,
        wall.y,
        wall.width,
        wall.height
    );

}
    }
}
class Game {
    constructor(){

    this.keys={};
        this.win = false;
    this.rooms=[];
    this.gameOver = false;
    this.mouse={
        x:0,
        y:0
    };
    this.startTime =
Date.now();
this.enemyDifficulty = 1;
    this.enemies=[];
    this.bullets=[];
    this.paused = false;
    this.initializeGame();
    this.score = 0 ;
    this.coins = 0;
        this.shootSound =
new Audio(
    "sounds/shoot.mp3"
);

this.hitSound =
new Audio(
    "sounds/hit.mp3"
);
    this.lastSpawn =
Date.now();
this.deathSound =
new Audio(
    "sounds/death.mp3"
);

this.mode = prompt(

    "Choose Mode:\n\n" +

    "1 = Finite Map\n" +

    "2 = Infinite Mode"

);
if(this.mode==="2"){
    this.mode="infinite";
}
else{
    this.mode="finite";
   
}
this.timeLimit = 300;
}

spawnWave(){

    const room =

    this.rooms[
        Math.floor(
            Math.random()*
            this.rooms.length
        )
    ];

    const enemy =

    new Enemy(

        room.x +
        Math.random()*
        room.width,

        room.y +
        Math.random()*
        room.height

    );

    enemy.homeRoom =
    room;

    room.enemies.push(
        enemy
    );

}
initializeGame(){

  this.player=new Player(
50,
canvas.height/2,
15,
4
);

    this.createRooms();
    this.currentRoom=this.rooms[0];

    this.setupMouse();

    this.setupControls();

    this.setupShooting();

}

        isPlayerInEnemyRoom(enemy){

    const room = enemy.homeRoom;

    return (

        this.player.x > room.x &&
        this.player.x < room.x + room.width &&

        this.player.y > room.y &&
        this.player.y < room.y + room.height

    );

}

resetGame(){

    this.rooms = [];
    this.bullets = [];
    this.score = 0;

    this.gameOver = false;
    this.win = false;

    this.startTime = Date.now();

    this.player = new Player(
        50,
        canvas.height/2,
        15,
        4
    );

    this.createRooms();

}
    createRooms(){
const cols = 8;
const rows = 4;

const gap = 50;
const roomWidth =
(
    canvas.width -
    (cols + 1) * gap
) / cols;

const roomHeight =
(
    canvas.height -
    (rows + 1) * gap
) / rows;
const startX = gap;
const startY = gap - 10;
    for(let row=0;row<rows;row++){
        for(let col=0;col<cols;col++){

            const x=
                startX +
                col*(roomWidth+gap);

            const y=
                startY +
                row*(roomHeight+gap);

            

              const room =  new Room(
                    x,
                    y,
                    roomWidth,
                    roomHeight,
                    "#1a1f24"
                );

            
        const doorLength =
Math.min(roomWidth, roomHeight) * 0.3;
const sides=[
    "top",
    "bottom",
    "left",
    "right"
];

const side=sides[
    Math.floor(
        Math.random()*sides.length
    )
];

let door={};


if(side==="top"){

    door={

        x:
        room.x+
        room.width/2-
        doorLength/2,

        y:room.y,

        width:doorLength,
        height:10

    };

}


else if(side==="bottom"){

    door={

        x:
        room.x+
        room.width/2-
        doorLength/2,

        y:
        room.y+
        room.height-10,

        width:doorLength,
        height:10

    };

}


else if(side==="left"){

    door={

        x:room.x,

        y:
        room.y+
        room.height/2-
        doorLength/2,

        width:10,
        height:doorLength

    };

}


else{

    door={

        x:
        room.x+
        room.width-10,

        y:
        room.y+
        room.height/2-
        doorLength/2,

        width:10,
        height:doorLength

    };

}


room.doors.push(
    door
);
const wallThickness = 5;
if(side==="top"){

    room.walls.push(

        {
            x:room.x,
            y:room.y,
            width:door.x-room.x,
            height:wallThickness
        },

        {
            x:door.x+door.width,
            y:room.y,
            width:
            room.x+room.width-
            (door.x+door.width),
            height:wallThickness
        }

    );

}else{

    room.walls.push({

        x:room.x,
        y:room.y,
        width:room.width,
        height:wallThickness

    });

}
if(side==="bottom"){

    room.walls.push(

        {
            x:room.x,
            y:room.y+room.height-wallThickness,
            width:door.x-room.x,
            height:wallThickness
        },

        {
            x:door.x+door.width,
            y:room.y+room.height-wallThickness,
            width:
            room.x+room.width-
            (door.x+door.width),
            height:wallThickness
        }

    );

}else{

    room.walls.push({

        x:room.x,
        y:room.y+room.height-wallThickness,
        width:room.width,
        height:wallThickness

    });

}
if(side==="left"){

    room.walls.push(

        {
            x:room.x,
            y:room.y,
            width:wallThickness,
            height:door.y-room.y
        },

        {
            x:room.x,
            y:door.y+door.height,
            width:wallThickness,
            height:
            room.y+room.height-
            (door.y+door.height)
        }

    );

}else{

    room.walls.push({

        x:room.x,
        y:room.y,
        width:wallThickness,
        height:room.height

    });

}
if(side==="right"){

    room.walls.push(

        {
            x:room.x+room.width-wallThickness,
            y:room.y,
            width:wallThickness,
            height:door.y-room.y
        },

        {
            x:room.x+room.width-wallThickness,
            y:door.y+door.height,
            width:wallThickness,
            height:
            room.y+room.height-
            (door.y+door.height)
        }

    );

}else{

    room.walls.push({

        x:room.x+room.width-wallThickness,
        y:room.y,
        width:wallThickness,
        height:room.height

    });

}
const padding = 30;

const enemyX =
    room.x +
    padding +
    Math.random() * (
        room.width -
        padding * 2
    );


const enemyY =
    room.y +
    padding +
    Math.random() * (
        room.height -
        padding * 2
    );


const enemy = new Enemy(
    enemyX,
    enemyY
);
enemy.health *=
this.enemyDifficulty;

enemy.speed +=
this.enemyDifficulty * 0.2;
enemy.homeRoom = room;

if(Math.random() < 0.3){
    enemy.type = "roamer";
}

room.enemies.push(
    enemy
);
this.rooms.push(room);

        }

    }

}
    setupShooting(){

window.addEventListener(
"click",
()=>{

const speed=8;

const bullet=new Bullet(

this.player.x,
this.player.y,

Math.cos(
this.player.angle
)*speed,

Math.sin(
this.player.angle
)*speed,

"player"

);

this.bullets.push(
bullet
);

this.shootSound.currentTime = 0;
this.shootSound.play();

}
);

}
    setupMouse(){
    window.addEventListener(
        "mousemove",
        (e)=>{
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;

        }
    );
}
drawVision(){

    ctx.save();
    ctx.fillStyle =
    "rgba(0,0,0,0.95)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.beginPath();

    ctx.moveTo(
        this.player.x,
        this.player.y
    );

    ctx.arc(
        this.player.x,
        this.player.y,
        250,
        this.player.angle - 0.7,
        this.player.angle + 0.7
    );

    ctx.closePath();

    ctx.clip();


    for(let room of this.rooms){

        room.draw();

        for(let enemy of room.enemies){

            enemy.draw();

        }

    }

    for(let bullet of this.bullets){

        bullet.draw();

    }

    this.player.draw();

    ctx.restore();

}
    setupControls(){

        window.addEventListener(
    "keydown",
    (e)=>{

        if(
            e.key==="r" &&
            this.gameOver
        ){

            this.resetGame();

        }

    }
);

        window.addEventListener(
"keydown",
e=>{

    if(
        e.key==="m"
    ){

        game.shopOpen=
        !game.shopOpen;

    }

});
        window.addEventListener(
    "keydown",
    (e)=>{

        this.keys[e.key] = true;

        if(e.key==="p"){

            this.paused =
            !this.paused;

        }

    }
);
        window.addEventListener("keydown",(e)=>{
            this.keys[e.key] = true;

        });
        window.addEventListener("keyup",(e)=>{
            this.keys[e.key] = false;
        });
    }

checkCollision(circle, rect){

    const closestX =
    Math.max(
        rect.x,
        Math.min(
            circle.x,
            rect.x + rect.width
        )
    );

    const closestY =
    Math.max(
        rect.y,
        Math.min(
            circle.y,
            rect.y + rect.height
        )
    );

    const dx =
    circle.x - closestX;

    const dy =
    circle.y - closestY;

    return (
        dx*dx + dy*dy <
        circle.radius *
        circle.radius
    );
}

    checkCircleCollision(a,b){
    const dx=a.x-b.x;
    const dy=a.y-b.y;
    const distance=Math.sqrt(
        dx*dx+
        dy*dy
    );
    return (
        distance <
        a.radius+b.radius
    );
}
    isPlayerInsideRoom(room){

    return (

        this.player.x >
        room.x &&

        this.player.x <
        room.x + room.width &&

        this.player.y >
        room.y &&

        this.player.y <
        room.y + room.height

    );

}
    update(){

    const seconds =
Math.floor(
(Date.now() -
this.startTime)/1000
);
const remainingTime =
this.timeLimit -
seconds;
        document.getElementById(
"mode"
).textContent =

this.mode === "finite" ? "Finite Map" : "Infinite Mode";
if(
    this.gameOver ||
    this.win
){
    return;
}
        if(this.paused){
    return;
}
if(
    this.mode==="finite"
    &&
    remainingTime <= 0
){
    this.gameOver = true;
}
let enemiesLeft = 0;

for(let room of this.rooms){

    enemiesLeft +=
    room.enemies.length;

}
        if(this.gameOver){
    return;
}

const oldX = this.player.x;

if(this.keys["a"])
    this.player.x -= this.player.speed;

if(this.keys["d"])
    this.player.x += this.player.speed;

for(let room of this.rooms){

    for(let wall of room.walls){

        if(
            this.checkCollision(
                this.player,
                wall
            )
        ){
            this.player.x = oldX;
        }

    }

}
const oldY = this.player.y;

if(this.keys["w"])
    this.player.y -= this.player.speed;

if(this.keys["s"])
    this.player.y += this.player.speed;

for(let room of this.rooms){

    for(let wall of room.walls){

        if(
            this.checkCollision(
                this.player,
                wall
            )
        ){
            this.player.y = oldY;
        }

    }

}

      this.player.aim(
        this.mouse
    );
        for(let room of this.rooms){
    for(let enemy of room.enemies){
        enemy.update(this.player);
    }
}
       if(
    this.mode==="finite"
    &&
    enemiesLeft===0
){
    this.win=true;
}
if(
    this.mode==="infinite"
){
    if(

Date.now()
-
this.lastSpawn

>

10000

){

    this.spawnWave();

    this.lastSpawn =
    Date.now();

}
}

if(this.mode==="finite"){

    document.getElementById(
    "timer"
    ).textContent =
    "Time: " +
    remainingTime;

}
else{

    document.getElementById(
    "timer"
    ).textContent =
    "Survived: " +
    seconds;

}

document.getElementById(
"hp"
).textContent =
"HP: " + this.player.health;

document.getElementById(
"score"
).textContent =
"Score: " + this.score;
    for(let bullet of this.bullets){
       
        bullet.update();
        for(let room of this.rooms){
          if(
    bullet.owner==="enemy"
){

    if(
        this.checkCircleCollision(
            bullet,
            this.player
        )
    ){

        this.player.health -= 10;

        if(this.player.health < 0){
            this.player.health = 0;
        }

        bullet.hit=true;
        break;
    }

}

              room.enemies =
room.enemies.filter(enemy=>{

    if(enemy.health<=0){

        this.score += 100;
            this.coins += 25;
        return false;
    }

    return true;

});
document.getElementById(
"coins"
).textContent =
"Credits: " +
this.coins;
if(bullet.owner==="player"){
            for(let enemy of room.enemies){
           
             if(
    this.checkCircleCollision(
        bullet,
        enemy
    )
){
    enemy.health -= 10;
    for(let e of room.enemies){

    e.state = "attack";

}
enemy.hitFlash = 5;
if(enemy.hitFlash > 0){

    ctx.fillStyle = "#ffffff";

    enemy.hitFlash--;

}else{

    ctx.fillStyle = "#ff3333";

}
    this.hitSound.currentTime = 0;
this.hitSound.play();
    bullet.hit = true;
    break;
}
            }}
            for(let wall of room.walls){
    if(
        this.checkCollision(
            bullet,
            wall
        )
    ){
        const wallIsVertical =
        wall.width < wall.height;
        if(wallIsVertical){
            bullet.dx = -bullet.dx;
        }else{
            bullet.dy = -bullet.dy;
        }
        bullet.bounces--;
        bullet.x += bullet.dx;
        bullet.y += bullet.dy;
    }
}

      
        }
    }
            if(this.player.health<=0){

    this.gameOver=true;

}
    for(let room of this.rooms){

    for(let enemy of room.enemies){

        const dx =
        this.player.x - enemy.x;

        const dy =
        this.player.y - enemy.y;

        const distance =
        Math.sqrt(
            dx*dx +
            dy*dy
        );

      if(
    enemy.state==="attack"
){
            if(Math.random() < 0.008  ){

                const speed = 5;
               
                const angle =
                Math.atan2(
                    dy,
                    dx
                );
                 enemy.angle = angle;
                const bullet =
                new Bullet(

                    enemy.x,
                    enemy.y,

                    Math.cos(angle)*speed,

                    Math.sin(angle)*speed,

                    "enemy"

                );

                this.bullets.push(
                    bullet
                );

            }

        }

    }

}

this.bullets =
this.bullets.filter(

bullet =>

bullet.bounces > 0 &&
!bullet.hit

);

    for(let room of this.rooms){
        for(let door of room.doors){
            if(
                this.checkCollision(
                    this.player,
                    door
                )
            ){
               
            }
        }
    }
}
    render(){
if(this.gameOver){

    ctx.fillStyle="black";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle="red";
    ctx.font="60px Arial";

    ctx.fillText(
        "GAME OVER",
        canvas.width/2-180,
        canvas.height/2
    );

    ctx.font="30px Arial";

    ctx.fillText(
        "Final Score: " +
        this.score,
        canvas.width/2-100,
        canvas.height/2+60
    );

    ctx.fillText(
        "Press R to Restart",
        canvas.width/2-120,
        canvas.height/2+110
    );

    return;
}


if(this.shopOpen){

    ctx.fillStyle =
    "rgba(0,0,0,0.9)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle =
    "#00ff88";

    ctx.font =
    "28px Arial";

    ctx.fillText(
        "MARKETPLACE",
        300,
        100
    );

}
        if(this.paused){

    ctx.fillStyle="white";
    ctx.font="50px Arial";

    ctx.fillText(
        "PAUSED",
        canvas.width/2-100,
        canvas.height/2
    );

}
        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );
             for(let room of this.rooms){
    room.draw();
}
   for(let room of this.rooms){
    for(let enemy of room.enemies){
        enemy.draw();
    }
}
for(let bullet of this.bullets){

    bullet.draw();

}
       if(this.win){

    ctx.fillStyle="black";
    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle="lime";

    ctx.font="60px Arial";

    ctx.fillText(
        "YOU WIN!",
        canvas.width/2-150,
        canvas.height/2
    );

    ctx.font="30px Arial";

    ctx.fillText(
        "Final Score: " +
        this.score,
        canvas.width/2-100,
        canvas.height/2+60
    );

    ctx.fillText(
        "Press R to Restart",
        canvas.width/2-120,
        canvas.height/2+110
    );

    return;
}
        this.player.draw();
        this.drawVision();

    }
    
    gameLoop(){

        this.update();
        this.render();
        requestAnimationFrame(
            ()=>this.gameLoop()
        );
    }
}
const game = new Game();
game.gameLoop(); 