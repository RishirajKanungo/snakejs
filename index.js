const cvs = document.getElementById("myCanvas");
const ctx = cvs.getContext("2d");

let frames = 0;

const direction = {
    current: 0,
    idle: 0,
    right: 1,
    left : 2,
    up: 3,
    down: 4
}

//keyboard integration
document.addEventListener("keydown", function(evt){
    switch(evt.keyCode){
        //left
        case 37:
            if(direction.current != direction.right){
                direction.current = direction.left;
            }
            break;
        //up
        case 38:
            if(direction.current != direction.down){
                direction.current = direction.up;
            }
            break;
        //right
        case 39:
            if(direction.current != direction.left){
                direction.current = direction.right;
            }
            break;
        //down
        case 40:
            if(direction.current != direction.up){
                direction.current = direction.down;
            }
            break;
    }
});

const food = {
    x : cvs.width/4,
    y : cvs.height/4,
    radius : 10,

    draw: function() {
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(this.x, this.y, this.radius, 0, 2* Math.PI);
        ctx.fill()
        ctx.closePath();
        
    }

}

//snake object
const snake = {
    //properties
    radius : 10,
    position : [{x: cvs.width/2, y: cvs.height/2}],
    velocity : 20,

    //draw snake
    draw: function() {
        ctx.fillStyle = "black";
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];
            ctx.beginPath();
            ctx.arc(p.x, p.y, this.radius, 0, 2* Math.PI);
            ctx.fill()
            ctx.closePath();
        }
    },

    //every 8 frames update the frame
    update: function(){
        if (frames % 4 == 0) {

            //attach the snake head with the fruits past pos
            for(let i = this.position.length - 1; i > 0; i--){
                //check collision with itself
                if(this.position[0].x == this.position[i].x && this.position[0].y == this.position[i].y && this.position.length > 2){
                    this.position.splice(1);
                    break;
                }

                this.position[i].x = this.position[i-1].x;
                this.position[i].y = this.position[i-1].y;
            }


            //update direction of movement
            if (direction.current == direction.right) {
                this.position[0].x += this.velocity;   
            }
            if (direction.current == direction.left) {
                this.position[0].x -= this.velocity;   
            }
            if (direction.current == direction.up) {
                this.position[0].y -= this.velocity;   
            }
            if (direction.current == direction.down) {
                this.position[0].y += this.velocity;   
            }

            //collision logic
            if(distance(this.position[0].x,this.position[0].y, food.x, food.y) < 2 * this.radius){
                //relocate food
                food.x = Math.random() * cvs.width;
                food.y = Math.random() * cvs.height;

                //increase snake length
                this.position.push({x: this.position[this.position.length - 1].x, y: this.position[this.position.length - 1].y})
                
                console.log("Collision");
            }

            //allow snake to wrap around map
            if(this.position[0].x < 0){
                this.position[0].x = cvs.width - this.radius;
            }
            if(this.position[0].x > cvs.width){
                this.position[0].x = this.radius;
            }
            if(this.position[0].y < 0){
                this.position[0].y = cvs.height - this.radius;
            }
            if(this.position[0].y > cvs.height){
                this.position[0].y = this.radius;
            }
        }
    }

}

//calculate distance between snake head and fruit
function distance(sX, sY, fX, fY){
    let distanceX = fX - sX;
    let distanceY = fY - sY;

    return Math.sqrt(Math.pow(distanceX,2) + Math.pow(distanceY,2));
}

function main() {
    ctx.clearRect(0,0,cvs.clientWidth,cvs.height);
    snake.draw();
    snake.update();
    food.draw();
    frames++;
    requestAnimationFrame(main);
}

requestAnimationFrame(main);