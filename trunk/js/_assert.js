// requires init.js for DEBUG functions
var ASSERT;
ASSERT = (function () {
	var _results;
	_results = {};
	var _accumulate;
	_accumulate = function (result) {
		if (true === result) {
			++_results.ok;
		} else {
			++_results.not;
		}
	};
	return {
		init: function () {
			_results.ok  = 0;
			_results.not = 0;
		},
		writeSummary: function () {
			var summary;
			summary  = "\n\n\t" + 'Ran ' + (_results.ok + _results.not) + ' tests.' + "\n";
			summary += "\t\tOK: " + _results.ok + "\n";
			summary += "\t\tNOT OK: " + _results.not + "\n";
			DEBUG.writeDebug(summary);
		},
		isTrue: function (a) {
			var result;
			if (eval(a)) {
				DEBUG.writeDebug('ok: ' + a + ' is true');
				result = true;
			} else {
				DEBUG.writeDebug('NOT OK: ' + a + ' is not true');
				result = false;
			}
			_accumulate(result);
			return result;
		},
		isFalse: function (a) {
			if (!eval(a)) {
				DEBUG.writeDebug('ok: ' + a + ' is not true');
				result = true;
			} else {
				DEBUG.writeDebug('NOT OK: ' + a + ' is true');
				result = false;
			}
			_accumulate(result);
			return result;
		},
		areEqual: function (a, b) {
			if (a == b) {
				DEBUG.writeDebug('ok: ' + a + ' equals ' + b);
				result = true;
			} else {
				DEBUG.writeDebug('NOT OK: ' + a + ' does not equal ' + b);
				result = false;
			}
			_accumulate(result);
			return result;
		},
		areNotEqual: function (a, b) {
			if (a != b) {
				DEBUG.writeDebug('ok: ' + a + ' does not equal ' + b);
				result = true;
			} else {
				DEBUG.writeDebug('NOT OK: ' + a + ' equals ' + b);
				result = false;
			}
			_accumulate(result);
			return result;
		},
		areSame: function (a, b) {
			if (a === b) {
				DEBUG.writeDebug('ok: ' + a + ' is the same as ' + b);
				result = true;
			} else {
				DEBUG.writeDebug('NOT OK: ' + a + ' is not the same as ' + b);
				result = false;
			}
			_accumulate(result);
			return result;
		},
		areNotSame: function (a, b) {
			if (a !== b) {
				DEBUG.writeDebug('ok: ' + a + ' is not the same as ' + b);
				result = true;
			} else {
				DEBUG.writeDebug('NOT OK: ' + a + ' is the same as ' + b);
				result = false;
			}
			_accumulate(result);
			return result;
		},
		isUndefined: function (a) {
			if (undefined === eval(a)) {
				DEBUG.writeDebug('ok: ' + a + ' is undefined');
				result = true;
			} else {
				DEBUG.writeDebug('NOT OK: ' + a + ' is not undefined');
				result = false;
			}
			_accumulate(result);
			return result;
		},
		isNull: function (a) {
			if (null === eval(a)) {
				DEBUG.writeDebug('ok: ' + a + ' is null');
				result = true;
			} else {
				DEBUG.writeDebug('NOT OK: ' + a + ' is not null');
				result = false;
			}
			_accumulate(result);
			return result;
		},
		isObject: function (a) {
			if ('object' === typeof a) {
				DEBUG.writeDebug('ok: ' + a + ' is an object');
				result = true;
			} else {
				DEBUG.writeDebug('NOT OK: ' + a + ' is not an object');
				result = false;
			}
			_accumulate(result);
			return result;
		},
		isArray: function (a) {
			if (a instanceof Array) {
				DEBUG.writeDebug('ok: ' + a + ' is an array');
				result = true;
			} else {
				DEBUG.writeDebug('NOT OK: ' + a + ' is not an array');
				result = false;
			}
			_accumulate(result);
			return result;
		},
		isString: function (a) {
			if ('string' === typeof a || a instanceof String) {
				DEBUG.writeDebug('ok: ' + a + ' is a string');
				result = true;
			} else {
				DEBUG.writeDebug('NOT OK: ' + a + ' is not a string');
				result = false;
			}
			_accumulate(result);
			return result;
		},
		stringContains: function (a, b) {
			if (a.indexOf(b) > -1) {
				DEBUG.writeDebug('ok: ' + a + ' contains ' + b);
				result = true;
			} else {
				DEBUG.writeDebug('NOT OK: ' + a + ' does not contain ' + b);
				result = false;
			}
			_accumulate(result);
			return result;
		},
		arrayContains: function (a, b) {
			if (a instanceof Array) {
				var i = a.length - 1;
				var in_array = false;
				while (i > -1) {
					if (a[i] === b) {
						in_array = true;
						break;
					}
					--i;
				}
				if (in_array) {
					DEBUG.writeDebug('ok: ' + a + ' contains ' + b);
					result = true;
				} else {
					DEBUG.writeDebug('NOT OK: ' + a + ' does not contain ' + b);
					result = false;
				}
			} else {
				DEBUG.writeDebug('NOT OK: ' + a + ' is not an array');
				result = false;
			}
			_accumulate(result);
			return result;
		},
		hashContains: function (a, b, c) {
			if (!!a[b]) {
				if (a[b] == c) {
					DEBUG.writeDebug('ok: ' + a + ' contains ' + c);
					result = true;
				} else {
					DEBUG.writeDebug('NOT OK: ' + a + ' does not contain ' + b);
					result = false;
				}
			} else {
				DEBUG.writeDebug('NOT OK: ' + b + ' is not a key in ' + a);
				result = false;
			}
			_accumulate(result);
			return result;
		}
	}
})();
