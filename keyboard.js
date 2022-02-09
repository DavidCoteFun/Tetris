function interpretKeyBoard(e){
    key = e.keyCode;
    //alert(key);
    if(key==32){ //space bar
	movingPiece.vy=movingPiece.inital_vy;
    } 
    else if(key==37){ //left arrow 
	movingPiece.moveX(-boxSide);
    }
    else if(key==39){ //right arrow 
	movingPiece.moveX(boxSide);
    }
    else if(key==38){ //up arrow 
	movingPiece.rotate();
    }
    else if(key==40){ //down arrow  
	movingPiece.vy = 10;
    } 
    else if(key==13 && over==1){ //enter
	startPlaying();
    } 
    keypadHistory+=keyCodeToString(key);
}

function keyCodeToString(k){
    if(k==48 || key==96){ return "0"; }
    if(k==49 || key==97){ return "1"; }
    if(k==50 || key==98){ return "2"; }
    if(k==51 || key==99){ return "3"; }
    if(k==52 || key==100){ return "4"; }
    if(k==53 || key==101){ return "5"; }
    if(k==54 || key==102){ return "6"; }
    if(k==55 || key==103){ return "7"; }
    if(k==56 || key==104){ return "8"; }
    if(k==57 || key==105){ return "9"; }
    if(k==65){ return "a"; }
    if(k==66){ return "b"; }
    if(k==67){ return "c"; }
    if(k==68){ return "d"; }
    if(k==69){ return "e"; }
    if(k==70){ return "f"; }
    if(k==71){ return "g"; }
    if(k==72){ return "h"; }
    if(k==73){ return "i"; }
    if(k==74){ return "j"; }
    if(k==75){ return "k"; }
    if(k==76){ return "l"; }
    if(k==77){ return "m"; }
    if(k==78){ return "n"; }
    if(k==79){ return "o"; }
    if(k==80){ return "p"; }
    if(k==81){ return "q"; }
    if(k==82){ return "r"; }
    if(k==83){ return "s"; }
    if(k==84){ return "t"; }
    if(k==85){ return "u"; }
    if(k==86){ return "v"; }
    if(k==87){ return "w"; }
    if(k==88){ return "x"; }
    if(k==89){ return "y"; }
    if(k==90){ return "z"; }
    if(k==32){ return " "; }
    return "";
}
