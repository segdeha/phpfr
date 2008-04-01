<?php

/**
 * Format a date with the given format string and return the result
 */

$constants = array(
	'DATE_ATOM'    => DATE_ATOM,
	'DATE_COOKIE'  => DATE_COOKIE,
	'DATE_ISO8601' => DATE_ISO8601,
	'DATE_RFC822'  => DATE_RFC822,
	'DATE_RFC850'  => DATE_RFC850,
	'DATE_RFC1036' => DATE_RFC1036,
	'DATE_RFC1123' => DATE_RFC1123,
	'DATE_RFC2822' => DATE_RFC2822,
	'DATE_RSS'     => DATE_RSS,
	'DATE_W3C'     => DATE_W3C
);

if (!isset($argv[1]) || '' == $argv[1]) {
	$return = ' ';
} else {
	if (isset($constants[$argv[1]])) {
		$return = date($constants[$argv[1]]);
	} else {
		$return = date($argv[1]);
	}
}

fwrite(STDOUT, $return);