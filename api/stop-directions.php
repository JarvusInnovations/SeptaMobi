<?php

$response = file_get_contents( 'http://next-transit.com/routes' . $_SERVER['PATH_INFO'] . '?' . $_SERVER['QUERY_STRING']);

$data = json_decode($response, true);
$first = array_shift($data['data']);
$last = array_pop($data['data']);

header('Content-type: application/json', true);
print json_encode(array(
	array('name' => $first['stop_name'], 'direction' => 0)
	,array('name' => $last['stop_name'], 'direction' => 1)
));
