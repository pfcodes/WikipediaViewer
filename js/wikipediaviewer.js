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
		// dynamically updates search query url
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
		$('.card-columns').fadeOut();
		s.searchQuery += s.searchBox.val().replace(' ', '+');
		$.getJSON(s.searchQuery, DataParser.interpret);
		console.log(s.searchQuery);
	},

	addResultCard: function(article) {
		var title, snippet, image, source;
		title = article.title;
		snippet = article.snippet;
		DOMUpdater.newCard(title, snippet);
	}
};

DataParser = {
	interpret: function(data) {
		var item = data.query.search;
		$('#searchResults').empty();
		for (i = 0; i < item.length; i ++) {
			WikipediaViewer.addResultCard(item[i]);
		}
		$('.card-columns').hide().fadeIn('slow').show();
	}
};

DOMUpdater = {
	// rename to add card to deck
	addElementToResultSection: function(title, snippet) {
		var html;
		html = '<div class="card">';
		html += '<div class="card-block">';
		html += '<h6 class="card-title">';
		html += title;
		html += '</h6>';
		html += '<p class="card-text">';
		html += snippet;
		html += '</p>';
		html += '</div>';
		html += '</div>';
		$(html).appendTo('#searchResults');
	},

	newCard: function(title, snippet) {
		// add list element
		this.addElementToResultSection(title, snippet);
		
		// add CSS to classes
	}
};

$(function() {
	WikipediaViewer.init();
});

