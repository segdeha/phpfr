/**
 * Interactive date formatter
 */
PHPFR.dates = (function () {
	var _elements;
	_elements = {
		display : undefined,
		input   : undefined
	};
	return {
		init: function () {
			_elements.display = $('date-display');
			_elements.input   = $('date-string');
			Form.focusFirstElement($('date-input'));
		},
		// put the string in the input field, then call get
		put: function (str) {
			_elements.input.value = str;
			this.get(str);
		},
		get: function (str) {
			WW.system(PHPFR.phpPath + ' Assets/php/date.php "' + str + '"', function (obj) {
				_elements.display.update(obj.outputString);
			});
		}
	};
})();