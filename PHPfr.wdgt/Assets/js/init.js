var WW;

WW = window.widget;

/**
 * Prototypal methods
 */

// replace all underscores with dashes
String.prototype.dashed = function () {
	return this.split('_').join('-');
};

// replace all dashes with underscores
String.prototype.underscored = function () {
	return this.split('-').join('_');
};

// Copy the data to the pasteboard
String.prototype.copy = function () {
	var handler;
	handler = function () {};
	widget.system("/bin/echo -n '" + this + "' | /usr/bin/pbcopy", handler);
};

// The following function has been "borrowed" from DashCode
// localize() pulls a string out an array named LocalizedStrings. Each language project
// directory in this widget contains a file named "LocalizedStrings.js", which, in turn, contains
// an array called localizedStrings. This method queries the array of the file of whichever
// language has highest precidence, according to the International pane of System Preferences.
String.prototype.localize = function () {
	var ret;
	try {
		ret = LocalizedStrings[this];
		if ('undefined' !== typeof ret) return ret;
	} catch (err) {}
	return this;
};

// Convenience method for String.prototype.localize
// Usage: __('String to be localized')
__ = function (str) {
	return str.localize();
};

/**
 * Top-level object definition
 */
with ({
		PHPPATH: 'phpPath'
	}) {
	PHPFR = (function () {
		var _widgSysCall, _defaultPath, _defaultVersion;
		_defaultPath = '/usr/bin/php';
		_defaultVersion = 'Unknown';
		var _setVersion;
		_setVersion = function (obj) {
			_widgSysCall.cancel();
			_widgSysCall.close();
			PHPFR.phpVersion = obj.outputString;
			PHPFR.ui.setVersion();
		};
		return {
			// e.g., /Users/andrew/Library/Widgets/PHPfr.wdgt
			basePath : (function () {
				var basePath;
				basePath = document.location.href.substring(7, document.location.href.length - 13);
				// Work around differences in Tiger versus Leopard
				if (/^sers/.test(basePath)) {
					basePath = '/U' + basePath;
				} else if (/^ibrary/.test(basePath)) {
					basePath = '/L' + basePath;
				}
				if (/^\/Users/.test(basePath) || /^\/Library/.test(basePath)) {
					return basePath;
				} else {
					DEBUG.writeDebug('ERROR: basePath = ' + basePath);
					return '';
				}
			})(),
			phpPath    : _defaultPath,
			phpVersion : _defaultVersion,
			regexs   : {
				file : /file\:\/\/(.+)/i,
				http : /http\:/i,
				func : /function\.(.+)\.html$/i,
				html : /phpfr-.+/i,
				link : /<a/ig,
				php  : /^\/.*php/
			},
			init: function () {
				PHPFR.setPHPPath(PHPFR.prefs.get(PHPPATH));
				PHPFR.setPHPVersion();
				PHPFR.languages.init(); // Calls PHPFR.functions.init(); and PHPFR.topics.init();
				PHPFR.pages.init();
				PHPFR.ui.init();
				PHPFR.favorites.init();
				PHPFR.history.init();
				PHPFR.tips.init();
				PHPFR.versions.init();
			},
			setPHPPath: function (path) {
				// Only set the path if we match some basic restrictions
				if (this.regexs.php.test(path)) {
					PHPFR.phpPath = path;
				} else {
					PHPFR.phpPath = _defaultPath;
				}
				PHPFR.prefs.set(PHPPATH, PHPFR.phpPath);
				$('php-binary').value = PHPFR.phpPath;
				PHPFR.setPHPVersion();
			},
			setPHPVersion: function () {
				var cmd;
				cmd = PHPFR.phpPath + ' -r "echo phpversion();"';
				_widgSysCall = WW.system(cmd, _setVersion);
			}
		};
	})();
};

// Get this road on the show!
window.onload = PHPFR.init;
