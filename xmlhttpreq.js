var req1 = new XMLHttpRequest();
var req2 = new XMLHttpRequest();

function getHighScore(cfunc){    
    req1.onreadystatechange=cfunc;
    req1.open('POST','gethighscore.php',true);
    req1.send(null);
}

function updateHighScore(){
    if (req1.readyState==4 && req1.status==200){
	document.getElementById("HighScore").innerHTML=req1.responseText;
    }
}

function update_db_with_score(){
    addScoreReturnStats(updateStats);
}

function addScoreReturnStats(cfunc){
    var name = document.getElementById("PlayerName").value;
    var score = document.getElementById("Score").value;
    req2 = new XMLHttpRequest();
    req2.onreadystatechange=cfunc;
    req2.open('POST','addtodb.php?n='+name+'&s='+score,true);
    req2.send(null);
}


function updateStats(){
    //alert(req2.readyState);
    //alert(req2.status);
    //alert(req2.responseText);
    if (req2.readyState==4 && req2.status==200){
	document.getElementById("Stats").innerHTML=req2.responseText;
    }
}
