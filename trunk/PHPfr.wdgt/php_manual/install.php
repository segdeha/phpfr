<?php

/**
 * Install a new language by downloading if from PHP.net, then uncompressing it
 */

// might need this if there are redirects going on: CURLOPT_FOLLOWLOCATION
// if we use the above, we may need to set CURLOPT_MAXREDIRS

$dir   = substr(__FILE__, 0, -22) . 'php_manual/';
$tar   = 'tar --directory %s -xzf ';

if (isset($argv[1])) {
	$cc  = $argv[1]; // e.g., pt_BR or en
	$fnm = 'php_manual_' . $cc. '.tar.gz';
	$url = 'http://www.php.net/get/' . $fnm . '/from/www.php.net/mirror';
	$dst = $dir . $fnm;
	// get the file via curl
	$ch = curl_init($url);
	$fp = fopen($dst, 'w');
	curl_setopt($ch, CURLOPT_FILE,           $fp);
	curl_setopt($ch, CURLOPT_MUTE,           1);
	curl_setopt($ch, CURLOPT_HEADER,         0);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
	curl_setopt($ch, CURLOPT_BINARYTRANSFER, 1);
//	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_USERAGENT,      'PHP Function Reference Widget 1.0 (andrew.hedges.name/widgets)');
	$result = curl_exec($ch);
	curl_close($ch);
	fclose($fp);
	// uncompress it
	@mkdir($dir . $cc);
	exec('mv ' . $dir . $fnm . ' ' . $dir . $cc . '/' . $fnm);
	// insert lang code into $cmd
	$cmd = sprintf($tar, $dir . $cc) . $dir . $cc . '/' . $fnm;
	exec($cmd);
	if ($result) {
		echo 'SUCCESS: Language downloaded and uncompressed successfully';
	} else {
		echo 'ERROR: There was a problem downloading the file.';
	}
	exit;
} else {
	echo 'ERROR: No language specified';
	exit;
}
