<?php
$ns = $_POST['ns'];

if (subscription_set($_SERVER['REMOTE_USER'], $ns, 'list', time())) {
    header ('HTTP/1.1 200 Ok');
} else {
    header ('HTTP/1.1 400 Bad Request');
}
