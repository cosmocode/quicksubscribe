<?php
$ns = $_POST['ns'];

if (subscription_set($_SERVER['REMOTE_USER'], $ns, 'list', time())) {
    echo 'Das Abo wurde eingerichtet.<br />
    Abonniert wurde der Namespace ' . prettyprint_id($ns) . '.';
} else {
    header ('HTTP/1.1 400 Bad Request');
    echo 'Abo konnte nicht eingerichtet werden.';
}
