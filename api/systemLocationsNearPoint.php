<?php

include 'HttpProxy.class.php';

HttpProxy::relayRequest(array(
    'url' => 'http://www3.septa.org/hackathon/locations/get_locations.php'
));