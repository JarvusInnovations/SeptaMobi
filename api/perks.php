<?php

include 'HttpProxy.class.php';

HttpProxy::relayRequest(array(
    'url' => 'http://appdev.septa.org/perk_data/perk_data.json'
));