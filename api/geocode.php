<?php

include 'HttpProxy.class.php';

HttpProxy::relayRequest(array(
    'url' => 'https://api.smartystreets.com/street-address'
    ,'forwardHeaders' => array_merge(HttpProxy::$defaultForwardHeaders, array(
        'x-webmapi-clientid',
        'x-webmapi-requestid',
        'x-webmapi-version'
    ))
));