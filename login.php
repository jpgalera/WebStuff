<?php 
	session_save_path("");
	session_start(); 
	header('Content-Type: application/json');
	
	//connect to database
	$dbconn = pg_connect("host=localhost dbname=postgres user=postgres password=puloy825") or die('Could not connect: ' . pg_last_error());
	
	$reply = array();
	$username = $_REQUEST['username'];
 	$password = $_REQUEST['password'];

 	if(isset($username,$password)){ // form filled in
		//get user's username/password combination if it exists.
		$result = pg_prepare($dbconn, "query", 'SELECT username FROM users where username=$1 and password=$2');
		$result = pg_execute($dbconn, "query", array($username,$password));
		$flag = pg_num_rows($result);
		if($flag == 1){//username and pass word matches
			$reply['status']='ok';
			$reply['user']=$username;
		}
		else{
			$reply['status']='Username and password do not match!';
		}
	}
	print json_encode($reply);

?>
