/**
 * Manage topics
 */
with ({
		FILE   : 'file',
		NAME   : 'name',
		HIDDEN : 'hidden'
	}) {
	PHPFR.topics = (function () {
		var _wait, _option, _widgSysCall, _topics, _filterField, _topicLabel, _topicsSelect;
		_wait   = 500;
		_option = document.createElement('OPTION');
		_topics = '';
		var _readTopics, _buildSelect, _addOption, _updateLabel, _fetchFunctions;
		_readTopics = function (obj) {
			if (obj.outputString.indexOf(']}') > -1) {
				clearTimeout(_timer);
				_widgSysCall.cancel();
				_widgSysCall.close();
				_buildSelect(eval(obj.outputString));
			}
		};
		_buildSelect = function (topics) {
			topics = topics || _topics;
			_topicsSelect.options.length = 0;
			_addOption('0', __('--Select a Topic--'));
			$A(topics).each(function (topic) {
				_addOption(topic[FILE], topic[NAME]);
			});
			_updateLabel();
		};
		_addOption = function (val, txt) {
			var option;
			option = _option.cloneNode(false);
			option.value = val;
			option.text  = txt;
			_topicsSelect.appendChild(option);
		};
		_updateLabel = function () {
			var label;
			if (_topicsSelect.options.length > 0) {
				label = _topicsSelect.options[_topicsSelect.selectedIndex].text.truncate(30);
				_topicLabel.update(label);
			}
		};
		_fetchFunctions = function (topic) {
			
//			DEBUG.writeDebug('topic = ' + topic);
			
			var callback, filename;
			callback = function (obj) {
				
//				DEBUG.writeDebug('obj.outputString = ' + obj.outputString);
				
				var funcs;
				funcs = eval(obj.outputString);
				PHPFR.functions.display(funcs);
			};
			filename = PHPFR.basePath + '/php_manual/' + PHPFR.languages.lang + '/ref.' + topic + '.html';
			WW.system("/usr/bin/php Assets/php/return_functions.php " + filename, callback);
		};
		return {
			init: function () {
				_filterField  = $('filter');
				_topicLabel   = $('topic-label');
				_topicsSelect = $('topics');
				// create the topics array file
				_widgSysCall = WW.system("/usr/bin/php 'Assets/php/topics.php'", _readTopics);
				// rinse and repeat every couple of seconds until successful
				_timer = setTimeout(function () {
					clearTimeout(_timer);
					_widgSysCall.cancel();
					_widgSysCall.close();
					PHPFR.topics.init();
					_wait = _wait * 2;
					if (_wait > 8000) _wait = 8000;
				}, _wait);
			},
			showTopic: function () {
				var topic;
				topic = $F(_topicsSelect);
				if (0 === +topic) {
					PHPFR.functions.filter('');
				} else {
					_fetchFunctions(topic);
				}
				_updateLabel();
				_filterField.value = '';
				_filterField.blur();
				PHPFR.favorites.displayState = HIDDEN;
			},
			reset: function () {
				_topicsSelect.selectedIndex = 0;
				_updateLabel();
			}
		};
	})();
};
