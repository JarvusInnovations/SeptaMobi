<?php

include 'HttpProxy.class.php';

HttpProxy::relayRequest(array(
    'url' => 'http://next-transit.com/route_types/buses/routes'
));