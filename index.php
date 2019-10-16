<?php
	require_once( 'props.php' );
	$_return = array();

	if( isset($_GET['api']) ) {
		if( isset($_GET['key']) && $_GET['key'] == md5(Date('d/m/Y H:i')) ) {
			if( file_exists('interaction/'.strval( $_GET['api'] ).'.php') ) {
				include( 'interaction/'.strval( $_GET['api'] ).'.php' );
			} else {
				$_return["error"] = $GLOBALS['_ERROR']['EX000'];
				$_return["error_no"] = 'EX000';
			}
		} else {
			$_return["error"] = $GLOBALS['_ERROR']['EX002'];
			$_return["error_no"] = 'EX002';
		}
	} else {
		$_return["error"] = $GLOBALS['_ERROR']['EX001'];
		$_return["error_no"] = 'EX001';
	}

	echo md5( Date('d/m/Y H:i') ).'<br/>';
	echo json_encode( $_return );