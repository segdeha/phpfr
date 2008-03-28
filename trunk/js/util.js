/**
 * Utility functions
 */
PHPFR.util = (function () {
	var _paypal;
	_paypal = 'https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=andrew%40hedges%2ename&item_name=PHP%20Function%20Reference&amount=5%2e00&no_shipping=1&cn=Comments&tax=0&currency_code=USD&bn=PP%2dDonationsBF&charset=UTF%2d8';
	return {
		/**
		 * Go to an external URL (use PHPFR.ui.followLink for internal links)
		 * @param string url URL of the page to go to
		 */
		gotoURL: function (url) {
			if ('undefined' === typeof WW) {
				location.href = url;
			} else {
				WW.openURL(url);
			}
		},
		// go to donation link
		gotoPayPal: function () {
			this.gotoURL(_paypal);
		},
		/**
		 * Adds .even to every other child element of the containing element
		 * Technique adapted from: http://davious.org/onepagers/anewstripe.html
		 * With tweaks borrowed from: http://validweb.nl/artikelen/javascript/better-zebra-tables/
		 * Modified to use Prototype conventions
		 * @param string id  ID of the element whose child elements you want striped
		 */
		stripe: function () {
			var tbods;
			tbods = $$('tbody');
			tbods.each(function (tbod) {
				var trs, idx;
				trs = tbod.getElementsByTagName('tr');
				idx = 0;
				$A(trs).each(function (tr) {
					++idx;
					tr.addClassName((0 === idx % 2 ? 'even' : 'odd'));
				});
			});
		},
		/**
		 * Based on The Central Randomizer 1.3 (C) 1997 by Paul Houle (paul@honeylocust.com), but with a truly random seed from the user's system. 'Cuz we can!
		 * Anyway, it's fun using 11+ year old code! :-)
		 * Cite  : http://www.honeylocust.com/javascript/randomizer.html
		 * Usage : PHPFR.util.rand(n) returns a random integer between 0 and n - 1
		 */
		rand: function (num) {
			var rnd, val;
			rnd = function () {
				var seed;
				seed = WW.system('echo $RANDOM', null).outputString;
				seed = (seed * 9301 + 49297) % 233280;
				return seed / (233280.0);
			};
			val = Math.ceil(rnd() * num) - 1;
			return val;
		}
	};
})();
