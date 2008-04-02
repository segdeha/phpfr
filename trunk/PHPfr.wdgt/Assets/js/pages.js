/**
 * Manage display frame
 */
with ({
		VIEW    : 'view',
		HEADER  : '<div class="phpfr-header">&nbsp;</div>',
		FOOTER  : '<div class="phpfr-footer">&nbsp;</div>',
		PHPINFO : 'phpinfo'
	}) {
	PHPFR.pages = (function () {
		var _templates, _linkReplace, _elements;
		_templates = {
			php  : new Template('php_manual/#{lang}/html/#{page}'),
			html : new Template('html/#{page}')
		};
		_linkReplace = '<a onclick="PHPFR.ui.followLink(this.href);return false;"';
		_elements = {
			viewport  : undefined,
			favorites : undefined
		};
		return {
			nowShowing: undefined,
			init: function () {
				_elements.viewport  = $('viewport-container');
				_elements.favorites = $('favorites-control');
				// set default page
				PHPFR.ui.followLink('phpfr-help.html#welcome');
			},
			/**
			 * Display a local HTML page, either from php_manual or html directories
			 * @param string page 
			 */
			display: function (page) {
				var displayPage, hash, path, html, spans, favs;
				displayPage = function (obj) {
					html  = HEADER;
					html += obj.outputString.replace(PHPFR.regexs.link, _linkReplace);
					html += FOOTER;
					
//					DEBUG.writeDebug(html);
					
					_elements.viewport.update(html);
					PHPFR.favorites.updateUI(page);
					PHPFR.ui.viewFrame.open();
					if ('undefined' !== typeof hash) {
						PHPFR.ui.showTab(hash);
					} else {
						// if there is nav on the page, show the first tab
						spans = $$('ul.phpfr-nav span');
						if (spans.length > 0) {
							spans[0].onclick();
						}
					}
					PHPFR.ui.scrollBars.refresh(VIEW);
					PHPFR.ui.scrollBars.scrollToTop(VIEW);
					PHPFR.history.addItem(page);
					PHPFR.pages.nowShowing = page;
					PHPFR.util.stripe();
					PHPFR.functions.hilite();
				};
				hash = page.split('#')[1];
				page = page.split('#')[0].dashed();
				if (PHPINFO === page) {
					WW.system(PHPFR.phpPath + ' Assets/php/phpinfo.php', displayPage);
				} else {
					if (PHPFR.regexs.html.test(page)) {
						path = _templates.html.evaluate({page: page});
					} else if (PHPFR.regexs.file.test(page)) {
						page = (page.split('/'))[(page.split('/')).length - 1];
						path = _templates.php.evaluate({lang: PHPFR.languages.lang, page: page});
					} else { // e.g., ('function.strstr.html'.split('.')).length === 3
						path = _templates.php.evaluate({lang: PHPFR.languages.lang, page: page});
					}
					// fetch HTML
					if ('tw' === PHPFR.languages.lang || 'hk' === PHPFR.languages.lang) {
						WW.system(PHPFR.phpPath + " Assets/php/return_html.php '" + path + "' | iconv -f BIG5 -t UTF-8", displayPage);
					} else if ('ro' === PHPFR.languages.lang) {
						WW.system(PHPFR.phpPath + " Assets/php/return_html.php '" + path + "' | iconv -f ISO-8859-2 -t UTF-8", displayPage);
					} else {
						WW.system(PHPFR.phpPath + " Assets/php/return_html.php '" + path + "'", displayPage);
					}
				}
			},
			showPHPInfo: function () {
				this.display(PHPINFO);
			}
		};
	})();
};
