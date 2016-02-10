<?php 
	session_save_path("");
	session_start(); 
	header('Content-Type: application/json');
	
	//connect to database
	$dbconn = pg_connect("host=localhost dbname=postgres user=postgres password=puloy825") or die('Could not connect: ' . pg_last_error());
	$reply = array(); //Reply to html file
	$reply['status'] = '';
	$username = $_REQUEST['username'];
	$password = $_REQUEST['password'];
	if(empty($_REQUEST['username'])){
		$reply['status']='Required field: Username is missing';
		//print json_encode($reply);
	}
	else if(empty($_REQUEST['password']))
	{
		$reply['status']='Required field: Password is missing';
		//print json_encode($reply);
	}
		
	else
	{
		//--------------------------------------------------------------
		$result = pg_prepare($dbconn, "query", 'SELECT username FROM users WHERE username=$1');
		$result = pg_execute($dbconn, "query", array($username));
		$flag = pg_num_rows($result);
		if($flag == 1){//username and pass word matches
			$reply['status']='Account already exists';
			//print json_encode($reply);
		}

		else{		


				$result = pg_prepare($dbconn, "query1", 'insert into users (username, password) values ($1,$2)');
				$result = pg_execute($dbconn, "query1", array($username,$password));
				$rows_affected=pg_affected_rows($result);
				if($rows_affected == 1){
					$reply['status']='ok';
					$reply['username']=$username;
					$reply['password']=$password;
					//print json_encode($reply);
				}

		}

	}
	print json_encode($reply);

?>

