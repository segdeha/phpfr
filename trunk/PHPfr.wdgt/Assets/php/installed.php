<?php

// return string containing installed manual languages in form 'en ar kr hu '

$installed = '["';
$languages = array();

//                                                                      123456789012345678901234
// file:///Users/andrew/Library/Widgets/PHP%20Function%20Reference.wdgt/Assets/php/installed.php

$dir = substr(__FILE__, 0, -24) . 'php_manual';

// read php_manuals directory for directories not named . or ..
// if the string is an actual directory, proceed
if ($dh = opendir($dir)) {
	while (($directory = readdir($dh)) !== false) {
		// if this isn't a directory, add it to the list
		if (substr($directory, 0, 1) !== '.' && !stripos($directory, '.php') && !stripos($directory, '.tgz')) {
			$languages[] = $directory;
		}
	}
	closedir($dh);
}

$installed .= implode('","', $languages);
$installed .= '"]';

// return installed languages string
echo $installed;
