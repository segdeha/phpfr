/**
 * Version checking functions
 */
PHPFR.versions = (function () {
	// private variables
	var _statuses, _url, _options, _versionLink, _version;
	_statuses = {
		ready      : '<span class="link" onclick="PHPFR.versions.check();">' + __('Check for new version.') + '</span>',
		checking   : __('Checking&#8230;'),
		newversion : '<span class="link" onclick="WW.openURL(\'http://andrew.hedges.name/widgets/#phpfr\');">' + __('Click to download new version!') + '</span>',
		uptodate   : __('This widget is up-to-date.'),
		failure    : __('There was a problem checking the version.')
	};
	_url      = 'http://segdeha.com/widgets/version.php?widget=phpfr';
	_options  = {
		method: 'get',
		requestHeaders: {
			'Cache-Control': 'no-cache',
			'If-Modified-Since': 'Sat, 29 Jul 1972 12:00:00 GMT'
		},
		onSuccess: function (transport) {
			var serverVersion, key;
			serverVersion = transport.responseText.strip();
			key = (_newVersionAvailable(serverVersion))? 'newversion' : 'uptodate';
			_setStatus(key);
		},
		onFailure: function () {
			// no 'net connection, server not responding, bad URL, etc.
			_setStatus('failure');
		}
	};
	// private methods
	var _setLocalVersion, _newVersionAvailable, _setStatus;
	/**
	 * Get the version of this widget
	 * @return string Version number (string because it could be '0.9.6.2b', e.g.)
	 */
	_setLocalVersion = function () {
		WW.system('sh -c "defaults read `pwd`/Info CFBundleVersion"', function (obj) {
			_version = obj.outputString;
			$('vrsn').update(_version);
		});
	};
	/**
	 * Compare the server version to the local and take appropriate action
	 * return bool Returns true if there is a new version available
	 */
	_newVersionAvailable = function (serverVersion) {
		return (parseInt(_version, 10) < parseInt(serverVersion, 10));
	};
	/**
	 * Set the status of the version check
	 */
	_setStatus = function (key) {
		_versionLink.update(_statuses[key]);
	};
	// public methods
	return {
		init: function () {
			_versionLink = $('vrsn-link');
			_setLocalVersion();
			this.check();
		},
		check: function () {
			var request;
			_setStatus('checking');
			request = new Ajax.Request(_url, _options);
		}
	};
})();
