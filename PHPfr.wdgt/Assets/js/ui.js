/**
 * UI-related functions
 */
with ({
		CLOSEDWIDTH  :  237,
		INTERVAL     :  13,
		OPACITY      : 'opacity',
		WIDTH        : 'width',
		ODD          : 'odd',
		EVEN         : 'even',
		VIEW         : 'view',
		FUNC         : 'func',
		NONE         : 'none',
		BLOCK        : 'block',
		DISPLAY      : 'display',
		WHITE        : 'white',
		TRANSPARENT  : 'transparent',
		TOBACK       : 'ToBack',
		TOFRONT      : 'ToFront',
		SIZEPRESETS  : '--Select a Size--',
		SIZEPREF     : 'sizePref',
		FONTSIZEPREF : 'fontSizePref',
		SMALLFONT    : '11px',
		BIGFONT      : '13px',
		SMALLFONTSRC : 'url(Assets/imgs/button-fontsmall.png)',
		BIGFONTSRC   : 'url(Assets/imgs/button-fontbig.png)'
	}) {
	PHPFR.ui = (function () {
		var _templates, _strings, _elements, _buttons, _scrolls, _styles, _resizeValues, _resizeListValues, _resizeStart;
		_templates = {
			defaultList : new Template('<div onclick="PHPFR.ui.showBack();" class="default #{cls}">#{str}</div>'),
			presetsList : new Template('#{width}x#{height}')
		};
		_strings  = [
			// en
			'No languages are currently installed. Please flip the widget over and click on the language of your choice.',
			// es
			'No está instalado ningún idiomas actualmente. Por favor mueva de un tirón el widget y selecione el idioma de su opción.',
			// fr
			'Aucune langue n’est actuellement installée. Veuillez renverser le widget et cliquer sur la langue de votre choix.',
			// de
			'Keine Sprachen werden z.Z. angebracht. Schlagen Sie bitte das widget rüber leicht und klicken Sie an die Sprache Ihrer Wahl.',
			// ja
			'言語は現在インストールされていない。仕掛を弾き、選択の言語をつけなさい。',
			// ru
			'Никакие языки в настоящее время не установлены. Пожалуйста flip widget сверх и 5elknite дальше языком вашего выбора.',
			// nl
			'Geen talen zijn momenteel geïnstalleerd. Gelieve te knippen over widget weg en te klik op de taal van uw keus.',
			// cn (simplified)
			'语言当前不被安装。请翻转小部件和点击您的选择语言。',
			// pt_BR
			'Nenhuma língua é instalada atualmente. Lance por favor o widget sobre e estale sobre a língua de sua escolha.',
			// it
			'Nessun linguaggio attualmente è installato. Lanci prego il widget sopra e scatti sopra il linguaggio della vostra scelta.',
			// el
			'Καμία γλώσσα δεν εγκαθίσταται αυτήν την περίοδο. Παρακαλώ κτυπήστε το widget και χτυπήστε στη γλώσσα της επιλογής σας.'
		];
		_elements = {
			front : undefined,
			back  : undefined,
			funcList: {
				list      : undefined,
				scrollBar : undefined,
				container : undefined
			},
			viewFrame: {
				scrollBar : undefined,
				container : undefined
			},
			presets       : undefined,
			presetsLabel  : undefined,
			history: {
				back      : undefined,
				forward   : undefined
			},
			favorites     : undefined,
			widgetTitle   : undefined,
			fontToggle    : undefined,
			resizer       : undefined,
			toToggle      : undefined
		};
		_buttons = {
			info    : undefined,
			done    : undefined,
			donate  : undefined,
			ok      : undefined,
			cancel  : undefined,
			cancelDownload : undefined,
			okError : undefined
		};
		_scrolls = {
			func : {
				area : undefined,
				bar  : undefined
			},
			view : {
				area : undefined,
				bar  : undefined
			}
		};
		_styles = {
			showing      : {backgroundColor: WHITE, borderColor: WHITE},
			hidden       : {backgroundColor: TRANSPARENT, borderColor: TRANSPARENT},
			smallFont    : {fontSize: SMALLFONT},
			bigFont      : {fontSize: BIGFONT},
			smallFontSrc : {backgroundImage: SMALLFONTSRC},
			bigFontSrc   : {backgroundImage: BIGFONTSRC}
		};
		_resizeValues = [600,400];
		_resizeListValues = {
			'450x290'  : [450,290],
			'600x400'  : [600,400],
			'900x600'  : [900,600],
			'1200x900' : [1200,900]
		};
		var _localizeControlTitles, _fadeInContent, _setSize, _apple;
		_localizeControlTitles = function () {
			$$('img.control').each(function (control) {
				control.title = __(control.title);
			});
		};
		_fadeInContent = function () {
			var animation;
			if (_elements.viewFrame.container.getStyle('opacity') < 1.0) {
				animation = new Animator({
					duration: CLOSEDWIDTH, 
					interval: INTERVAL
				}).addSubject(new NumericalStyleSubject(
					_elements.viewFrame.container,
					OPACITY,
					0.0,
					1.0
				));
				animation.seekTo(1);
			}
		};
		// set a new window size
		_setSize = function (dims) {
			var label;
			_resizeValues = dims;
			window.resizeTo(dims[0], dims[1]);
			_elements.front.setStyle({width: dims[0] + 'px', height: dims[1] + 'px'});
			label = _templates.presetsList.evaluate({width: dims[0], height: dims[1]});
			$R(0, _elements.presets.options.length, true).each(function (n) {
				if (label === _elements.presets.options[n].text) {
					_elements.presets.selectedIndex = n;
					_setLabel(label);
				}
			});
			_setSizePref();
			PHPFR.ui.scrollBars.renew();
		};
		// update the size presets select list label
		_setLabel = function (label) {
			if (SIZEPRESETS === label) _elements.presets.selectedIndex = 0;
			_elements.presetsLabel.update(label);
		};
		_generateResizeSelect = function () {
			// _elements.presets
			var optTag, newOpt;
			optTag = document.createElement('OPTION');
			newOpt = function (val, txt) {
				var opt;
				opt = optTag.cloneNode(false);
				opt.text  = txt;
				opt.value = '[' + val + ']';
				return opt;
			};
			_elements.presets.appendChild(newOpt('false', SIZEPRESETS));
			$H(_resizeListValues).each(function (option) {
				var opt;
				opt = newOpt(option.value, option.key);
				_elements.presets.appendChild(opt);
			});
		};
		_setSizePref = function () {
			var key, val;
			key = SIZEPREF;
			val = '[' + _resizeValues.toString() + ']';
			PHPFR.prefs.set(key, val);
		};
		_getSizePref = function () {
			return eval(PHPFR.prefs.get(SIZEPREF));
		};
		_setFontSizePref = function (fontSize) {
			var key, val;
			key = FONTSIZEPREF;
			val = fontSize;
			PHPFR.prefs.set(key, val);
		};
		_getFontSizePref = function () {
			return PHPFR.prefs.get(FONTSIZEPREF);
		};
		// set-up Apple classes
		_apple = function () {
			_buttons.info   = new AppleInfoButton($('flipper'), $('front'), WHITE, WHITE, PHPFR.ui.showBack);
			_buttons.done   = new AppleGlassButton($('done-button'), __('Done'), PHPFR.ui.showFront);
			_buttons.donate = new AppleGlassButton($('donate-button'), __('Donate'), PHPFR.util.gotoPayPal);
			_buttons.ok     = new AppleGlassButton($('ok-button'), __('OK'), PHPFR.languages.confirmDownload);
			_buttons.cancel = new AppleGlassButton($('cancel-button'), __('Cancel'), PHPFR.languages.cancelDownload);
			_buttons.cancelDownload = new AppleGlassButton($('cancel-download-button'), __('Cancel'), PHPFR.languages.cancelDownload);
			_buttons.okError   = new AppleGlassButton($('ok-error-button'), __('OK'), PHPFR.languages.cancelDownload);
			_scrolls.func.bar  = new AppleVerticalScrollbar(_elements.funcList.scrollBar);
			_scrolls.view.bar  = new AppleVerticalScrollbar(_elements.viewFrame.scrollBar);
			_scrolls.func.area = new AppleScrollArea(_elements.funcList.container);
			_scrolls.view.area = new AppleScrollArea(_elements.viewFrame.container);
			_scrolls.func.area.addScrollbar(_scrolls.func.bar);
			_scrolls.view.area.addScrollbar(_scrolls.view.bar);
		};
		return {
			init: function () {
				var sizePref, fontSizePref;
				_elements.front               = $('front');
				_elements.back                = $('back');
				_elements.funcList.list       = $('function-list');
				_elements.funcList.scrollBar  = $('function-list-scroll-bar');
				_elements.funcList.container  = $('function-list-container');
				_elements.viewFrame.scrollBar = $('viewport-scroll-bar');
				_elements.viewFrame.container = $('viewport-container');
				_elements.presets             = $('presets');
				_elements.presetsLabel        = $('presets-label');
				_elements.history.back        = $('history-back');
				_elements.history.forward     = $('history-forward');
				_elements.favorites           = $('favorites-control');
				_elements.widgetTitle         = $('phpfr-title');
				_elements.fontToggle          = $('fontsize-control');
				_elements.resizer             = $('resizer');
				_elements.toToggle            = $A([
					_elements.viewFrame.scrollBar,
					_elements.presets,
					_elements.presetsLabel,
					_elements.history.back,
					_elements.history.forward,
					_elements.favorites,
					_elements.widgetTitle,
					_elements.fontToggle,
					_elements.resizer
				]);
				// initialize strings
				$$('.loading-label').each(function (element) {
					element.update(__('Loading'));
				});
				$('instructions').update(__('Click the language name to install/update. Click the radio button to select your language.'));
				$('tip-label').update(__('Tip:'));
				$('filter').setAttribute('placeholder', __($('filter').getAttribute('placeholder')));
				// generate the size presets select list
				_generateResizeSelect();
				// set display size to user's pref
				sizePref = _getSizePref();
				if (sizePref) this.setSize(sizePref);
				// set font size to user's pref
				fontSizePref = _getFontSizePref();
				if (fontSizePref) this.toggleFontSize(fontSizePref);
				_apple();
				_localizeControlTitles();
			},
			on: {
				// Used for starting a mouse drag resize action
				mousedown: function (evt) {
					document.addEventListener('mousemove', PHPFR.ui.on.mousemove, true);
					document.addEventListener('mouseup', PHPFR.ui.on.mouseup, true);
					_resizeStart = {
						x : (_elements.front.getWidth() - evt.x),
						y : (_elements.front.getHeight() - evt.y)
					};
					evt.stopPropagation();
					evt.preventDefault();
				},
				// Used for resizing the widget
				mousemove: function (evt) {
					var x, y;
					x = evt.x + _resizeStart.x;
					y = evt.y + _resizeStart.y;
					if (x < 450) {
						x = 450;
					} else if (x > 1200) {
						x = 1200;
					}
					if (y < 290) {
						y = 290;
					} else if (y > 900) {
						y = 900;
					}
					_setLabel(SIZEPRESETS);
					_setSize([x, y]);
					evt.stopPropagation();
					evt.preventDefault();
					PHPFR.ui.scrollBars.renew();
				},
				// Remove event listeners when user releases mouse
				mouseup: function (evt) {
					document.removeEventListener('mousemove', PHPFR.ui.on.mousemove, true);
					document.removeEventListener('mouseup', PHPFR.ui.on.mouseup, true);
					evt.stopPropagation();
					evt.preventDefault();
					PHPFR.ui.scrollBars.renew();
				}
			},
			/**
			 * Set the size of the widget from the presets select list
			 * @param array dims Array of ints [width, height] (convert string to array)
			 */
			setSize: function (dims) {
				var label;
				if ('string' === typeof dims) dims = eval(dims);
				label = (0 === $('presets').selectedIndex)? SIZEPRESETS : _templates.presetsList.evaluate({width: dims[0], height: dims[1]});
				_setLabel(label);
				_setSize(dims);
			},
			// Toggle between small and big font sizes
			toggleFontSize: function (fontSize) {
				if ('undefined' === typeof fontSize) {
					fontSize = (_elements.viewFrame.container.getStyle('font-size') === SMALLFONT)? BIGFONT : SMALLFONT;
				}
				if (fontSize === BIGFONT) {
					_elements.viewFrame.container.setStyle(_styles.bigFont);
					_elements.fontToggle.setStyle(_styles.bigFontSrc);
				} else {
					_elements.viewFrame.container.setStyle(_styles.smallFont);
					_elements.fontToggle.setStyle(_styles.smallFontSrc);
				}
				PHPFR.ui.scrollBars.refresh(VIEW);
				_setFontSizePref(fontSize);
			},
			// Show instructions in several languages if the user has no manual docs installed
			showDefaultList: function () {
				var html, i, cls;
				html = '';
				i    = 0;
				$A(_strings).each(function (str) {
					++i;
					cls = (0 === i % 2)? EVEN : ODD;
					html += _templates.defaultList.evaluate({cls: cls, str: str});
				});
				_elements.funcList.list.update(html);
			},
			// Flip widget to the back
			showBack: function () {
				PHPFR.ui.viewFrame.close();
				setTimeout(function () {
					window.resizeTo(237, (_resizeValues[1] > 400)? _resizeValues[1] : 400);
					PHPFR.tips.random();
					WW.prepareForTransition(TOBACK);
					_elements.front.setStyle({display: NONE});
					_elements.back.setStyle({display: BLOCK});
					setTimeout(function () {
						WW.performTransition();
					}, 0);
				}, CLOSEDWIDTH);
			},
			// Flip widget to the front
			showFront: function () {
				WW.prepareForTransition(TOFRONT);
				_elements.front.setStyle({display: BLOCK});
				_elements.back.setStyle({display: NONE});
				setTimeout(function () {
					WW.performTransition();
					window.resizeTo(_resizeValues[0], _resizeValues[1]);
				}, 0);
			},
			// Display a tab on a static HTML page
			showTab: function (id) {
				$$('div.phpfr-section').each(function (section) {
					section.hide();
				});
				$(id).show();
			},
			scrollBars: {
				// Convenience method to refresh all scrollbars
				renew: function () {
					this.refresh(FUNC);
					this.refresh(VIEW);
				},
				/**
				 * Refresh a scrollbar
				 * @param string id ID of the scrollbar element to refresh (func or view)
				 */
				refresh: function (id) {
					if ('undefined' !== typeof _scrolls[id].area) {
						_scrolls[id].area.refresh();
						if (FUNC === id) {
							if (BLOCK === _elements.funcList.scrollBar.firstChild.getStyle(DISPLAY)) {
								_elements.funcList.scrollBar.setStyle(_styles.showing);
							} else {
								_elements.funcList.scrollBar.setStyle(_styles.hidden);
							}
						} else if (VIEW === id) {
							if (BLOCK === _elements.viewFrame.scrollBar.firstChild.getStyle(DISPLAY)) {
								_elements.viewFrame.scrollBar.setStyle(_styles.showing);
							} else {
								_elements.viewFrame.scrollBar.setStyle(_styles.hidden);
							}
						}
					}
				},
				/**
				 * Scroll to the top of an element
				 * @param string id ID of the element to scroll to the top (func or view)
				 */
				scrollToTop: function (id) {
					_scrolls[id].area.verticalScrollTo(0);
				}
			},
			viewFrame: {
				// Open the view frame
				open: function () {
					var control, animation;
					if (CLOSEDWIDTH === _elements.front.getWidth()) {
						control         = $('control-drawer');
						control.src     = 'Assets/imgs/famfamfam/application_side_contract.png';
						control.title   = __('Close Page Drawer');
						control.onclick = function () {}; // prevent double-clicks
						// animate opening of drawer
						animation = new Animator({
							duration   : CLOSEDWIDTH,
							interval   : INTERVAL,
							onComplete : function () {
								// fade-in content
								_fadeInContent();
								// show elements after the animation is done
								_elements.toToggle.each(function (element) {
									element.show();
								});
								control.onclick = function () {
									PHPFR.ui.viewFrame.close();
								};
							}
						}).addSubject(new NumericalStyleSubject(
							_elements.front,
							WIDTH,
							CLOSEDWIDTH,
							_resizeValues[0]
						));
						animation.seekTo(1);
					}
				},
				// Close the view frame
				close: function () {
					var control;
					if (_elements.front.getWidth() > CLOSEDWIDTH) {
						control         = $('control-drawer');
						control.src     = 'Assets/imgs/famfamfam/application_side_expand.png';
						control.title   = __('Open Page Drawer');
						control.onclick = function () {}; // prevent double-clicks
						// fade-out content
						// hide elements
						_elements.toToggle.each(function (element) {
							element.hide();
						});
						// animate closing of drawer
						animation = new Animator({
							duration   : CLOSEDWIDTH,
							interval   : INTERVAL,
							onComplete : function () {
								control.onclick = function () {
									PHPFR.ui.viewFrame.open();
								};
							}
						}).addSubject(new NumericalStyleSubject(
							_elements.front,
							WIDTH,
							_resizeValues[0],
							CLOSEDWIDTH
						));
						animation.seekTo(1);
					}
				}
			},
			/**
			 * Follow an internal link (use PHPFR.util.gotoURL for external URLs)
			 * @param string page Name of the page to access within the php_manual or html directory
			 */
			followLink: function (page) {
				if (PHPFR.regexs.http.test(page)) {
					PHPFR.util.gotoURL(page);
				} else {
					PHPFR.pages.display(page);
				}
			}
		}
	})();
};
