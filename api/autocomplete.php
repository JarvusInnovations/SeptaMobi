<?php

include 'HttpProxy.class.php';

HttpProxy::relayRequest(array(
    'url' => 'https://autocomplete-api.smartystreets.com/suggest'
    ,'forwardHeaders' => array_merge(HttpProxy::$defaultForwardHeaders, array(
        'x-webmapi-clientid',
        'x-webmapi-requestid',
        'x-webmapi-version'
    ))
));