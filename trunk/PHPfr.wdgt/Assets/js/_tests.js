var TESTS;
TESTS = (function () {
	var _tests;
	_tests = $H({
		favorites: function () {
			ASSERT.isUndefined(PHPFR.favorites.displayState);
			DEBUG.writeDebug('PHPFR.favorites.init();');
			PHPFR.favorites.init();
			ASSERT.areEqual(PHPFR.favorites.displayState, 'hidden');
		},
		prefs: function () {
			ASSERT.isFalse(getPref('foo'));
			DEBUG.writeDebug("PHPFR.prefs.set('key', 'value');");
			PHPFR.prefs.set('key', 'value');
			ASSERT.areEqual(PHPFR.prefs.get('key'), 'value');
		}
	});
	return {
		runAll: function () {
			ASSERT.init();
			_tests.each(function (test) {
				test();
			});
			ASSERT.writeSummary();
		},
		run: function (test) {
			ASSERT.init();
			test();
			ASSERT.writeSummary();
		}
	}
})();