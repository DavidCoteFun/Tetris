function Box(x,y){
    //Position
    this.xLeft = x;
    this.xRight = x+boxSide;
    this.yTop = y;
    this.yBottom = y+boxSide;

    this.draw = function(){
	iniStyle = ctx.strokeStyle;
	iniWidth = ctx.lineWidth;

	ctx.lineWidth="3";
	ctx.fillStyle = "white";
	ctx.fillRect(this.xLeft, this.yTop, boxSide, boxSide);
	ctx.strokeStyle="blue";
	ctx.rect(this.xLeft, this.yTop, boxSide, boxSide);
	ctx.stroke(); 

	ctx.strokeStyle=iniStyle;
	ctx.lineWidth=iniWidth;
    }
    this.moveX = function(dx){
	var newLeft = this.xLeft + dx;
	var newRight = this.xRight + dx;
	//security check to prevent going outside the frame
	if(newLeft>=gFrame.xLeft && newRight<=gFrame.xRight){
	    this.xLeft = newLeft;
	    this.xRight = newRight;
	}
    }
    this.moveY = function(dy){
	this.yTop += dy;
	this.yBottom += dy;
    }
    this.getXIndex = function(){
	var index=(this.xLeft-gFrame.xLeft)/boxSide;
	return index;
    }
    this.getYIndex = function(){
	var index=gFrame.nBoxHeigth - (this.yTop-gFrame.yTop)/boxSide -1;
	return index;
    }
    this.getNewCopy = function(){
	var output = new Box(this.xLeft,this.yTop);
	return output;
    }
}


function Piece(){
    this.boxes=[];
    this.xLeft=W;  //smallest
    this.xRight=0; //largest
    this.yTop=H;   //smallest
    this.yBottom=0;//largest
    this.inital_vy=1; //vitesse
    this.vy=1;
    this.fs_L=0; //free space
    this.fs_R=0;
    this.fs_U=0;
    this.fs_D=0;
    this.states=new StateList();
    this.rotate=function(){
	s=this.states.getNext();
	if(s==null){ return; }
	s.modify();
	this.updateMinMax();
	return;
    }
    this.updateMinMax = function(){
    	for(var i = 0; i < this.boxes.length; i++) {
    	    b=this.boxes[i];
    	    if(b.xLeft < this.xLeft){ this.xLeft=b.xLeft; }
    	    if(b.xRight > this.xRight){ this.xRight=b.xRight; }
    	    if(b.yTop < this.yTop){ this.yTop=b.yTop; }
    	    if(b.yBottom > this.yBottom){ this.yBottom=b.yBottom; }
    	}
    }
    this.bottomBoxIndices = function(){
	var ind = new Array();
	for(var i = 0; i < this.boxes.length; i++) {
	    if(this.yBottom=b.yBottom){
		ind.push(i);
	    }
	}
	return ind;
    }
    this.leftBoxIndices = function(){
	var ind = new Array();
	for(var i = 0; i < this.boxes.length; i++) {
	    if(this.xLeft=b.xLeft){
		ind.push(i);
	    }
	}
	return ind;
    }
    this.rightBoxIndices = function(){
	var ind = new Array();
	for(var i = 0; i < this.boxes.length; i++) {
	    if(this.xRight=b.xRight){
		ind.push(i);
	    }
	}
	return ind;
    }
    this.draw = function(){
	for(var i = 0; i < this.boxes.length; i++) {
	    b=this.boxes[i];
	    b.draw();
	}
    }
    this.fall = function(dy){
	this.move(0,dy);
    }
    this.updateFreeSpace = function(){
	//initialize free space to largest possible values
	this.fs_L=gFrame.xRight;
	this.fs_R=gFrame.xRight;
	this.fs_U=gFrame.yBottom; 
	this.fs_D=gFrame.yBottom; 
	//now calcualte actual values
	for(var i = 0; i < this.boxes.length; i++){
    	    b=this.boxes[i];
	    var fs=gFrame.freeSpace(b.xLeft,b.yTop);
	    if(fs[0]<this.fs_L){ this.fs_L=fs[0]; }
	    if(fs[1]<this.fs_R){ this.fs_R=fs[1]; }
	    if(fs[2]<this.fs_D){ this.fs_D=fs[2]; }
	    if(fs[3]<this.fs_U){ this.fs_U=fs[3]; }
	}
	return
    }
    this.isAllowedToFall = function(){
	if(this.vy<this.fs_D){ return this.vy; }
	return this.fs_D;
    }
    this.isAllowedToGoLeft = function(){
	return (this.fs_L>0);
    }
    this.isAllowedToGoRight = function(){
	return (this.fs_R>0);
    }
    this.moveX = function(dx){
	var allowed=false;
	if(dx<0 && this.isAllowedToGoLeft()){
	    allowed=true;
	}
	else if(dx>0 && this.isAllowedToGoRight()){
	    allowed=true;
	}	
	if(allowed){ this.move(dx,0); }
    }
    this.move = function(dx,dy){
	for(var i = 0; i < this.boxes.length; i++) {
	    b=this.boxes[i];
	    b.moveX(dx);
	    b.moveY(dy);
	}
	this.updateMinMax();
    }
    this.getNewCopy = function(){
	var output = new Piece();
	for(var i = 0; i < this.boxes.length; i++) {
	    b=this.boxes[i];
	    output.boxes.push(new Box(b.xLeft,b.yTop));
	}
	output.updateMinMax();
	return output;
    }
}

