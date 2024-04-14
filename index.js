const canvasWidth = 600;
const canvasHeight = 600;
const squareHeight = 20;

function draw(snake, apple) {
    const canvas = document.getElementById("canvas");
    canvas.style.height = canvasHeight;
    canvas.style.width = canvasWidth;
    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");

        //initial board render:
        var style=0;
        for(c=0;c<(canvasWidth/squareHeight);c++){
            for(r=0;r<(canvasHeight/squareHeight);r++){
                if(style%2==0){
                    ctx.fillStyle = "#242424";
                } else{
                    ctx.fillStyle = "#4a4949";
                }
                ctx.fillRect((c*squareHeight), (r*squareHeight), squareHeight, squareHeight);
                style++;
            }
            style++;
        }

        //draw apple
        ctx.fillStyle = "#ff2e2e";
        ctx.fillRect(apple[0]*squareHeight, apple[1]*squareHeight, squareHeight, squareHeight);

        //draw snake body
        for(i=1;i<snake.length;i++){
            ctx.fillStyle = "#58f549";
            ctx.fillRect(snake[i][0]*squareHeight, snake[i][1]*squareHeight, squareHeight, squareHeight);
        }
        //draw snake head
        ctx.fillStyle = "#2b8f45";
        ctx.fillRect(snake[0][0]*squareHeight, snake[0][1]*squareHeight, squareHeight, squareHeight);
    }
}

var direction=1; //0=up, 1=down, 2=left, 3=right
var game=true;
var snake=[[10,10]]
var apple=[15,15]
var appleEat=false;
var speed=60; //inverse scale - lower number = faster speed
var scaleFactor=3; //how many ends the snake gets lol

window.addEventListener("load", draw(snake, apple));
var start=Date.now();

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

//main game loop
function loop(){
    var now = Date.now();
    if(snake[0][0]==apple[0]&&snake[0][1]==apple[1]) { appleEat=true; }

    if((now-start)>=speed){
        if(direction==1){
            snake.unshift([snake[0][0], snake[0][1]+1]);
        }
        else if(direction==0){
            snake.unshift([snake[0][0], snake[0][1]-1]);
        }
        else if(direction==2){
            snake.unshift([snake[0][0]-1, snake[0][1]]);
        }
        else if(direction==3){
            snake.unshift([snake[0][0]+1, snake[0][1]]);
        }

        //snake wrapping
        if(snake[0][0]>canvasWidth/squareHeight){
            snake[0][0]=0;
        }
        else if(snake[0][0]<0){
            snake[0][0]=canvasWidth/squareHeight;
        }
        else if(snake[0][1]>canvasWidth/squareHeight){
            snake[0][1]=0;
        }
        else if(snake[0][1]<0){
            snake[0][1]=canvasWidth/squareHeight;
        }

        draw(snake, apple);

        if(appleEat){
            appleEat=false;
            occPos=true;
            var ax;
            var ay;
            while(occPos){
                ax=getRandomInt(canvasWidth/squareHeight);
                ay=getRandomInt(canvasWidth/squareHeight);
                for(i=0;i<snake.length;i++){
                    if(snake[i][0]==ax&&snake[i][1]==ay){
                        ax=-1;
                        ay=-1;
                    }
                }
                if(ax!=-1||ay!=-1){
                    occPos=false;
                }
            }
            apple=[ax, ay];
        } else{
            snake.pop();
        }
        start=Date.now();
    }
    window.requestAnimationFrame(loop);
}

//handling keypresses
addEventListener("keydown", (event) => {
    if (event.isComposing || event.keyCode === 229) {
        return;
    }
    if(event.keyCode==37){ direction=2; }//turn left
    if(event.keyCode==38){ direction=0; }//turn up
    if(event.keyCode==39){ direction=3; }//turn right
    if(event.keyCode==40){ direction=1; }//turn down
});


window.requestAnimationFrame(loop)

