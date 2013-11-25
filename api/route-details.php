<?php

$stops = file_get_contents( 'http://next-transit.com/routes/' . $_GET['route_id'] . '/directions/' . $_GET['direction_id'] . '/stops?api_key=' . $_GET['api_key']);
$route_shape = file_get_contents( 'http://next-transit.com/routes/' . $_GET['route_id'] . '/shapes?api_key=' . $_GET['api_key']);
$alerts = file_get_contents( 'http://www3.septa.org/hackathon/Alerts/get_alert_data.php?req1=' . $_GET['alert_id']);

$stops_data = json_decode($stops, true);
$route_shape_data = json_decode($route_shape, true);
$alerts_data = json_decode($alerts, true);

header('Content-type: application/json', true);
print json_encode(array(
	'stops' => $stops_data['data']
	,'shape' => $route_shape_data['data']
	,'alerts' => $alerts_data
));
