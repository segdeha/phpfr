<?php

/**
 * On PHPfr's first run, uncompress and untar the default language install
 */

/*

Current known manuals:

php_manual_cs.tar.gz
php_manual_da.tar.gz
php_manual_de.tar.gz
php_manual_el.tar.gz
php_manual_en.tar.gz
php_manual_es.tar.gz
php_manual_fi.tar.gz
php_manual_fr.tar.gz
php_manual_he.tar.gz
php_manual_hk.tar.gz
php_manual_hu.tar.gz
php_manual_it.tar.gz
php_manual_ja.tar.gz
php_manual_kr.tar.gz
php_manual_nl.tar.gz
php_manual_pl.tar.gz
php_manual_pt_BR.tar.gz
php_manual_ro.tar.gz
php_manual_ru.tar.gz
php_manual_sk.tar.gz
php_manual_sv.tar.gz
php_manual_tw.tar.gz
php_manual_zh.tar.gz

*/

$langs = array();
$dir   = substr(__FILE__, 0, -24) . 'php_manual/';
$tar   = 'tar --directory %s -xzf ';

if ($dh = opendir($dir)) {
	while (($file = readdir($dh)) !== false) {
		// if the file is tarred and gzipped, add it to the list
		if (strpos($file, '.tar.gz')) {
			$langs[] = $file;
		}
	}
	foreach ($langs as $lang) {
		//                        01234566789     6543210
		// get country code, e.g. php_manual_pt_BR.tar.gz --> pt_BR
		if (strpos($lang, 'pt_BR')) {
			$cc = 'pt_BR/';
		} else {
			$cc = substr($lang, 11, 2) . '/';
		}
		// mkdir
		@mkdir($dir . $cc);
		exec('mv ' . $dir . $lang . ' ' . $dir . $cc . $lang);
		// insert lang code into $cmd
		$command = sprintf($tar, $dir . $cc) . $dir . $cc . $lang;
		exec($command);
		echo $command . "\n";
	}
	closedir($dh);
}
