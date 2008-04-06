<?php

// return all function names from a given topic page

// read file contents
$file_contents = file_get_contents($argv[1]);

// strip everything before the table of contents
$html = stristr($file_contents, '>Table of Contents<');
if (false === $html) $html = stristr($file_contents, 'CLASS="TOC"');

// use everything up to the footer
$pos = strpos($html, 'class="prev"');
if (false === $pos) $pos = strpos($html, 'CLASS="NAVFOOTER"');
$html = substr($html, 0, $pos);

// grab all instances of function.<something>.html
$regex = '/function\.([^\.]+)\.html/i';
preg_match_all($regex, $html, $matches);

array_shift($matches);

$functions = '{["' . str_replace(array(',', '-'), array('","', '_'), implode(',', $matches[0])) . '"]}';

// return the HTML
fwrite(STDOUT, $functions);