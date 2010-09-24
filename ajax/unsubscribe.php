<?php
$ns = $_POST['ns'];

if (subscription_set($_SERVER['REMOTE_USER'], $ns, null)) {
    header ('HTTP/1.1 200 OK');
} else {
    header ('HTTP/1.1 400 Bad Request');
}
