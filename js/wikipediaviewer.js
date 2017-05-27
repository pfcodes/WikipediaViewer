
var WikipediaViewer, DataParser, DOMUpdater, s;

WikipediaViewer = {
	properties: {
		api: { 
		url:'https://en.wikipedia.org/w/api.php?',
		list: 'search',
		action: 'query', 
		format: 'json',
		srwhat: 'text',
		srsearch: ''
		},
		searchQuery: '',
		searchBox: $('#input_SearchBox'),
		searchButton: $('#input_SearchButton')
	},

	init: function() {
		s = this.properties;
		this.refreshQueryParameters();
		this.bindEvents();
	},

	refreshQueryParameters: function() {
		s.searchQuery = s.api.url;
		// dynamic update of search query url
		for (i = 1; i < Object.keys(s.api).length; i++) {
			s.searchQuery += (Object.keys(s.api)[i] + '=' + s.api[Object.keys(s.api)[i]]);
			if (i != Object.keys(s.api).length-1) s.searchQuery += '&';
		}	
	},

	bindEvents: function() {
		// search button
		s.searchButton.on('click', this.performQuery);
			
		// search box key down events
		s.searchBox.on('keydown', function(k) {
			switch (k.keyCode) {
				// ENTER key
				case 13: WikipediaViewer.performQuery(); break;
			}
		});
	},

	performQuery: function() {
		WikipediaViewer.refreshQueryParameters();
		s.searchQuery += s.searchBox.val().replace(' ', '+');
		$.getJSON(s.searchQuery, DataParser.interpret);
		console.log(s.searchQuery);
	}
};

DataParser = {
	interpret: function(data) {
		var item;
		item = data.query.search;
		$('#searchResults').empty();
		for (i = 0; i < item.length; i ++) {
			current = item[i];
			DOMUpdater.addElement('<b>' + current.title + '</b>');
			DOMUpdater.addElement(current.snippet);
		}
	}
};

DOMUpdater = {
	addElement: function(data) {
		$('<p>' + data + '</p>').appendTo('#searchResults');
	},
};


$(function() {
	WikipediaViewer.init();
});
