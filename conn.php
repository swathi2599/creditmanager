<?php
$host='SG-creditmanager-2541-master.servers.mongodirector.com';
$user='creditmanager';
$pass='Swathi@2507';
$dbname='creditmanager';
$conn = mysqli_connect($host,$user,$pass,$dbname);
if(!$conn)
{
	die('could not connect:'.mysqli_error());
}
?>