function StateList(){
    //circular linked list with state objects as nodes
    this.states=new Array();
    this.first=null;
    this.last=null;
    this.current=null;
    this.addState=function(node){
	//special case for first insertion
	if(this.first==null){ 
	    this.first=node; 
	    this.current=node;
	    this.last=node;
	}
	//normal case: insert new node in linked list
	this.last.next=node;
	this.last=node;
	this.last.next=this.first;
 	this.states.push(node);
    }
    this.getNext=function(){
	if(this.current.allowedToModify()){
	    out=this.current;
	    this.current=this.current.next;
	    return out;
	}
	return null;
    }
}

function State(parent){
    //Base class for state nodes
    this.next=null;
    this.piece=parent;
    this.req_L=0;
    this.req_R=0;
    this.req_U=0;
    this.req_D=0;
    this.allowedToModify=function(){	
	if(this.req_L>this.piece.fs_L){ return false; }
	if(this.req_R>this.piece.fs_R){ return false; }
	if(this.req_U>this.piece.fs_U){ return false; }
	if(this.req_D>this.piece.fs_D){ return false; }
	return true;
    }
}


function Line(){
    var parent = new Piece();
    parent.boxes.push(new Box(gFrame.xLeft+5*boxSide,10));
    parent.boxes.push(new Box(gFrame.xLeft+5*boxSide,10+1*boxSide));
    parent.boxes.push(new Box(gFrame.xLeft+5*boxSide,10+2*boxSide));
    parent.boxes.push(new Box(gFrame.xLeft+5*boxSide,10+3*boxSide));
    parent.updateMinMax();
    
    var s1=new State(parent);
    s1.req_R=3*boxSide;
    s1.modify = function(){	
	s1.piece.boxes[1].moveX(1*boxSide);
	s1.piece.boxes[1].moveY(-1*boxSide);
	s1.piece.boxes[2].moveX(2*boxSide);
	s1.piece.boxes[2].moveY(-2*boxSide);
	s1.piece.boxes[3].moveX(3*boxSide);
	s1.piece.boxes[3].moveY(-3*boxSide);
    }
    parent.states.addState(s1);

    var s2=new State(parent);
    s2.req_D=3*boxSide;
    s2.modify = function(){	
	s2.piece.boxes[1].moveX(-1*boxSide);
	s2.piece.boxes[1].moveY(1*boxSide);
	s2.piece.boxes[2].moveX(-2*boxSide);
	s2.piece.boxes[2].moveY(2*boxSide);
	s2.piece.boxes[3].moveX(-3*boxSide);
	s2.piece.boxes[3].moveY(3*boxSide);
    }
    parent.states.addState(s2);

    var s3=new State(parent);
    s3.req_L=3*boxSide;
    s3.modify = function(){	
	s3.piece.boxes[1].moveX(-1*boxSide);
	s3.piece.boxes[1].moveY(-1*boxSide);
	s3.piece.boxes[2].moveX(-2*boxSide);
	s3.piece.boxes[2].moveY(-2*boxSide);
	s3.piece.boxes[3].moveX(-3*boxSide);
	s3.piece.boxes[3].moveY(-3*boxSide);
    }
    parent.states.addState(s3);

    var s4=new State(parent);
    s4.req_D=3*boxSide;
    s4.modify = function(){	
	s4.piece.boxes[1].moveX(1*boxSide);
	s4.piece.boxes[1].moveY(1*boxSide);
	s4.piece.boxes[2].moveX(2*boxSide);
	s4.piece.boxes[2].moveY(2*boxSide);
	s4.piece.boxes[3].moveX(3*boxSide);
	s4.piece.boxes[3].moveY(3*boxSide);
    }
    parent.states.addState(s4);

    return parent;
}

