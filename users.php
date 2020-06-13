<?php
include 'conn.php';
 
$sql="SELECT * FROM Users";
$result = mysqli_query($conn,$sql);
$formattedresult = array();

if (mysqli_num_rows($result) > 0) {
  while($row = mysqli_fetch_assoc($result)) {
    array_push($formattedresult, $row);
  }
} else {
  echo "0 results";
}

header("Content-Type: application/json");
echo json_encode($formattedresult);
mysqli_close($conn);
?>
