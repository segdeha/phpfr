// Manage GUI

var gui = {
	functions: {
		timer: undefined,
		delay: 200,
		hilited: '',
		toggle: function () {
			if (stretcher.isStretched()) {
				$('viewportScrollBar').style.display = 'block';
				this.opacity.timer = setInterval('gui.opacity.increase()', 10);
			} else {
				$('viewportScrollBar').style.display = 'none';
				$('viewportContainer').style.opacity = 0;
			}
		},
		write: function (obj) {
			$('viewport').innerHTML = obj.outputString.replace(regexps.link, replaces.link);
		},
		takeInput: function (pattern) {
			clearTimeout(gui.functions.timer);
			gui.functions.timer = setTimeout("functions.filter('"+pattern+"')", gui.functions.delay);
		},
		hilite: function (func) {
			// unhilite last hilited function
			this.frames.functions.unhilite();
			// hilite current function
			if (func !== '' && $(func)) {
				$(func).className += ' selected';
				this.frames.functions.hilited = func; // store last hilited func
			}
		},
		unhilite: function () {
			// unhilite last hilited func
			if (this.frames.functions.hilited !== '') {
				if ($(this.frames.functions.hilited)) {
					$(this.frames.functions.hilited).className = $(this.frames.functions.hilited).className.replace('selected', '');
				}
			}
		}
	},
	opacity: {
		timer: undefined,
		increase: function () {
			if ($('viewportContainer').style.opacity > 0.9) {
				clearInterval(gui.opacity.timer);
				viewportScrollArea.refresh();
			} else {
				$('viewportContainer').style.opacity = 1 * $('viewportContainer').style.opacity + 0.1;
			}
		}
	},
	html: {
		fetch: function (path) {
			if (lang == 'tw' || lang == 'hk') {
				w.widget.system("/usr/bin/php Assets/php/return_html.php '" + path + "' | iconv -f BIG5 -t UTF-8", html.show);
			} else if (lang == 'ro') {
				w.widget.system("/usr/bin/php Assets/php/return_html.php '" + path + "' | iconv -f ISO-8859-2 -t UTF-8", html.show);
			} else {
				w.widget.system("/usr/bin/php Assets/php/return_html.php '" + path + "'", html.show);
			}
		},
		show: function (obj) {
			var html = '<div id="controls_space"><\/div>' + favoriteLink + arrowsHTML + obj.outputString.replace(regexps.link, replaces.link);
			$('viewport').innerHTML = html;
			page.scroll();
		}
	},
	page: {
		// e.g., file:/Users/andrew/Library/Widgets/PHPfr.wdgt/PHPfr.html becomes /Users/andrew/Library/Widgets/PHPfr.wdgt/
		basePath: d.location.href.substring(5, d.location.href.length - 10),
		get: function (page) { // was showPage
			hiliteFunction('');
			w.widget.system("/usr/bin/php Assets/php/return_html.php '" + this.basePath + page + ".html'", gui.page.format);
		},
		format: function (obj) {
			var html = obj.outputString;
			this.display(html);
		},
		display: function (html) {
			if (!stretcher.stretched()) stretcher.toggle();
			$('viewport').innerHTML = html.replace(regexps.link, replaces.link);
			html.scroll();
		},
		scroll: function () {
			viewportScrollArea.verticalScrollTo(0);
			viewportScrollArea.refresh();
		}
	},
	show: {
		func: function (func) {
			if (lang.length > 1) {
				if (!stretcher.isStretched()) stretcher.toggle();
				hiliteFunction(func);
				getFavorites();
				var inFavs = (favorites.in_array(func))? 'remove': 'add';
				favoriteLink = templates.favorites[inFavs].evaluate({func: func});
				var backLoaded = (history.idx > 0)? 'loaded': 'not_loaded';
				var forwardLoaded = (history.idx < history.items.length-1)? 'loaded': 'not_loaded';
				arrowsHTML = templates.back[backLoaded] + templates.forward[forwardLoaded];
				var fullPath = basePath + 'php_manual/' + getPref('lang') + '/function.' + func.replace(regexps.func, replaces.func) + '.html';
				fetchHTML(fullPath);
				addHistoryItem(func);
			}
		},
		defaultList: function () {
			$('functionList').innerHTML = defaultList;
		},
		section: function (sect) {
			// show the proper tab
			var tabs_container = $('tabs_nav');
			var tabs = tabs_container.getElementsByTagName('div');
			for (var t = tabs.length-1; t > -1; t--) {
				tabs[t].className = '';
			}
			var tab = $(sect+'_tab');
			tab.className = 'selected';
			
			// show the proper section
			var codes_container = $('codes_container');
			var codes = codes_container.getElementsByTagName('div');
			for (var c = codes.length-1; c > -1; c--) {
				codes[c].style.display = 'none';
			}
			var code = $(sect+'_codes');
			code.style.display = 'block';
			
			// adjust the scrollbar
			viewportScrollArea.refresh();
		},
		faq: function () {
			hideBack();
			showPage('html/help');
			showSection('faq');
			viewportScrollArea.reveal($('how_do_i_install'));
		},
		back: function () {
			if (stretcher.stretched) {
				stretcher.toggle('gui.show.back()');
			} else {
				// fix persistent fliprollie bug
				exitflip();
				w.widget.prepareForTransition('ToBack');
				$('front').setStyle({display: 'none'});
				$('back').setStyle({display: 'block'});
				setTimeout('w.widget.performTransition()', 0); 
				// display random tip
				tips.change();
			}
		},
		front: function () {
			version.status.update('linktext');
			// change the selected language
			getPref();
			w.widget.prepareForTransition('ToFront');
			$('front').setStyle({display: 'block'});
			$('back').setStyle({display: 'none'});
			setTimeout('widget.performTransition()', 0);
		}
	}
}

function followLink(href) {
	// if this is a function page, convert the href to a func and go there
	if (href.indexOf('function.') > 0) {
		var func = href.substring(href.indexOf('function.') + 9, href.length-5);
		func = func.replace(/-/g, '_');
		gui.show.func(func);
	} else { // go straight to the page
		var hrefPieces = href.split('/');
		href = hrefPieces[hrefPieces.length-1];
		if (href.indexOf('#') > 0) href = href.substring(0, href.indexOf('#'));
		favorites.get();
		var inFavs = (favorites.in_array(func))? 'remove': 'add';
		favoriteLink = templates.favorites[inFavs].evaluate({func: func});
		var backLoaded = (history.idx > 0)? 'loaded': 'not_loaded';
		var forwardLoaded = (history.idx < history.items.length-1)? 'loaded': 'not_loaded';
		arrowsHTML = templates.back[backLoaded] + templates.forward[forwardLoaded];
		var fullPath = basePath+'php_manual/'+getPref('lang')+'/'+href.replace(regexps.func, replaces.func);
		fetchHTML(fullPath);
		history.item.add(href);
	}
}

function downloadManual(lang) {
	w.widget.openURL('http://www.php.net/get/php_manual_'+lang+'.tar.gz/from/a/mirror');
}

function gotoOnlineDoc(func) {
	var url = templates.links.onlineDocs.evaluate({lang: languages.get.selected(), func: func.replace(regexps.func, replaces.func)});
	w.widget.openURL(url);
}
