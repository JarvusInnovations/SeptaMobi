<?php

include 'HttpProxy.class.php';

HttpProxy::relayRequest(array(
    'url' => 'http://opentrips.codeforphilly.org/opentripplanner-api-webapp/ws/transit/stopTimesForStop'
    ,'forwardHeaders' => array_merge(HttpProxy::$defaultForwardHeaders, array(
        'x-webmapi-clientid',
        'x-webmapi-requestid',
        'x-webmapi-version'
    ))
));