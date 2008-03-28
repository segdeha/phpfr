/**
 * Handle widget preferences
 */
PHPFR.prefs = (function () {
	// private methods
	var _generateUniqueKey;
	_generateUniqueKey = function (key) {
		var uniqueKey;
		uniqueKey = WW.identifier + '-' + key;
		return uniqueKey;
	};
	// public methods
	return {
		get: function (key) {
			var uniqueKey, val;
			uniqueKey = _generateUniqueKey(key);
			val       = WW.preferenceForKey(uniqueKey);
			return ('undefined' === typeof val)? false : val;
		},
		set: function (key, val) {
			var uniqueKey;
			uniqueKey = _generateUniqueKey(key);
			WW.setPreferenceForKey(val, uniqueKey);
		}
	};
})();
