/**
 * Templates for various bits of the interface
 */
PHPFR.templates = {
	links: {
		onlineDocs: new Template('http://www.php.net/manual/#{lang}/function.#{func}.php')
	},
	favorites : {
		add    : new Template('<img onclick="PHPFR.favorites.toggle(\'#{func}\');" id="favorites_control" src="images/favorites_add.png" title="' + __('Add this page to your favorites') + '" alt=""/>'), 
		remove : new Template('<img onclick="PHPFR.favorites.toggle(\'#{func}\');" id="favorites_control" src="images/favorites_remove.png" title="' + __('Remove this page from your favorites') + '" alt=""/>')
	},
	back: {
		loaded     : '<img onclick="PHPFR.history.back();" id="back_control" src="images/back_loaded.png" title="' + __('Show the previous page') + '" alt=""/>', 
		not_loaded : '<img id="back_control" src="images/back_not_loaded.png" title="' + __('Show the previous page') + '" alt=""/>'
	}, 
	forward: {
		loaded     : '<img onclick="PHPFR.history.forward();" id="forward_control" src="images/forward_loaded.png" title="' + __('Show the next page') + '" alt=""/>', 
		not_loaded : '<img id="forward_control" src="images/forward_not_loaded.png" alt=""/>'
	}
};
