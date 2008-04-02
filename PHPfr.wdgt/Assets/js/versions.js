/**
 * Version checking functions
 */
with ({
		READY      : 'ready',
		CHECKING   : 'checking',
		NEWVERSION : 'newversion',
		UPTODATE   : 'uptodate',
		FAILURE    : 'failure'
	}) {
	PHPFR.versions = (function () {
		// private variables
		var _statuses, _url, _options, _versionLink, _version;
		_statuses = {
			ready      : '<span class="link" onclick="PHPFR.versions.check();">' + __('Check for new version.') + '</span>',
			checking   : __('Checking&#8230;'),
			newversion : '<span class="link" onclick="WW.openURL(\'http://segdeha.com/widgets/download.php?widget=phpfr\');">' + __('Click to download new version!') + '</span>',
			uptodate   : __('This widget is up-to-date.'),
			failure    : __('There was a problem checking the version.')
		};
		_url      = 'http://segdeha.com/widgets/version.php?widget=phpfr';
		_options  = {
			method: 'GET',
			requestHeaders: {
				'Cache-Control'     : 'no-cache',
				'If-Modified-Since' : 'Sat, 29 Jul 1972 12:00:00 GMT'
			},
			onSuccess: function (transport) {
				var serverVersion, key;
				serverVersion = transport.responseText.strip();
				key = (_newVersionAvailable(serverVersion))? NEWVERSION : UPTODATE;
				_setStatus(key);
			},
			onFailure: function () {
				// no 'net connection, server not responding, bad URL, etc.
				_setStatus(FAILURE);
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
				PHPFR.versions.check();
			});
		};
		/**
		 * Compare the server version to the local and take appropriate action
		 * return bool Returns true if there is a new version available
		 */
		_newVersionAvailable = function (serverVersion) {
			var local, server;
			local  = _version.replace(/[a-b]/, '');
			server = serverVersion.replace(/[a-b]/, '');
			return (local < server);
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
			},
			check: function () {
				var request;
				_setStatus(CHECKING);
				request = new Ajax.Request(_url, _options);
			}
		};
	})();
};
