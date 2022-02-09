<html>
 <head>
  <title>Get High Score</title>
 </head>
<?php
$dbh  = new PDO('sqlite:file.sql') or die("cannot open the database");
foreach ($dbh->query('SELECT MAX(points) from games') as $row)
  {
    $maxPts=(int)$row[0];
  }
$query="SELECT name from players,games WHERE players.id=games.id AND points=$maxPts";
$players=array();
foreach ($dbh->query($query) as $row)
  {
    array_push($players,$row[0]);
  }
?>
 <body>
   <?php 
   for($x=0;$x<count($players);$x++)
     {
       echo "$maxPts points -- $players[$x] <br>";
     }
?>
 </body>
</html>
