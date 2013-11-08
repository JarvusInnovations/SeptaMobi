<?php

include 'HttpProxy.class.php';

HttpProxy::relayRequest(array(
    'url' => 'https://maps.googleapis.com/maps/api/geocode/json'
    ,'forwardHeaders' => array_merge(HttpProxy::$defaultForwardHeaders, array(
        'x-webmapi-clientid',
        'x-webmapi-requestid',
        'x-webmapi-version'
    ))
));