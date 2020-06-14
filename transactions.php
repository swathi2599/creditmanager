<?php
include 'conn.php';
 
$sql="SELECT s.name AS sender, r.name AS receiver, t.amount AS amount from Transcations t, Users s, Users r where s.ID = t.sender AND r.ID = t.receiver";
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