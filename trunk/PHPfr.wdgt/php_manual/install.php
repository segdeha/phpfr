<?php

/**
 * Install a new language by downloading if from PHP.net, then uncompressing it
 */

// might need this if there are redirects going on: CURLOPT_FOLLOWLOCATION
// if we use the above, we may need to set CURLOPT_MAXREDIRS
// quiet mode CURLOPT_MUTE

/*
$ch = curl_init("http://www.example.com/");
$fp = fopen("example_homepage.txt", "w");

curl_setopt($ch, CURLOPT_FILE, $fp);
curl_setopt($ch, CURLOPT_HEADER, 0);

curl_exec($ch);
curl_close($ch);
fclose($fp);
*/

if (isset($argv[1]) && isset($argv[2])) {
	$url = $argv[1];
	$dst = $argv[2];
	
	var_dump($argv);
	
	// get the file via curl
	$ch = curl_init($url);
	$hdl = fopen($dst, 'w');
	curl_setopt($ch, CURLOPT_HEADER,         0);
	curl_setopt($ch, CURLOPT_BINARYTRANSFER, 1);
	curl_setopt($ch, CURLOPT_USERAGENT,      'PHP Function Reference Widget 1.0 (andrew.hedges.name/widgets)');
	curl_setopt($ch, CURLOPT_FILE,           $hdl);
	curl_exec($ch);
	curl_close($ch);
	fclose($hdl);
	// uncompress it
//	include 'first_run.php';
	// return success
	echo 'SUCCESS: Language downloaded and uncompressed successfully';
	exit;
} else {
	echo 'ERROR: No language specified';
	exit;
}
