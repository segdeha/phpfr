<?php

/**
 * On PHPfr's first run, uncompress and untar the default language install
 */

$langs = array();
$dir   = substr(__FILE__, 0, -24) . 'php_manual/';
$cmd   = 'tar --directory ' . $dir . ' -xzf ';

if ($dh = opendir($dir)) {
	while (($file = readdir($dh)) !== false) {
		// if the file is tarred and gzipped, add it to the list
		if (stripos($file, '.tgz')) {
			$langs[] = $file;
		}
	}
	foreach ($langs as $lang) {
		$command = $cmd . $dir . $lang;
		exec($command);
		echo $command . "\n";
	}
	closedir($dh);
}
