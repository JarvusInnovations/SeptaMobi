<?php

include 'HttpProxy.class.php';

HttpProxy::relayRequest(array(
    'url' => 'http://opentrips.phl.io/otp-rest-servlet/ws/plan'
));