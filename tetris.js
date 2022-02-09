// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
	window.webkitRequestAnimationFrame || 
	window.mozRequestAnimationFrame    || 
	window.oRequestAnimationFrame      || 
	window.msRequestAnimationFrame     ||  
	function( callback ){
	    return window.setTimeout(callback, 1000 / 60);
	};
    })();

window.cancelRequestAnimFrame = ( function() {
	return window.cancelAnimationFrame          ||
	window.webkitCancelRequestAnimationFrame    ||
	window.mozCancelRequestAnimationFrame       ||
	window.oCancelRequestAnimationFrame     ||
	window.msCancelRequestAnimationFrame        ||
	clearTimeout
    } )();


//canvas.addEventListener("mousemove", trackPosition, true);
canvas.addEventListener("mousedown", btnClick, true);
window.addEventListener("keydown", interpretKeyBoard, true);

gFrame = new GameFrame();
gFrame.init();

// Draw everything on canvas
function drawGame() {
    //Begins a path, or resets the current path
    msg1.reset();
    ctx.beginPath();
    paintCanvas();	

    //GameFrame
    gFrame.draw();

    if(needNewPiece){
    	movingPiece = getNewPiece();
    	needNewPiece=false;
    }

    movingPiece.draw();

    movingPiece.updateFreeSpace()
    dy=movingPiece.isAllowedToFall();
    if(dy>0){ movingPiece.fall(dy); }
    
    msg1.draw();
        
    if(dy<=0){
    	gFrame.addStoppedPiece(movingPiece);
    	needNewPiece=true;
    }
    
    updateScore(); 
}

function getNewPiece(){
    var r=Math.random()*10;
    r=Math.floor(r);
    var p=r%7;
    if(p==0){ return new Line(); }
    if(p==1){ return new Cube(); }
    if(p==2){ return new L1(); }
    if(p==3){ return new L2(); }
    if(p==4){ return new Tee(); }
    if(p==5){ return new Ess(); }
    if(p==6){ return new Zed(); }
    gameOver();
}



// Function for updating score
function updateScore() {
    ctx.fillStlye = "white";
    ctx.font = "20px Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Score: " + points, gFrame.xRight+200, 20);
}

// Function to run when the game overs
function gameOver() {
    ctx.lineWidth = "2";
    //ctx.fillText("Game Over", W/2, H/2 - 25 );
    //ctx.fillText("Press F5 to play again.", W/2, H/2 + 25 );
    msg1.reset();
    msg1.add("Game Over");
    msg1.draw();
    // Stop the Animation
    cancelRequestAnimFrame(init);
    // Set the over flag
    over = 1;
    //window.parent.stats.document.getElementById("Stats").innerHTML="<html><form method='post'>Enter your name: <input type='text' id='PlayerName' name='PlayerName' value=''><br></form><button type='button' onclick='javascript:update_db_with_score()'>Go</button></html>";
}


// Function for running the whole animation
function animloop() {
    init = requestAnimFrame(animloop);
    drawGame();
}

// On button click (Restart and start)
function btnClick(e) {
	
    // Variables for storing mouse position on click
    var mx = e.pageX,
	my = e.pageY;
	
    // Click start button
    if(mx >= startBtn.x && mx <= startBtn.x + startBtn.w) {
	startPlaying();
    }
}

function startPlaying(){
    	animloop();
	startBtn = {};
	over=0;
}

// Track the position of mouse cursor
function trackPosition(e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
}

// Start Button object
startBtn = {
    w: 160,
    h: 50,
    x: W/2 - 80,
    y: H/2 - 25,
	
    draw: function() {
	ctx.strokeStyle = "white";
	ctx.lineWidth = "2";
	ctx.strokeRect(this.x, this.y, this.w, this.h);
		
	ctx.font = "18px Arial, sans-serif";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStlye = "white";
	ctx.fillText("Press to Start", W/2, H/2 );
    }
};

function Msg(){
    this.values= new Array();
    this.offset=0;
    this.reset= function(){
	this.values=new Array();
    }
    this.add= function(msg){
	this.values.push(msg);
    }
    this.draw= function() {
	for(x=0;x<this.values.length;x++){ 
	    ctx.fillText(this.values[x], W/2, H/2+this.offset+(x+1)*boxSide );
	}
    }
}
var msg1=new Msg();
var msg2=new Msg();
msg2.offset=100;
var msg3=new Msg();
msg3.offset=200;


// Function to paint canvas
function paintCanvas() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, W, H);
}

// Function to execute at startup
function startScreen() {
    drawGame();
    startBtn.draw();
}

// Show the start screen
startScreen();
