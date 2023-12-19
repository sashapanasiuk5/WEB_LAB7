<?php
require_once('config_local.php');


if (session_status() === PHP_SESSION_NONE) {
	    session_start();
	    echo "session started";
	}


$action = $_POST["action"];
$milliseconds = floor(microtime(true) * 1000);
$milliseconds += 7200000;

$chunckSize = 25;

function WriteToDB($servername, $username, $password, $dbname)
{
	$conn = new mysqli($servername, $username, $password, $dbname);

	if ($conn->connect_error) {
		 die("Connection failed: " . $conn->connect_error);
	}
	$i = 1;
	$sql = "INSERT INTO events_firstmethod (Name, Time) VALUES ";
	foreach ($_SESSION["events"] as $event) {
		$sql = $sql."('".$event["name"]."', '".$event["time"]."')";
		if( $i < count($_SESSION["events"])){
			$sql = $sql.",";
		}
		$i++;
	}
	$sql = $sql.";"; 
	echo $sql;

	if ($conn->query($sql) === TRUE) {
	  echo "New record created successfully";
	} else {
	  echo "Error: " . $conn->error;
	}
	$conn->close();
	$_SESSION["events"] = array();
}


if($action == "startSession"){
	$conn = new mysqli($servername, $username, $password, $dbname);

	if ($conn->connect_error) {
		 die("Connection failed: " . $conn->connect_error);
	}
	$conn->query("TRUNCATE events_firstmethod;");
	$conn->query("TRUNCATE events_secondmethod;");
	$_SESSION["events"] = array();
}


if($action == "addOneEvent"){
	$eventType = $_POST["type"];
	$name = $_POST["name"];
	$d = new DateTime( '@'. $milliseconds/1000 );
	$time = $d->format("H:i:s.v");
	$event = array();
	$event["name"] = $name;
	$event["time"] = $time;
	$event["type"] = $eventType;
	array_push($_SESSION["events"], $event);
	if($eventType == "stop"){
		WriteToDB($servername, $username, $password, $dbname);
	}
}


if($action == "addlocalStorageChunck"){
	$events = json_decode($_POST["data"]);
	$conn = new mysqli($servername, $username, $password, "lab6_db");

	if ($conn->connect_error) {
		 die("Connection failed: " . $conn->connect_error);
	}
	$i = 1;
	$sql = "INSERT INTO events_secondmethod (Name, Time) VALUES ";
	foreach ($events as $event) {
		$sql = $sql."('".$event->name."', '".$event->time."')";
		if( $i < count($events)){
			$sql = $sql.",";
		}
		$i++;
	}
	$sql = $sql.";";
	if ($conn->query($sql) === TRUE) {
	  echo "New record created successfully";
	} else {
	  echo "Error: " . $sql . "<br>" . $conn->error;
	}
	$conn->close();
}

if(count($_SESSION["events"]) >= $chunckSize){
	WriteToDB($servername, $username, $password, $dbname);
}

?>