function Cube(){
    var parent = new Piece();
    parent.boxes.push(new Box(gFrame.xLeft+5*boxSide,10));
    parent.boxes.push(new Box(gFrame.xLeft+5*boxSide,10+1*boxSide));
    parent.boxes.push(new Box(gFrame.xLeft+4*boxSide,10));
    parent.boxes.push(new Box(gFrame.xLeft+4*boxSide,10+1*boxSide));
    parent.updateMinMax();
    
    var s1=new State(parent);
    s1.modify = function(){	
	return;
    }
    parent.states.addState(s1);
    return parent;
}

function L1(){
    var parent = new Piece();
    parent.boxes.push(new Box(gFrame.xLeft+4*boxSide,10));
    parent.boxes.push(new Box(gFrame.xLeft+4*boxSide,10+1*boxSide));
    parent.boxes.push(new Box(gFrame.xLeft+5*boxSide,10+1*boxSide));
    parent.boxes.push(new Box(gFrame.xLeft+6*boxSide,10+1*boxSide));
    parent.updateMinMax();
    
    var s1=new State(parent);
    s1.req_D=1*boxSide;
    s1.modify = function(){	
	s1.piece.boxes[0].moveY(2*boxSide);
	s1.piece.boxes[1].moveX(1*boxSide);
	s1.piece.boxes[1].moveY(-1*boxSide);
	s1.piece.boxes[3].moveX(-1*boxSide);
	s1.piece.boxes[3].moveY(1*boxSide);
    }
    parent.states.addState(s1);

    var s2=new State(parent);
    s2.req_R=1*boxSide;
    s2.modify = function(){	
	s2.piece.boxes[0].moveX(2*boxSide);
	s2.piece.boxes[1].moveX(1*boxSide);
	s2.piece.boxes[1].moveY(1*boxSide);
	s2.piece.boxes[3].moveX(-1*boxSide);
	s2.piece.boxes[3].moveY(-1*boxSide);
   }
    parent.states.addState(s2);

    var s3=new State(parent);
    s3.req_U=1*boxSide;
    s3.modify = function(){	
	s3.piece.boxes[0].moveY(-2*boxSide);
	s3.piece.boxes[1].moveX(-1*boxSide);
	s3.piece.boxes[1].moveY(1*boxSide);
	s3.piece.boxes[3].moveX(1*boxSide);
	s3.piece.boxes[3].moveY(-1*boxSide);
    }
    parent.states.addState(s3);

    var s4=new State(parent);
    s4.req_L=1*boxSide;
    s4.modify = function(){	
	s4.piece.boxes[0].moveX(-2*boxSide);
	s4.piece.boxes[1].moveX(-1*boxSide);
	s4.piece.boxes[1].moveY(-1*boxSide);
	s4.piece.boxes[3].moveX(1*boxSide);
	s4.piece.boxes[3].moveY(1*boxSide);
    }
    parent.states.addState(s4);

    return parent;
}

