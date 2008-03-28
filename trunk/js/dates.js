/**
 * Interactive date formatter
 */
PHPFR.dates = (function () {
	var _chars, _formats, _consts, _dateDisplay;
	_chars = 'dDjlNSwzWFmMntLoYyaABgGhHiseIOTZcrU';
	_formats = {
		// day
		d: '01', D: 'Wed',  j: '1', l: 'Wednesday', N: '3', S: 'st', w: '4', z: '32', 
		// week
		W: '5', 
		// month
		F: 'February', m: '02', M: 'Feb', n: '2', t: '28', 
		// year
		L: '0', o: '2006', Y: '2006', y: '06', 
		// time
		a: 'pm', A: 'PM', B: '212', g: '9', G: '21', h: '09', H: '21', i: '05', s: '30', 
		// timezone
		e: 'MST', I: '0', O: '-0700', T: 'MST', Z: '-25200', 
		// full date/time
		c: '2006-02-01T21:05:30+00:00', r: 'Wed, 01 Feb 2006 21:05:30 -0700', U: '1138853130'
		// examples
	};
	_consts = {
		DEFAULT      : 'Enter a format below or choose a date constant (PHP 5.1 only)',
		DATE_ATOM    : '2005-08-15T15:52:01+0000',
		DATE_COOKIE  : 'Mon, 15 Aug 2005 15:52:01 UTC',
		DATE_ISO8601 : '2005-08-15T15:52:01+0000',
		DATE_RFC822  : 'Mon, 15 Aug 2005 15:52:01 UTC',
		DATE_RFC850  : 'Monday, 15-Aug-05 15:52:01 UTC',
		DATE_RFC1036 : 'Monday, 15-Aug-05 15:52:01 UTC',
		DATE_RFC1123 : 'Mon, 15 Aug 2005 15:52:01 UTC',
		DATE_RFC2822 : 'Mon, 15 Aug 2005 15:52:01 +0000',
		DATE_RSS     : 'Mon, 15 Aug 2005 15:52:01 UTC',
		DATE_W3C     : '2005-08-15T15:52:01+0000'
	};
	return {
		init: function () {
			_dateDisplay = $('date_display');
			this.constant('DEFAULT');
		},
		format: function (key) {
			var str, date;
			if ('undefined' === typeof key) {
				this.init();
			} else {
				date = '';
				str  = $F('date_string');
				(str.length).times(function(c) {
					if (92 === str.charCodeAt(c - 1)) { // looking for a backslash here
						date += str.charAt(c);
					} else {
						date += (_chars.indexOf(str.charAt(c)) < 0)? (' ' === str.charAt(c))? '&nbsp;': str.charAt(c): _formats[str.charAt(c)];
					}
				});
				_dateDisplay.update(date);
			}
		},
		constant: function (key) {
			key = ($H(_consts).keys().indexOf(key))? key : 'DEFAULT';
			$('date_string').update(key);
			$('date_display').update(_consts[key]);
		}
	};
})();
