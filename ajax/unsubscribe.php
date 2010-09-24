<?php
$ns = $_POST['ns'];

if (subscription_set($_SERVER['REMOTE_USER'], $ns, null)) {
    echo 'Das Abo wurde gelöscht.<br />
    Der Namespace ' . prettyprint_id($ns) . ' ist nun nicht mehr abonniert.';
} else {
    header ('HTTP/1.1 400 Bad Request');
    echo 'Das Abo konnte nicht gelöscht werden.';
}
