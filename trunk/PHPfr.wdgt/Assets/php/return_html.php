<?php

// return everything inside the <body> and </body> tags

// read file contents
$file_contents = file_get_contents($argv[1]);

// strip everything before the opening <body> tag
$html = stristr($file_contents, '<body');
$pos = strpos($html, '>') + 1;

// strip everything after the closing </body> tag
$body_pos = strpos($html, '</body');
$html = substr($html, $pos, $body_pos - 6);

// return the HTML
fwrite(STDOUT, $html);
