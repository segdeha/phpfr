<?php

// return everything inside the <body> and </body> tags

$hdr = '<div class="phpfr-header">&nbsp;</div>';
$ftr = '<div class="phpfr-footer">&nbsp;</div>';
$eof = '<!--EOF-->';

// read file contents
$file_contents = file_get_contents($argv[1]);

$html = stristr($file_contents, '<body');

// strip everything before the opening <body> tag
$pos  = strpos($html, '>') + 1;

// strip everything after the closing </body> tag
$body_pos = strpos($html, '</body');

$html = substr($html, $pos, $body_pos - 6);

$return = $hdr . $html . $ftr . $eof;

// return the HTML
//echo $return;
fwrite(STDOUT, $return);