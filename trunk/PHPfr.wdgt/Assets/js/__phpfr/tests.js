// Unit tests

var tests = {
	playground: {
		controller: function () {
			var iters = 5000;
			var loops = 100;
			var sum = {plusequals: 0, join: 0};
			var avg = {plusequals: undefined, join: undefined}
			for (var i = 0; i < loops; ++i) {
				var results = tests.playground.concat(iters);
				sum.plusequals += results.plusequals;
				sum.join += results.join;
			}
			avg.plusequals = sum.plusequals / i;
			avg.join = sum.join / i;
			writeDebug("\n\nSummary (concat):\n    Average elpased (+=): " + avg.plusequals + "\n    Average elpased (join):   " + avg.join + "\n\n");
		},
		concat: function (iters) {
			var results = {plusequals: undefined, join: undefined};
			var timer = {start: undefined, end: undefined};
			timer.start = (new Date()).valueOf();
			var str = '';
			for (var i = 0; i < iters; ++i) {
				str += 'Rastafarian ';
			}
			timer.end = (new Date()).valueOf();
			results.plusequals = (timer.end - timer.start);
			timer.start = (new Date()).valueOf();
			var buf = [];
			for (var i = 0; i < iters; ++i) {
				buf[i] = 'Rastafarian ';
			}
			var str = buf.join('');
			timer.end = (new Date()).valueOf();
			results.join = (timer.end - timer.start);
			return results;
		},
	},
	// set timers to test functions that rely on asynchronous widget.system calls
	timers: $H({
		functionsArray: undefined,
		topicsArray: undefined,
		versionVersion: undefined
	}),
	// keep track of results
	results: {
		timer: undefined, // separate from other timers so we can easily evaluate if the others have finished
		ok: 0,
		not_ok: 0,
		summarize: function () {
			clearTimeout(tests.results.timer);
			// test if all timers have finished
			var all_finished = tests.timers.all(
				function (s) {
					return (s.value === undefined);
				}
			);
			if (all_finished) {
				var results = "\n\n\t" + 'Ran ' + (tests.results.ok + tests.results.not_ok) + ' tests.' + "\n";
				results += "\t\tok: " + tests.results.ok + "\n";
				results += "\t\tNOT OK: " + tests.results.not_ok + "\n";
				writeDebug(results);
			} else {
				tests.results.timer = setTimeout('tests.results.summarize();', 50);
			}
		}
	},
	library: function () {
		writeDebug('Tests of phpfr-library.js');
		(assert.isTrue("['one', 'two'].in_array('one')"))? ++tests.results.ok: ++tests.results.not_ok;
		(assert.isFalse("['one', 'two'].in_array('three')"))? ++tests.results.ok: ++tests.results.not_ok;
		(assert.areEqual([1, 2, 3].position(1), 0))? ++tests.results.ok: ++tests.results.not_ok;
		(assert.areEqual('abcdefghijklmnopqrstuvwxyz'.truncate(3).length, 10))? ++tests.results.ok: ++tests.results.not_ok;
		(assert.areEqual(' abc '.trim(), 'abc'))? ++tests.results.ok: ++tests.results.not_ok;
		(assert.isTrue("isNumeric(5)"))? ++tests.results.ok: ++tests.results.not_ok;
		(assert.isFalse("isNumeric('five')"))? ++tests.results.ok: ++tests.results.not_ok;
		(assert.areEqual('Date'.localize(), 'Date'))? ++tests.results.ok: ++tests.results.not_ok;
		(assert.isFalse(getPref('foo')))? ++tests.results.ok: ++tests.results.not_ok;
		writeDebug("setPref('value', 'key');");
		setPref('value', 'key');
		(assert.areEqual(getPref('key'), 'value'))? ++tests.results.ok: ++tests.results.not_ok;
	},
	dates: function () {
		writeDebug('Tests of phpfr-dates.js');
		(assert.areEqual(dates.characters, 'dDjlNSwzWFmMntLoYyaABgGhHiseIOTZcrU'))? ++tests.results.ok: ++tests.results.not_ok;
		(assert.areEqual(dates.formats.r, 'Wed, 01 Feb 2006 21:05:30 -0700'))? ++tests.results.ok: ++tests.results.not_ok;
		(assert.areEqual(dates.constants.DATE_ATOM, '2005-08-15T15:52:01+0000'))? ++tests.results.ok: ++tests.results.not_ok;
	},
	gui: function () {
		writeDebug('Tests of phpfr-gui.js');
		(assert.areSame(gui.frames.functions.timer, undefined))? ++tests.results.ok: ++tests.results.not_ok;
		(assert.areEqual(gui.frames.functions.delay, 200))? ++tests.results.ok: ++tests.results.not_ok;
		(assert.areEqual(gui.frames.functions.hilited, ''))? ++tests.results.ok: ++tests.results.not_ok;
		
		writeDebug(gui.page.basePath);
		
		(assert.isTrue("(new RegExp('/Library/Widgets/PHPfr.wdgt/$')).test(gui.page.basePath)"))? ++tests.results.ok: ++tests.results.not_ok;
	},
	behaviors: function () {
		writeDebug('Tests of phpfr-behaviors.js');
	},
	history: function () {
		writeDebug('Tests of phpfr-history.js');
		(assert.isArray(history.items))? ++tests.results.ok: ++tests.results.not_ok;
		(assert.areSame(history.items.length, 0))? ++tests.results.ok: ++tests.results.not_ok;
		(assert.areSame(history.idx, 0))? ++tests.results.ok: ++tests.results.not_ok;
		writeDebug("history.item.add('strpos');");
		history.item.add('strpos');
		(assert.areEqual(history.items.length, 1))? ++tests.results.ok: ++tests.results.not_ok;
		writeDebug('history.clear();');
		history.clear();
		(assert.areEqual(history.items.length, 0))? ++tests.results.ok: ++tests.results.not_ok;
		(assert.areEqual(history.idx, 0))? ++tests.results.ok: ++tests.results.not_ok;
	},
	favorites: function () {
		writeDebug('Tests of phpfr-favorites.js');
		(assert.areSame(favorites.showing, false))? ++tests.results.ok: ++tests.results.not_ok;
		(assert.areEqual(favorites.idx, 0))? ++tests.results.ok: ++tests.results.not_ok;
		(assert.isArray(favorites.list))? ++tests.results.ok: ++tests.results.not_ok;
		(assert.areEqual(favorites.list.length, 0))? ++tests.results.ok: ++tests.results.not_ok;
		writeDebug('favorites.save();');
		favorites.save();
		writeDebug('favorites.get();');
		favorites.get();
		(assert.isArray(favorites.list))? ++tests.results.ok: ++tests.results.not_ok;
		(assert.areSame(favorites.list.length, 0))? ++tests.results.ok: ++tests.results.not_ok;
//		writeDebug("favorites.toggle('abs');");
//		favorites.toggle('abs');
//		(assert.isArray(favorites.list))? ++tests.results.ok: ++tests.results.not_ok;
//		(assert.areSame(favorites.list.length, 1))? ++tests.results.ok: ++tests.results.not_ok;
//		favorites.toggle('abs');
//		(assert.isArray(favorites.list))? ++tests.results.ok: ++tests.results.not_ok;
//		(assert.areSame(favorites.list.length, 0))? ++tests.results.ok: ++tests.results.not_ok;
	},
	languages: function () {
		writeDebug('Tests of phpfr-languages.js');
		(assert.isArray(languages.installed))? ++tests.results.ok: ++tests.results.not_ok;
		(assert.areEqual(languages.installed.length, 0))? ++tests.results.ok: ++tests.results.not_ok;
		(assert.areEqual(languages.set.dfault(), 'en'))? ++tests.results.ok: ++tests.results.not_ok;
//		(assert.areEqual(languages.get.selected(), 'en'))? ++tests.results.ok: ++tests.results.not_ok;
	},
	templates: function () {
		writeDebug('Tests of phpfr-templates.js');
		(assert.hashContains(templates.forward, 'not_loaded', '<img id="forward_control" src="images/forward_not_loaded.png" alt=""/>'))? ++tests.results.ok: ++tests.results.not_ok;
		(assert.areEqual(templates.history.back.evaluate({status: 'active'}), 'images/back_active.png'))? ++tests.results.ok: ++tests.results.not_ok;
	},
	functionsArray: function () {
		writeDebug('Tests of phpfr-functions.js');
		clearTimeout(tests.timers.functionsArray);
		if (undefined !== functions.list) {
			tests.timers.functionsArray = undefined;
			(assert.isArray(functions.list))? ++tests.results.ok: ++tests.results.not_ok;
			(assert.arrayContains(functions.list, 'abs'))? ++tests.results.ok: ++tests.results.not_ok;
			(assert.arrayContains(functions.list, 'zlib-get-coding-type'))? ++tests.results.ok: ++tests.results.not_ok;
		} else {
			tests.timers.functionsArray = setTimeout('tests.functionsArray()', 50);
		}
	},
	topicsArray: function () {
		writeDebug('Tests of phpfr-topic-names.js');
		clearTimeout(tests.timers.topicsArray);
		if (undefined !== topics.list) {
			tests.timers.topicsArray = undefined;
			(assert.isArray(topics.list))? ++tests.results.ok: ++tests.results.not_ok;
			(assert.areEqual(topics.list[0]['file'], 'apache'))? ++tests.results.ok: ++tests.results.not_ok;
			(assert.areEqual(topics.list[topics.list.length - 1]['name'], 'Zlib Compression Functions'))? ++tests.results.ok: ++tests.results.not_ok;
		} else {
			tests.timers.topicsArray = setTimeout('tests.topicsArray()', 50);
		}
	},
	tips: function () {
		writeDebug('Tests of phpfr-tips.js');
		(assert.areEqual(tips[0], 'Double-click a function name to see it on PHP.net'))? ++tests.results.ok: ++tests.results.not_ok;
	},
	statusMessages: function () {
		writeDebug('Tests of phpfr-status-messages.js');
		(assert.areEqual(status.messages['ready'], 'Ready'))? ++tests.results.ok: ++tests.results.not_ok;
	},
	defaultDisplay: function () {
		writeDebug('Tests of phpfr-default-display.js');
		(assert.stringContains(defaultList, 'No languages are currently installed. Please flip the widget over and click on the language of your choice.'))? ++tests.results.ok: ++tests.results.not_ok;
	},
	versionChecker: function () {
		writeDebug('Tests of phpfr-version-checker.js');
		(assert.areEqual(version.name, 'phpfr'))? ++tests.results.ok: ++tests.results.not_ok;
		(assert.isUndefined(version.version))? ++tests.results.ok: ++tests.results.not_ok;
		(assert.isUndefined(version.timer))? ++tests.results.ok: ++tests.results.not_ok;
		(assert.areEqual(version.status.checking, 'Checking&#8230;'))? ++tests.results.ok: ++tests.results.not_ok;
		writeDebug('version.current();');
		version.current();
		var versionCompare = function () {
			writeDebug('versionCompare();');
			clearTimeout(tests.timers.versionVersion);
			if (undefined !== version.version) {
				(assert.areEqual(version.version, '1.0'))? ++tests.results.ok: ++tests.results.not_ok;
				(assert.areEqual(version.compare('1.0'), 'uptodate'))? ++tests.results.ok: ++tests.results.not_ok;
				(assert.areEqual(version.compare('1.1'), 'newversion'))? ++tests.results.ok: ++tests.results.not_ok;
			} else {
				tests.timers.versionVersion = setTimeout('versionCompare()', 100);
			}
		}
		versionCompare();
	}
}
