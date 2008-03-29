/**
 * Language-related functions
 */

// TODO: automate the installation of new langauges: http://nz.php.net/get/php_manual_cs.tar.gz/from/www.php.net/mirror

with ({
		DEFAULT       : 'en',
		PREFKEY       : 'lang',
		NOTFIRSTRUN   : 'notFirstRun'
	}) {
	PHPFR.languages = (function () {
		// private variables
		var _templates, _installed;
		_templates = {
			filename    : new Template('php_manual_#{lang}.tar.gz'),
			downloads   : new Template('http://www.php.net/get/#{fnm}/from/www.php.net/mirror'),
			destination : new Template('php_manual/#{fnm}'),
			install     : new Template('/usr/bin/php php_manual/install.php #{url} #{dst}')
		};
		// private methods
		var _getNotFirstRunPref, _setNotFirstRunPref, _updateList, _selectRadio, _setInstalled;
		_getNotFirstRunPref = function () {
			return PHPFR.prefs.get(NOTFIRSTRUN);
		};
		_setNotFirstRunPref = function () {
			
//			DEBUG.writeDebug('_setNotFirstRunPref');
//			DEBUG.writeDebug('PHPFR.prefs.set(NOTFIRSTRUN, 1) = ' + PHPFR.prefs.set(NOTFIRSTRUN, 1));
			
			PHPFR.prefs.set(NOTFIRSTRUN, 1);
			
//			DEBUG.writeDebug('PHPFR.prefs.set(NOTFIRSTRUN, 1) = ' + PHPFR.prefs.set(NOTFIRSTRUN, 1));
			
		};
		_doFirstRun = function () {
			var cmd;
			cmd = "/usr/bin/php '" + PHPFR.basePath + "/php_manual/first_run.php'";
			$('first-run-label').update(__('Uncompressing PHP manual. Please be patient. This may take a while&#8230;'));
			
			DEBUG.writeDebug('_doFirstRun');
			DEBUG.writeDebug(cmd);
			
			WW.system(cmd, _doneFirstRun);
		};
		_doneFirstRun = function (obj) {
			
			DEBUG.writeDebug('_doneFirstRun');
			DEBUG.writeDebug(obj.outputString);
			
			_setNotFirstRunPref();
			PHPFR.languages.getInstalled();
		};
		// update list of languages on back of widget to make those that are installed selectable
		_updateList = function () {
			
//			DEBUG.writeDebug('_updateList');
//			DEBUG.writeDebug($('install-form').lang);
			
			$A($('install-form').lang).each(function (lang) {
				if (_installed.indexOf(lang.value) > -1) {
					lang.enable();
				} else {
					lang.disable();
				}
			});
		};
		// select the radio button corresponding to the language
		_selectRadio = function (lang) {
			$('lang-' + lang).checked = true;
		};
		_setInstalled = function (obj) {
			
//			DEBUG.writeDebug('_setInstalled');
//			DEBUG.writeDebug('obj.outputString = ' + obj.outputString);
			
			_installed = $A(eval(obj.outputString)); // yes, eval is evil
			
//			DEBUG.writeDebug('_installed = ' + _installed);
			
			_updateList();
			
//			DEBUG.writeDebug('_installed.length = ' + _installed.length);
			
			if (0 === _installed.length) {
				PHPFR.ui.showDefaultList();
			} else {
				PHPFR.languages.lang = PHPFR.languages.getPref() || PHPFR.languages.setDefault();
			}
			_selectRadio(PHPFR.languages.lang);
			
//			DEBUG.writeDebug('_setInstalled 2');
			
			PHPFR.functions.init();
			PHPFR.topics.init();
		};
		_handleInstall = function (obj) {
			
			DEBUG.writeDebug('_handleInstall');
			DEBUG.writeDebug(obj.outputString);
			
			if (obj.outputString.indexOf('SUCCESS') > -1) {
				
			} else {
				
			}
		};
		return {
			// public variables
			lang: undefined,
			// public methods
			init: function () {
				
				DEBUG.writeDebug('_getNotFirstRunPref() = ' + _getNotFirstRunPref());
				
				if (false === _getNotFirstRunPref()) {
					_doFirstRun();
				} else {
					this.getInstalled();
				}
			},
			download: function (lang) {
				
				DEBUG.writeDebug('PHPFR.languages.install');
				DEBUG.writeDebug('lang = ' + lang);
				
				/*
				var fnm, url, dst, cmd;
				fnm = _templates.filename.evaluate({lang: lang});
				url = _templates.downloads.evaluate({fnm: fnm});
				dst = _templates.destination.evaluate({fnm: fnm});
				cmd = _templates.install.evaluate({url: url, dst: dst});
				*/
				
				var cmd;
				cmd = '/usr/bin/php php_manual/install.php ' + lang;
				
				DEBUG.writeDebug('cmd = ' + cmd);
			
				// show user that the operation is in progress
				
				WW.system(cmd, _handleInstall);
			},
			getInstalled: function () {
				
//				DEBUG.writeDebug('getInstalled');
				
				WW.system("/usr/bin/php 'Assets/php/installed.php'", _setInstalled);
			},
			getPref: function () {
				var lang;
				lang = PHPFR.prefs.get(PREFKEY);
				return (lang)? lang : DEFAULT;
			},
			getSelected: function () {
				var lang;
				lang = $F(document.installForm.lang);
				return lang;
			},
			setDefault: function () {
				var lang;
				lang = (_installed.length < 1)? DEFAULT : _installed[0];
				PHPFR.languages.setPref(lang);
				return lang;
			},
			setPref: function (lang) {
				this.lang = lang;
				_selectRadio(lang);
				PHPFR.prefs.set(PREFKEY, lang);
			}
		};
	})();
};
