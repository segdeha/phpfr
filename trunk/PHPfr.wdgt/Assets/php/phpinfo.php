<?php

/**
 * Dump the output of phpinfo()
 */

ob_start();
echo '<pre>';
phpinfo();
echo '</pre>';
ob_flush();
exit;
