<?php

include 'HttpProxy.class.php';

$stopsNearPoint = file_get_contents( 'http://opentrips.phl.io/otp-rest-servlet/ws/transit/stopsNearPoint?lat='. $_GET['lat'] . '&lon=' . $_GET['lon'] . '&radius=' . $_GET['radius']);

$stops = json_decode($stopsNearPoint, true)['stops'];
$limitedStops = array();

if(!($routesById = apc_fetch('routesById'))) {
	$routesText = file_get_contents( 'http://opentrips.phl.io/otp-rest-servlet/ws/transit/routes' );
	$routes = json_decode($routesText, true)['routes'];

	$routesById = array();

	foreach($routes as $route) {
		$routesById[$route['id']['id']] = array(
			'shortName' => $route['routeShortName'], 
			'longName' => $route['routeLongName'],
			'routeType' => $route['routeType']
		);
	}
	apc_store('routesById', $routesById);
}

foreach($stops as &$stop) {
	$routeDetails = array();
	$routeNames = array();
	$stopCount = 0;

	foreach($stop['routes'] as &$stopRoute) {
		$routeName = $routesById[$stopRoute['id']];

		if(!in_array($routeName, $routeNames)) {
			array_push($routeNames, $routeName);		
			$stopRoute['routeShortName'] = $routeName['shortName'];
			$stopRoute['routeType'] = $routeName['routeType'];
			$stopRoute['routeLongName'] = $routeName['longName'];
			array_push($routeDetails, $stopRoute);
		}		
	}
	$stop['routes'] = $routeDetails;

	array_push($limitedStops, $stop);
	$stopCount++;
	if($stopCount == 5) {
		break;
	}
}

header('Content-type: application/json', true);
print json_encode(array(
	'stops' => $limitedStops
));
