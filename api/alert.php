<?php

include 'HttpProxy.class.php';

HttpProxy::relayRequest(array(
    'url' => 'http://www3.septa.org/hackathon/Alerts/get_alert_data.php?req1=all'
    ,'forwardHeaders' => array_merge(HttpProxy::$defaultForwardHeaders, array(
        'x-webmapi-clientid',
        'x-webmapi-requestid',
        'x-webmapi-version'
    ))
));