<?php

include 'HttpProxy.class.php';

// permit CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

HttpProxy::relayRequest('http://www3.septa.org/hackathon/TransitView/'.urlencode($_REQUEST['route']));