function L2(){
    var parent = new Piece();
    parent.boxes.push(new Box(gFrame.xLeft+6*boxSide,10));
    parent.boxes.push(new Box(gFrame.xLeft+6*boxSide,10+1*boxSide));
    parent.boxes.push(new Box(gFrame.xLeft+5*boxSide,10+1*boxSide));
    parent.boxes.push(new Box(gFrame.xLeft+4*boxSide,10+1*boxSide));
    parent.updateMinMax();
    
    var s1=new State(parent);
    s1.req_D=1*boxSide;
    s1.modify = function(){	
	s1.piece.boxes[0].moveX(-2*boxSide);
	s1.piece.boxes[1].moveX(-1*boxSide);
	s1.piece.boxes[1].moveY(-1*boxSide);
	s1.piece.boxes[3].moveX(1*boxSide);
	s1.piece.boxes[3].moveY(1*boxSide);
    }
    parent.states.addState(s1);

    var s2=new State(parent);
    s2.req_R=1*boxSide;
    s2.modify = function(){	
	s2.piece.boxes[0].moveY(2*boxSide);
	s2.piece.boxes[1].moveX(-1*boxSide);
	s2.piece.boxes[1].moveY(1*boxSide);
	s2.piece.boxes[3].moveX(1*boxSide);
	s2.piece.boxes[3].moveY(-1*boxSide);
   }
    parent.states.addState(s2);

    var s3=new State(parent);
    s3.req_U=1*boxSide;
    s3.modify = function(){	
	s3.piece.boxes[0].moveX(2*boxSide);
	s3.piece.boxes[1].moveX(1*boxSide);
	s3.piece.boxes[1].moveY(1*boxSide);
	s3.piece.boxes[3].moveX(-1*boxSide);
	s3.piece.boxes[3].moveY(-1*boxSide);
    }
    parent.states.addState(s3);

    var s4=new State(parent);
    s4.req_L=1*boxSide;
    s4.modify = function(){	
	s4.piece.boxes[0].moveY(-2*boxSide);
	s4.piece.boxes[1].moveX(1*boxSide);
	s4.piece.boxes[1].moveY(-1*boxSide);
	s4.piece.boxes[3].moveX(-1*boxSide);
	s4.piece.boxes[3].moveY(1*boxSide);
    }
    parent.states.addState(s4);

    return parent;
}

function Tee(){
    var parent = new Piece();
    parent.boxes.push(new Box(gFrame.xLeft+5*boxSide,10));
    parent.boxes.push(new Box(gFrame.xLeft+4*boxSide,10+1*boxSide));
    parent.boxes.push(new Box(gFrame.xLeft+5*boxSide,10+1*boxSide));
    parent.boxes.push(new Box(gFrame.xLeft+6*boxSide,10+1*boxSide));
    parent.updateMinMax();
    
    var s1=new State(parent);
    s1.req_D=1*boxSide;
    s1.modify = function(){	
	s1.piece.boxes[0].moveX(-1*boxSide);
	s1.piece.boxes[0].moveY(1*boxSide);
	s1.piece.boxes[1].moveX(1*boxSide);
	s1.piece.boxes[1].moveY(1*boxSide);
	s1.piece.boxes[3].moveX(-1*boxSide);
	s1.piece.boxes[3].moveY(-1*boxSide);
    }
    parent.states.addState(s1);

    var s2=new State(parent);
    s2.req_R=1*boxSide;
    s2.modify = function(){	
	s2.piece.boxes[0].moveX(1*boxSide);
	s2.piece.boxes[0].moveY(1*boxSide);
	s2.piece.boxes[1].moveX(1*boxSide);
	s2.piece.boxes[1].moveY(-1*boxSide);
	s2.piece.boxes[3].moveX(-1*boxSide);
	s2.piece.boxes[3].moveY(1*boxSide);
   }
    parent.states.addState(s2);

    var s3=new State(parent);
    s3.req_U=1*boxSide;
    s3.modify = function(){	
	s3.piece.boxes[0].moveX(1*boxSide);
	s3.piece.boxes[0].moveY(-1*boxSide);
	s3.piece.boxes[1].moveX(-1*boxSide);
	s3.piece.boxes[1].moveY(-1*boxSide);
	s3.piece.boxes[3].moveX(1*boxSide);
	s3.piece.boxes[3].moveY(1*boxSide);
    }
    parent.states.addState(s3);

    var s4=new State(parent);
    s4.req_L=1*boxSide;
    s4.modify = function(){	
	s4.piece.boxes[0].moveX(-1*boxSide);
	s4.piece.boxes[0].moveY(-1*boxSide);
	s4.piece.boxes[1].moveX(-1*boxSide);
	s4.piece.boxes[1].moveY(1*boxSide);
	s4.piece.boxes[3].moveX(1*boxSide);
	s4.piece.boxes[3].moveY(-1*boxSide);
    }
    parent.states.addState(s4);

    return parent;
}

