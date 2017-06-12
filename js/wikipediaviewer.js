'use strict'

let WikipediaViewer, 
	DataParser, 
	DOMUpdater, 
	s

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
		s = this.properties
		this.refreshQueryParameters()
		this.bindEvents()
	},

	// dynamically update the search query url
	refreshQueryParameters: function() {
		// start with the base url
		s.searchQuery = s.api.url
		// ...then add parameters as needed
		let len = Object.keys(s.api).length
		for (let i = 1; i < len; i++) {
			s.searchQuery += (Object.keys(s.api)[i] + '=' + s.api[Object.keys(s.api)[i]])
			if (i != Object.keys(s.api).length-1) s.searchQuery += '&'
		}	
	},

	bindEvents: function() {
		// search button
		s.searchButton.on('click', this.performQuery)
			
		// search box 
		s.searchBox.on('keydown', function(k) {
			switch (k.keyCode) {
				// ENTER key
				case 13: {
					WikipediaViewer.performQuery()
					break
				}
				// TODO:  suggestion dropdown request here
			}
		})

		s.searchBox.on('keyup', function(k) {
			// TODO: will check for empty search box
		})
	},

	performQuery: function() {
		// make sure our query is up to date
		WikipediaViewer.refreshQueryParameters()
		// hide old cards if applicable
		$('.card-columns').fadeOut()
		// replaces empty space to url friendly '+'
		s.searchQuery += s.searchBox.val().replace(' ', '+')
		// pass JSON onto the DataParser for interpretation
		$.getJSON(s.searchQuery, DataParser.interpret)
		console.log(s.searchQuery)
	},

	addResultCard: function(article) {
		DOMUpdater.updatePageLayout()
		DOMUpdater.addCardToDeck(article)
	}
}

DataParser = {
	interpret: function(data) {
		/* 
		* interpretations to be performed here for dynamic
		* material (images, quotes, special text, etc.)
		* the code below will be reorganized after
		*/
		let item = Object.values(data.query.pages)
		DOMUpdater.clearDeck()
		let len = item.length
		for (let i = 0; i < len; i ++) {
			WikipediaViewer.addResultCard(item[i])
		}
		$('.card-columns').hide().fadeIn('slow').show()
	}
}

// TODO: rename and cache jQuery objects
DOMUpdater = {
	clearDeck: function() {
		$('#searchResults').empty()
	},

	updatePageLayout: function() {
		$('#header-row').hide('slow')
	},

	bindEventsToCard: function(id) {
		$(id).on('mouseenter', function() {
			$(id).addClass('card-inverse').addClass('card-info')
		})

		$(id).on('mouseleave', function() {
			$(id).removeClass('card-inverse').removeClass('card-info')
		})
	},
	
	// TODO: add header and footer to cards
	addCardToDeck: function(article) {
		let html
		html = `<a class="card-anchor" target="_blank" href="http://en.wikipedia.org/?curid=${article.pageid}">`
		html += `<div class="card" id="${article.pageid}">`
		html += '<div class="card-block">'
		html += `<h6 class="card-title">${article.title}</h6>`
		html += `<p class="card-text">${article.extract}</p>`
		html += '</div></div></a>'
		$(html).appendTo('#searchResults')
		this.bindEventsToCard(`#${article.pageid}`)
	},
}

$(function() {
	WikipediaViewer.init()
})