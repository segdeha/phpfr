/**
 * Tips functions
 */
PHPFR.tips = (function () {
	// private variables
	var _tips, _container;
	_tips = [
		__('Double-click a function name to see it on PHP.net'), 
		__('Use regular expressions to search, e.g., ^.*[0-9]$'), 
		__('Copy selected text in the function frame using cmd-c'), 
		__('Scroll the function list using up- and down-arrows'), 
		__('Add functions to your favorites using the heart icon'),
		__('Open the drawer to resize the view frame'),
		__('Follow links on function pages to view more PHP docs'),
		__('Click in the empty search box and hit return to see all functions'),
		__('Make a developer happy by donating a few dollars <span style="font-family: Verdana, Sans-Serif;">:-)</span>')
	];
	// private methods
	var _setTip;
	_setTip = function (idx) {
		_container.update(_tips[idx]);
	};
	// public methods
	return {
		init: function () {
			_container = $('tip-text');
			this.random();
		},
		random: function () {
			var idx;
			idx = PHPFR.util.rand(_tips.length);
			_setTip(idx);
		}
	}
})();
