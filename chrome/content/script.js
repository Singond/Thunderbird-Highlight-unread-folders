window.addEventListener("load", function(e) { 
	document.getElementById("folderTree").classList.add("hello");
//	document.getElementById("my-panel").label = "Hello";
	UnreadHighlighter.init();
//	UnreadHighlighter.observe();
}, false);

function customDisplay(string) {
	document.getElementById("my-panel").label = string;
}

window.setInterval(
	function() {
		//UnreadHighlighter.increment();
//		customDisplay(UnreadHighlighter.prefs.getCharPref("unread-account-style"));
	}, 1000); //update every second

var UnreadHighlighter = {
	prefs: null,
	
	init: function() {
		this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("extensions.m4_addon.");
		this.prefs.addObserver("", this, false);
//		customDisplay(this.prefs);
	},
	
/*	applyOptions: function() {
		
	},
	
	counter: 1,
	increment: function() {
		customDisplay(++this.counter);
	},*/
	
	observe: function(subject, topic, data) {
		customDisplay("observing…");
		// Ignore everything which is not change of preferences
		if (topic != "nsPref:changed") {
			return;
		}
		customDisplay(subject + "|" + topic + "|" + data);

/*		switch(data) {
			case "symbol":
				this.tickerSymbol = this.prefs.getCharPref("symbol").toUpperCase();
				this.refreshInformation();
				break;
		}*/
	}
}