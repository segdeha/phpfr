/**
 * Language-related functions
 */

with ({
		DEFAULT       : 'en',
		PREFKEY       : 'lang',
		NOTFIRSTRUN   : 'notFirstRun'
	}) {
	PHPFR.languages = (function () {
		// private variables
		var _elements, _templates, _installed, _installCommand, _widgSysCall;
		_elements = {
			warning     : undefined,
			inprogress  : undefined,
			error       : undefined,
			elapsedTime : undefined
		};
		_templates = {
			elapsedTime: new Template(__('Elapsed time:') + ' #{time} ' + __('seconds'))
		};
		// private methods
		var _getNotFirstRunPref, _setNotFirstRunPref, _updateList, _selectRadio, _setInstalled;
		_getNotFirstRunPref = function () {
			return PHPFR.prefs.get(NOTFIRSTRUN);
		};
		_setNotFirstRunPref = function () {
			PHPFR.prefs.set(NOTFIRSTRUN, 1);
		};
		_doFirstRun = function () {
			var cmd;
			cmd = PHPFR.phpPath + " '" + PHPFR.basePath + "/php_manual/first_run.php'";
			$('first-run-label').update(__('Uncompressing PHP manual. Please be patient. This may take a while&#8230;'));
			WW.system(cmd, _doneFirstRun);
		};
		_doneFirstRun = function (obj) {
			_setNotFirstRunPref();
			PHPFR.languages.getInstalled();
		};
		// update list of languages on back of widget to make those that are installed selectable
		_updateList = function () {
			$A($('install-form').lang).each(function (lang) {
				if (_installed.indexOf(lang.value) > -1) {
					$(lang).enable();
				} else {
					$(lang).disable();
				}
			});
		};
		// select the radio button corresponding to the language
		_selectRadio = function (lang) {
			$('lang-' + lang).checked = true;
		};
		_setInstalled = function (obj) {
			_installed = $A(eval(obj.outputString)); // yes, eval is evil
			_updateList();
			if (0 === _installed.length) {
				PHPFR.ui.showDefaultList();
			} else {
				PHPFR.languages.lang = PHPFR.languages.getPref();
				if (false === PHPFR.languages.lang || _installed.indexOf(PHPFR.languages.lang) < 0) {
					PHPFR.languages.lang = PHPFR.languages.setDefault();
				}
			}
			_selectRadio(PHPFR.languages.lang);
			PHPFR.topics.init();
		};
		_handleInstall = function (obj) {
			_elements.inprogress.hide();
			if (obj.outputString.indexOf('SUCCESS') > -1) {
				PHPFR.languages.getInstalled();
			} else {
				_elements.error.show();
			}
		};
		return {
			// public variables
			lang: undefined,
			// public methods
			init: function () {
				_elements.warning     = $('install-warning');
				_elements.inprogress  = $('install-progress');
				_elements.error       = $('install-error');
				_elements.elapsedTime = $('elapsed-time');
				if (false === _getNotFirstRunPref()) {
					_doFirstRun();
				} else {
					this.getInstalled();
				}
			},
			download: function (lang) {
				_installCommand = PHPFR.phpPath + ' php_manual/install.php ' + lang;
				// show user confirm screen
				_elements.warning.show();
			},
			confirmDownload: function () {
				var startTime, currentTime, elapsedTime;
				// show user that the operation is in progress
				_elements.warning.hide();
				_elements.inprogress.show();
				_widgSysCall = WW.system(_installCommand, _handleInstall);
				startTime = (new Date()).getTime();
				setInterval(function () {
					currentTime = (new Date()).getTime();
					elapsedTime = Math.floor((currentTime - startTime) / 1000);
					_elements.elapsedTime.update(
						_templates.elapsedTime.evaluate({time: elapsedTime})
					);
				}, 1000);
			},
			cancelDownload: function () {
				if ('undefined' !== typeof _widgSysCall) {
					_widgSysCall.cancel();
					_widgSysCall.close();
				}
				_elements.warning.hide();
				_elements.inprogress.hide();
				_elements.error.hide();
			},
			getInstalled: function () {
				var cmd;
				cmd = PHPFR.phpPath + ' Assets/php/installed.php';
				WW.system(cmd, _setInstalled);
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
