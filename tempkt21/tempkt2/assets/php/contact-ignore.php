<?php
	header ( "Content-Type: application/json" ) ;
	echo json_encode ( array ( "success" => true , "results" => array ( "message" => var_export ( $_POST , true ) ) ) ) ;
?>