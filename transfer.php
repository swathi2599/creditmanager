<?php
include 'conn.php';

$data = json_decode(file_get_contents('php://input'), true);
$sender = $data["from"];
$receiver = $data["to"];
$amount = $data["amount"];
mysqli_autocommit($conn,false);
$sender_amount=0;
$receiver_amount=0;
$get_amount = "SELECT ID, Credit_amount from Users where ID = " . $sender . " OR ID = ". $receiver . " " ;
$amount_result = mysqli_query($conn,$get_amount);
if (mysqli_num_rows($amount_result) > 0) {
    while($row = mysqli_fetch_assoc($amount_result)) {
        if($row["ID"] == $sender) {
            $sender_amount = $row["Credit_amount"];
        }
        if($row["ID"] == $receiver) {
            $receiver_amount = $row["Credit_amount"];
        }
    }
  }
  $sender_amount -= $amount;
  $receiver_amount += $amount; 
  $transfer_debit= "UPDATE Users SET Credit_amount = " .$sender_amount . " WHERE ID = '" .$sender. "'";
  $transfer_credit = "UPDATE Users SET Credit_amount = " .$receiver_amount . " WHERE ID = '" .$receiver. "'";
  $transaction_query = "INSERT INTO Transcations (sender, receiver, amount) VALUES ('". $sender . "', '". $receiver ."', ". $amount . ")";
  $td = mysqli_query($conn,$transfer_debit);
  $tc = mysqli_query($conn,$transfer_credit);
  $tq = mysqli_query($conn,$transaction_query);
  if(!mysqli_commit($conn)){
    header("Content-Type: application/json");
    echo json_encode(false);
    }
  else{
    header("Content-Type: application/json");
    echo json_encode(true);
  }
  mysqli_close($conn);
?>
