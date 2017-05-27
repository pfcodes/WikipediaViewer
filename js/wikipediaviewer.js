
var WikipediaViewer, DataParser, DOMUpdater, s;

WikipediaViewer = {
	properties: {
		api: {
			// add parameters ass needed
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
		for (i = 1; i < Object.keys(s.api).length; i++) {
			s.searchQuery += (Object.keys(s.api)[i] + '=' + s.api[Object.keys(s.api)[i]]);
			if (i != Object.keys(s.api).length-1) 
				s.searchQuery += '&';
		}	
	},

	bindEvents: function() {
		// when search button is clicked
		s.searchButton.on('click', function() {
			s.searchQuery += s.searchBox.val().replace(' ','+');
			$.getJSON(s.searchQuery, DataParser.interpret);
			console.log(s.searchQuery);
		});
	},
};

DataParser = {
	interpret: function(data) {
		var title, description, url;
		//title = data.query.normalized.to;
		//description = data[0];
		//DOMUpdater.addElement('<b>' + data.title + '</b>');
		//DOMUpdater.addElement(data.description);
	}
};

DOMUpdater = {
	addElement: function(data) {
		$('<p>' + data + '</p>').appendTo('.container-fluid');
	},
};


$(function() {
	WikipediaViewer.init();
});
