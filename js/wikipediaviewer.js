var WikipediaViewer, DataParser, DOMUpdater, s;

WikipediaViewer = {

	properties: {
		api: { 
		url:'https://en.wikipedia.org/w/api.php?',
		action: 'query', 
		format: 'json',
		prop: 'extracts',
		generator: 'search',
		exlimit: '10',
		exsentences: '5',
		exintro: '1',
		explaintext: '1',
		exsectionformat: 'plain',
		gsrsearch: ''
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
		DOMUpdater.updatePageLayout();
		DOMUpdater.addCardToDeck(article);
	}
};

DataParser = {
	interpret: function(data) {
		var item = Object.values(data.query.pages);
		DOMUpdater.clearDeck();
		for (i = 0; i < item.length; i ++) {
			WikipediaViewer.addResultCard(item[i]);
		}
		$('.card-columns').hide().fadeIn('slow').show();
	}
};

DOMUpdater = {

	clearDeck: function() {
		$('#searchResults').empty();
	},

	updatePageLayout: function() {
		$('#header-row').hide('slow');
	},

	bindEventsToCard: function(id) {
		$(id).on('mouseenter', function() {
			$(id).addClass('card-inverse').addClass('card-info');
		});

		$(id).on('mouseleave', function() {
			$(id).removeClass('card-inverse').removeClass('card-info');
		});
	},
	
	// make dynamic based on properties (images, quotes, etc.)
	addCardToDeck: function(article) {
		var html;
		html = '<a class="card-anchor" target="_blank" href="http://en.wikipedia.org/?curid=' + article.pageid + '">';
		html += '<div class="card" id="' + article.pageid + '">';
		html += '<div class="card-block">';
		html += '<h6 class="card-title">';
		html += article.title;
		html += '</h6>';
		html += '<p class="card-text">';
		html += article.extract;
		html += '</p>';
		html += '</div>';
		html += '</div>';
		html += '</a>';
		$(html).appendTo('#searchResults');
		this.bindEventsToCard('#' + article.pageid);
	},
};

$(function() {
	WikipediaViewer.init();
});

