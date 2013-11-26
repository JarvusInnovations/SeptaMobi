<?php

include 'HttpProxy.class.php';

HttpProxy::relayRequest('http://www3.septa.org/hackathon/TransitView/'.urlencode($_REQUEST['route']));