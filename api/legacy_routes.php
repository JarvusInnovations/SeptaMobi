<?php

include 'HttpProxy.class.php';

HttpProxy::relayRequest(array(
    'url' => 'http://opentrips.codeforphilly.org/opentripplanner-api-webapp/ws/transit/routes'
));