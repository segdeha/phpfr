<?php

// return string containing array of reference topics (e.g., Arrays, Strings) for given language, language defaults to 'en'

if (!isset($language)) $language = 'en';

$regex_name = '/<title[\s]{0,}>(.+)<\/title/i';
$regex_file = '/^ref\.([^\.]+)\.html$/i';

$topics = '{[';

$dir = substr(__FILE__, 0, -21) . 'php_manual/' . $language;

// read php_manuals directory for directories not named . or ..
// if the string is an actual directory, proceed
if ($dh = opendir($dir)) {
	$firstpass = true;
	while (($directory = readdir($dh)) !== false) {
		// if this isn't a directory and it contains ref.<something>.html, add it to the list
		preg_match($regex_file, $directory, $match);
		if (substr($directory, 0, 1) !== '.' && count($match) > 0) {
			if (!$firstpass) {
				$topics .= ', ';
			}
			// add the topic file name
			$topics .= '{file:"'.$match[1].'",';
			// look inside the file and get the title
			preg_match($regex_name, file_get_contents($dir . '/' . $directory), $match);
			$topics .= 'name:"'.$match[1].'"}';
			$firstpass = false;
		}
	}
	closedir($dh);
}

$topics .= ']}';
echo $topics;
