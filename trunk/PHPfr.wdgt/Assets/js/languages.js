/**
 * Language-related functions
 */

// TODO: automate the installation of new langauges: http://nz.php.net/get/php_manual_cs.tar.gz/from/www.php.net/mirror

with ({
		DEFAULT : 'en',
		PREFKEY : 'lang'
	}) {
	PHPFR.languages = (function () {
		// private variables
		var _templates, _installed;
		_templates = {
			downloads: new Template('http://www.php.net/get/php_manual_#{lang}.tar.gz/from/a/mirror')
		};
		// private methods
		var _updateList, _selectRadio, _setInstalled;
		// update list of languages on back of widget to make those that are installed selectable
		_updateList = function () {
			var setState;
			setState = function (lang) {
				if (_installed.indexOf(lang.value) > -1) {
					lang.enable();
				} else {
					lang.disable();
				}
			};
			$A(document.installForm.lang).invoke('setState');
		};
		// select the radio button corresponding to the language
		_selectRadio = function (lang) {
			var setSelected;
			setSelected = function (lang) {
				if (lang.indexOf(lang.value) > -1) {
					lang.checked = true;
					throw $break;
				}
			};
			$A(document.installForm.lang).invoke('setSelected');
		};
		_setInstalled = function (obj) {
			_installed = $A(eval(obj.outputString)); // yes, eval is evil
			_updateList();
			if (0 === _installed.length) {
				PHPFR.ui.showDefaultList();
			}
		};
		return {
			// public variables
			lang: undefined,
			// public methods
			init: function () {
				this.getInstalled();
				this.lang = this.getPref() || this.setDefault();
			},
			getInstalled: function () {
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
			},
			download: function (lang) {
				var url;
				url = _templates.download.evaluate({lang: lang});
				
				DEBUG.writeDebug('url = ' + url);
			}
		};
	})();
};
