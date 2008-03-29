<?php

// return string containing functions array for given language, language defaults to 'en'

$language = (isset($argv[1]))? $argv[1]: 'en';
$regex = '/^function\.([^\.]+)\.html$/i';

$functions = '{[';

//                                                                      123456789012345678901234
// file:///Users/andrew/Library/Widgets/PHP%20Function%20Reference.wdgt/Assets/php/functions.php

$dir = substr(__FILE__, 0, -24) . 'php_manual/' . $language . '/html';

// read php_manuals directory for directories not named . or ..
// if the string is an actual directory, proceed
if ($dh = opendir($dir)) {
	$firstpass = true;
	while (($directory = readdir($dh)) !== false) {
		// if this isn't a directory and it contains function.<something>.html, add it to the list
		preg_match($regex, $directory, $match);
		if (substr($directory, 0, 1) !== '.' && count($match) > 0) {
			if (!$firstpass) {
				$functions .= ', ';
			}
			$functions .= '"'.$match[1].'"';
			$firstpass = false;
		}
	}
	closedir($dh);
}

$functions .= ']}';
echo $functions;
