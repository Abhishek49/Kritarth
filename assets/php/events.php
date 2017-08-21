<?php 
	session_start();
	$signup_message = "" ;
	$resp['success']=false;
	$resp['result']=array();
	if( isset($_POST [ 'g-recaptcha-response' ])){
		$postdata = http_build_query (
				array(
					'secret' => '6LerlSkTAAAAAGE-3_WawTTiQEN_L-TSsrzlFJAh' ,
					'response' => $_POST [ 'g-recaptcha-response' ]
				)
			) ;
			$opts = array ( 'http' =>
				array (
					'method'  => 'POST',
					'header'  => 'Content-type: application/x-www-form-urlencoded',
					'content' => $postdata
				)
			) ;
		$context  = stream_context_create ( $opts ) ;
		$result = json_decode ( file_get_contents ( "https://www.google.com/recaptcha/api/siteverify" , false , $context ) , true ) ;
			if ( require 'connect.php' ) {
				if ( $result['success']==true
					 && ( isset ( $_POST [ 'name' ] )  )
					 && ( isset ( $_POST [ 'email' ] )  )
					 && ( isset ( $_POST [ 'phone' ] )  )
					 && ( isset ( $_POST [ 'year' ] )  )
					 && ( isset ( $_POST [ 'university' ] )  )
					 && ( isset ( $_POST [ 'branch' ] )  )
					 && ( isset ( $_POST [ 'event-id' ] )  ) ) {
					
					$name = trim ( $_POST [ 'name' ] ) ;
					$email = trim ( $_POST [ 'email' ] ) ;
					$phone = trim ( $_POST [ 'phone' ] ) ;
					$year = trim ( $_POST [ 'year' ] ) ;
					$university	 = trim ( $_POST [ 'university' ] ) ;
					$branch =  trim ( $_POST [ 'branch' ] ) ;
					$eventid =   trim ( $_POST [ 'event-id' ] ) ;
					
				
					
					$checkphnoquery = $db_conn -> prepare ( 'SELECT * FROM kritarth WHERE phone = ? ;' ) ;
					$checkemailquery = $db_conn -> prepare ( 'SELECT * FROM kritarth WHERE email = ? ;' ) ;
					
					
					$checkemailquery -> execute ( array ( $email ) ) ;
					
					$checkphnoquery -> execute ( array ( $phone ) ) ;

					
					if ($checkemailquery -> rowCount ( ) == 0){ 
					if($checkphnoquery -> rowCount( ) ==0){   
					
					
					if ( ( !empty ( $name )  ) && ( preg_match ( "/^[a-zA-Z .]{2,}$/" , $name ) ) 
						 && ( !empty ( $university )  ) && ( preg_match ( "/^[a-zA-Z &,.]{2,}$/" , $university ))
						 && ( !empty ( $email )  ) && ( filter_var ( $email , FILTER_VALIDATE_EMAIL ) )
						 && ( !empty ( $phone )  ) && ( preg_match ( "/^[0-9 ]{10}$/" , $phone ) )
						 && ( !empty ( $branch ) && ( preg_match ( "/^[a-zA-Z &,.]{2,}$/"  , $branch )))
						 && ( !empty ( $eventid )  ) ) {
						$max_id = $db_conn -> prepare ( 'SELECT COALESCE(MAX( id ),0) FROM kritarth ;' ) ;
						$max_id -> execute ( ) ;
						$new_id = $max_id -> fetch ( ) ;
						if($max_id -> rowCount ( )>0)
						$new_id = $new_id [ 0 ] + 1 ;
						$password=substr(md5($email.time()),3,6);
						$kfid = 'KT' . sprintf ( "%05d" , $new_id ) ;
						
						$insert_registration = $db_conn -> prepare ( "INSERT INTO kritarth VALUES(0,?,?,?,?,?,?,?,?,0)" ) ;
						
							if ( $insert_registration -> execute ( array ( $kfid , $name , $email, $phone, $year, $university, $branch, $eventid) ) ){
								$resp['success']=true;
								$resp['result']['message']="You were registered successfully";
								$resp['result']['redirect']='https://allevents.in/scripts/templates/event-ticket-actions-iframe.php?event_id='.$eventid;
							}
						else
							$resp['result']['message']="Something went wrong";
						}



						
					  else{ 
						if(!( preg_match ( "/^[a-zA-Z .]{2,}$/" , $name )) || empty($name))
							$resp['result']['message']="Please enter a name without special characters and length greater than 2"; 
						if(!( preg_match ( "/^[a-zA-Z &,.]{2,}$/" , $university ) || empty($university) ))
							$resp['result']['message']="Please enter a valid university name";
						if(!( preg_match ( "/^[A-Z a-z&.]{2,}$/" , $branch )) || empty($branch))
							$resp['result']['message']="Please enter a valid branch";
						if(!( filter_var ( $email , FILTER_VALIDATE_EMAIL ) ) || empty($email))
							$resp['result']['message']="Please enter a valid email address";
						if (empty ( $phone )   || !( preg_match ( "/^[0-9 ]{10}$/" , $phone )) )
							$resp['result']['message']="Please enter a valid phone number";
						
						}
					}
					else 
						$resp['result']['message']="Phone number already registered";
				
				}
				
					else 
						$resp['result']['message']="Email already registered";
					 
					
			}
		}
		else $resp['result']['message'] = "Oops!Could not connect to server" ;
	}
	else $resp['result']['message'] = "Please complete the captcha";
	die(json_encode($resp));
	
	?>
