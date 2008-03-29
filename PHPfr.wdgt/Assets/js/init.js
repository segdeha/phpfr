var WW, PHPFR;

WW = window.widget;

/**
 * Prototypal methods
 */

// replace all underscores with dashes
String.prototype.dashed = function () {
	return this.replace(/_/g, '-');
};

// replace all dashes with underscores
String.prototype.underscored = function () {
	return this.replace(/-/g, '_');
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
PHPFR = (function () {
	return {
		// e.g., /Users/andrew/Library/Widgets/PHPfr.wdgt
		basePath : document.location.href.substring(7, document.location.href.length - 13),
		regexs   : {
			file : /file\:\/\/(.+)/i,
			http : /http\:/i,
			func : /function\.(.+)\.html$/i,
			html : /phpfr-.+/i,
			link : /<a/ig
		},
		init: function () {
			
			DEBUG.writeDebug('PHPFR.basePath = ' + PHPFR.basePath);
			
			PHPFR.languages.init(); // Calls PHPFR.functions.init(); and PHPFR.topics.init();
			PHPFR.ui.init();
			PHPFR.pages.init();
			PHPFR.favorites.init();
			PHPFR.history.init();
			PHPFR.tips.init();
			PHPFR.versions.init();
		}
	};
})();

/**
 * Get this road on the show!
 */
window.onload = PHPFR.init;