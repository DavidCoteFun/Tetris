function GameFrame(){
    this.nBoxWidth=10;
    this.nBoxHeigth=20;
    this.xLeft = 10;
    this.xRight = this.xLeft + this.nBoxWidth*boxSide;
    this.yTop =  10;
    this.yBottom = this.yTop + this.nBoxHeigth*boxSide;
    this.boxMap = new Array();
    this.yMaxArray = new Array();

    this.init = function(){
    	for(x=0;x<this.nBoxWidth;x++) {
    	    this.boxMap[x]=new Array();
    	    for(y=0;y<this.nBoxHeigth;y++) {
    		this.boxMap[x][y]=null;
    	    }
    	}
    	for(x=0;x<this.nBoxWidth;x++) {
    	    this.yMaxArray[x]=this.yBottom;
    	}
    }

    this.addStoppedPiece = function(aPiece){	
	//Update map of boxes
    	for(var i = 0; i < aPiece.boxes.length; i++) {
    	    b=aPiece.boxes[i];
	    x=b.getXIndex();
	    y=Math.floor(b.getYIndex());
	    if(this.boxMap[x][y]){ gameOver(); }
	    else{ this.boxMap[x][y]=b.getNewCopy(); }
	    if(b.yBottom < this.yMaxArray[x]){ this.yMaxArray[x]=b.yTop; }
	}

	//Check for complete rows
	var nRows=0;
	var y=0;
	while(y<this.nBoxHeigth){
	    var isFull=this.isFullRow(y);
	    if(isFull){
		nRows+=1;
		this.clearRow(y);
	    }
	    else{ y+=1; }
	}
	//Update points
	if(nRows>0){
	    points += nRows*100;
	    if(nRows==4){ points += 400; } //bonus!
	    //window.parent.stats.document.getElementById("Score").innerHTML=points;
	    //window.parent.stats.document.getElementById("Score").value=points;
	}
    }

    this.isFullRow = function(y){
	var stillPossible=true;
	for(x=0;x<this.nBoxWidth && stillPossible;x++) {
	    stillPossible=(this.boxMap[x][y]!=null);
	}	
	return stillPossible;
    }

    this.clearRow = function(yInd){
	//delete boxes of y^th row
	for(x=0;x<this.nBoxWidth;x++){ this.boxMap[x][yInd]=null; }
	//move down boxes above
	for(y=yInd+1;y<this.nBoxHeigth;y++) {
	    for(x=0;x<this.nBoxWidth;x++){
		if(this.boxMap[x][y]){
		    this.boxMap[x][y-1]=this.boxMap[x][y].getNewCopy();
		    this.boxMap[x][y-1].moveY(boxSide);
		    this.boxMap[x][y]=null;
		}
	    }
	}
	//update yMaxArray
	for(x=0;x<this.nBoxWidth;x++){ 
	    this.yMaxArray[x]+=boxSide;
	}
    }

    this.freeSpace =  function(xTL,yTL){
	//input (x,y) are the top-left coordinates of a box
	//re-define to be the center of the box
	x=xTL+(boxSide/2.0);
	y=yTL+(boxSide/2.0);

	//frame boundaries
	var dxLeft = xTL-this.xLeft;
	var dxRight = this.xRight-boxSide-xTL;
	var dyUp=yTL-this.yTop;
	var dyDown=this.yBottom-boxSide-yTL;
	
	//adjacent boxes
	var xL=Math.floor((x-this.xLeft-boxSide)/boxSide);
	var xC=Math.floor((x-this.xLeft)/boxSide);
	var xR=Math.floor((x-this.xLeft+boxSide)/boxSide);
	
	var yT=this.nBoxHeigth-1-Math.floor((y-this.yTop-boxSide)/boxSide);
	var yC=this.nBoxHeigth-1-Math.floor((y-this.yTop)/boxSide);
	var yB=this.nBoxHeigth-1-Math.floor((y-this.yTop+boxSide)/boxSide);
	
	//dyDown
	if(yB>=0 && this.boxMap[xC][yB]){ 
	    b=this.boxMap[xC][yB];
	    dy=b.yTop-yTL-boxSide;
	    if(dy<dyDown){ dyDown=dy; }
	}
	//dyUp
	if(yT<this.nBoxHeigth && this.boxMap[xC][yT]){ 
	    b=this.boxMap[xC][yT];
	    dy=yTL-b.yBottom;
	    if(dy<dyUp){ dyUp=dy; }
	}
	//dxLeft
	if(xL>=0 && this.boxMap[xL][yC]){ 
	    b=this.boxMap[xL][yC];
	    dx=xTL-b.xRight;
	    if(dx<dxLeft){ dxLeft=dx; }
	}
	//dxRight
	if(xR<this.nBoxWidth && this.boxMap[xR][yC]){ 
	    b=this.boxMap[xR][yC];
	    dx=b.xLeft-xTL-boxSide;
	    if(dx<dxRight){ dxRight=dx; }
	}
	//outputs
	var out=new Array();
	out.push(dxLeft);
	out.push(dxRight);
	out.push(dyDown);
	out.push(dyUp);
	return out;
    }

    this.draw = function(){
	ctx.lineWidth="4";
	ctx.strokeStyle="pink";
	ctx.strokeRect(this.xLeft, this.yTop, this.nBoxWidth*boxSide, this.nBoxHeigth*boxSide);

	for(x=0;x<this.nBoxWidth;x++) {
	    for(y=0;y<this.nBoxHeigth;y++) {
		if(this.boxMap[x][y]){ 
		    this.boxMap[x][y].draw();
		}
	    }
	}
    }
}
