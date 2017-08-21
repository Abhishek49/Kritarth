<?php
	header ( "Content-Type: application/json" ) ;
	if ( isset ( $_POST [ 'submit-message' ] ) === true ) {
		if ( ( empty ( $_POST [ 'name' ] ) === false ) && ( empty ( $_POST [ 'email' ] ) === false ) && ( empty ( $_POST [ 'subject' ] ) === false ) && ( empty ( $_POST [ 'message' ] ) === false ) && ( empty ( $_POST [ 'g-recaptcha-response' ] ) === false ) ) {
			$name = stripslashes ( trim ( $_POST [ 'name' ] ) ) ;
			$email = stripslashes ( trim ( $_POST [ 'email' ] ) ) ;
			$subject = stripslashes ( trim ( $_POST [ 'subject' ] ) ) ;
			$message = stripslashes ( trim ( $_POST [ 'message' ] ) ) ;
			$postdata = http_build_query (
				array (
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
			$result = @ json_decode ( @ file_get_contents ( "https://www.google.com/recaptcha/api/siteverify" , false , $context ) , true ) ;
			if ( ( is_string ( $name ) === false ) || ( preg_match ( "/^[a-zA-Z .]*$/" , $name ) === false ) ) {
				echo json_encode ( array ( "success" => false , "results" => array ( "message" => "Couldn't submit message. Invalid name." ) ) ) ;
			}
			else if ( ( is_string ( $email ) === false ) || ( filter_var ( $email , FILTER_VALIDATE_EMAIL ) === false ) ) {
				echo json_encode ( array ( "success" => false , "results" => array ( "message" => "Couldn't submit message. Invalid email." ) ) ) ;
			}
			else if ( is_string ( $subject ) === false ) {
				echo json_encode ( array ( "success" => false , "results" => array ( "message" => "Couldn't submit message. Invalid subject." ) ) ) ;
			}
			else if ( is_string ( $message ) === false ) {
				echo json_encode ( array ( "success" => false , "results" => array ( "message" => "Couldn't submit message. Invalid message." ) ) ) ;
			}
			else if ( ( empty ( $result ) === true ) || ( $result [ 'success' ] !== true ) ) {
				echo json_encode ( array ( "success" => false , "results" => array ( "message" => "Couldn't submit message. Captcha not valid." ) ) ) ;
			}
			else {
				$message = htmlentities ( str_replace ( "\r\n" , "<br />" , str_replace ( "\n" , "<br />" , $message ) ) , ENT_QUOTES , "UTF-8" ) ;
				$headers = "From: " . $name . " <" . $email . ">\r\n"
						. "Reply-To: " . $name . " <" . $email . ">\r\n"
						. "MIME-Version: 1.0\r\n"
						. "Content-Type: text/html; charset=ISO-8859-1\r\n" ;
				if ( @ mail ( "ask@kritarth.org" , $subject , $message , $headers ) === false ) echo json_encode ( array ( "success" => false , "results" => array ( "message" => "Couldn't submit message. Mailserver error." ) ) ) ;
				else echo json_encode ( array ( "success" => true , "results" => array ( "message" => "Thank you for contacting us. Your message has been sent successfully" ) ) ) ;
			}
		}
		else echo json_encode ( array ( "success" => false , "results" => array ( "message" => "Couldn't submit message. empty fields." ) ) ) ;
	}
	else echo json_encode ( array ( "success" => false , "results" => array ( "message" => "Couldn't submit message. Invalid input." ) ) ) ;
?>