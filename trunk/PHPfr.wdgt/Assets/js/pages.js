/**
 * Manage display frame
 */
with ({
		VIEW   : 'view',
		HEADER : '<div class="phpfr-header">&nbsp;</div>',
		FOOTER : '<div class="phpfr-footer">&nbsp;</div>'
	}) {
	PHPFR.pages = (function () {
		var _templates, _linkReplace, _elements;
		_templates = {
			php  : new Template('php_manual/#{lang}/#{page}'),
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
				PHPFR.ui.followLink('help.html#welcome');
			},
			/**
			 * Display a local HTML page, either from php_manual or html directories
			 * @param string page 
			 */
			display: function (page) {
				var displayPage, hash, path, html, favs;
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
					}
					PHPFR.ui.scrollBars.refresh(VIEW);
					PHPFR.ui.scrollBars.scrollToTop(VIEW);
					PHPFR.history.addItem(page);
					PHPFR.pages.nowShowing = page;
					PHPFR.functions.hilite();
					PHPFR.util.stripe();
				};
				hash = page.split('#')[1];
				page = page.split('#')[0].dashed();
				if (PHPFR.regexs.file.test(page)) {
					page = (page.split('/'))[(page.split('/')).length - 1];
					path = _templates.php.evaluate({lang: PHPFR.languages.lang, page: page});
				} else if ((page.split('.')).length > 2) { // e.g., ('function.strstr.html'.split('.')).length === 3
					path = _templates.php.evaluate({lang: PHPFR.languages.lang, page: page});
				} else { // e.g., ('dates.html'.split('.')).length === 2
					path = _templates.html.evaluate({page: page});
				}
				// fetch HTML
				if ('tw' === PHPFR.languages.lang || 'hk' === PHPFR.languages.lang) {
					WW.system("/usr/bin/php Assets/php/return_html.php '" + path + "' | iconv -f BIG5 -t UTF-8", displayPage);
				} else if ('ro' === PHPFR.languages.lang) {
					WW.system("/usr/bin/php Assets/php/return_html.php '" + path + "' | iconv -f ISO-8859-2 -t UTF-8", displayPage);
				} else {
					WW.system("/usr/bin/php Assets/php/return_html.php '" + path + "'", displayPage);
				}
			}
		};
	})();
};
