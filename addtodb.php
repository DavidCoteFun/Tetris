<html>
<?php
$name=$_REQUEST["n"];
$score=$_REQUEST["s"];
$dbh  = new PDO('sqlite:file.sql') or die("cannot open the database");
$pid=-1;
$query="Select name,id from players where name='$name'";
foreach ($dbh->query($query) as $row)
  {
    $pid=$row[1];
  }
if($pid<0){
  $query="Select MAX(id) from players";
  foreach ($dbh->query($query) as $row){
    $pid=$row[0][0]+1;
  }
  $dbh->beginTransaction();
  $query="INSERT INTO players VALUES('$name',$pid)";
  $naffected=$dbh->exec($query);
  $dbh->commit();
}

?>
 <body>
 Name <?php echo $_REQUEST["n"]; ?><br>
 Score <?php echo $_REQUEST["s"]; ?><br>
 Id <?php echo $pid ?><br>
 nb lines <?php echo $naffected  ?>
 </body>
</html>