function Ess(){
    var parent = new Piece();
    parent.boxes.push(new Box(gFrame.xLeft+6*boxSide,10));
    parent.boxes.push(new Box(gFrame.xLeft+5*boxSide,10));
    parent.boxes.push(new Box(gFrame.xLeft+5*boxSide,10+1*boxSide));
    parent.boxes.push(new Box(gFrame.xLeft+4*boxSide,10+1*boxSide));
    parent.updateMinMax();
    
    var s1=new State(parent);
    s1.req_D=1*boxSide;
    s1.modify = function(){	
	s1.piece.boxes[0].moveX(-2*boxSide);
	s1.piece.boxes[1].moveX(-1*boxSide);
	s1.piece.boxes[1].moveY(1*boxSide);
	s1.piece.boxes[3].moveX(1*boxSide);
	s1.piece.boxes[3].moveY(1*boxSide);
    }
    parent.states.addState(s1);

    var s2=new State(parent);
    s2.req_R=1*boxSide;
    s2.modify = function(){	
	s2.piece.boxes[0].moveX(2*boxSide);
	s2.piece.boxes[1].moveX(1*boxSide);
	s2.piece.boxes[1].moveY(-1*boxSide);
	s2.piece.boxes[3].moveX(-1*boxSide);
	s2.piece.boxes[3].moveY(-1*boxSide);
    }
    parent.states.addState(s2);

    return parent;
}

function Zed(){
    var parent = new Piece();
    parent.boxes.push(new Box(gFrame.xLeft+4*boxSide,10));
    parent.boxes.push(new Box(gFrame.xLeft+5*boxSide,10));
    parent.boxes.push(new Box(gFrame.xLeft+5*boxSide,10+1*boxSide));
    parent.boxes.push(new Box(gFrame.xLeft+6*boxSide,10+1*boxSide));
    parent.updateMinMax();
    
    var s1=new State(parent);
    s1.req_D=1*boxSide;
    s1.modify = function(){	
	s1.piece.boxes[0].moveY(2*boxSide);
	s1.piece.boxes[1].moveX(-1*boxSide);
	s1.piece.boxes[1].moveY(1*boxSide);
	s1.piece.boxes[3].moveX(-1*boxSide);
	s1.piece.boxes[3].moveY(-1*boxSide);
    }
    parent.states.addState(s1);

    var s2=new State(parent);
    s2.req_R=1*boxSide;
    s2.modify = function(){	
	s2.piece.boxes[0].moveY(-2*boxSide);
	s2.piece.boxes[1].moveX(1*boxSide);
	s2.piece.boxes[1].moveY(-1*boxSide);
	s2.piece.boxes[3].moveX(1*boxSide);
	s2.piece.boxes[3].moveY(1*boxSide);
    }
    parent.states.addState(s2);

    return parent;
}
