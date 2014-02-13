<?php

$route_shape = file_get_contents( 'http://next-transit.com/routes/' . $_GET['route_id'] . '/shapes?api_key=' . $_GET['api_key']);
$alerts = file_get_contents( 'http://www3.septa.org/hackathon/Alerts/get_alert_data.php?req1=' . $_GET['alert_id']);

$route_shape_data = json_decode($route_shape, true);
$alerts_data = json_decode($alerts, true);

header('Content-type: application/json', true);
print json_encode(array(
	'shape' => $route_shape_data['data']
	,'alerts' => $alerts_data
));
