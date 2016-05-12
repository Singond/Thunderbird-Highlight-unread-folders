window.addEventListener("load", function(e) { 
	document.getElementById("folderTree").classList.add("hello");
	document.getElementById("my-panel").label = "Hello";
	customDisplay("hello");
}, false);

var UnreadHighlighter = {
	prefs: null,
	
	init = function() {
		this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("extensions.m4_addon.");
		this.prefs.addObserver("", this, false);
	},
	
	applyOptions = function() {
		
	},
	
	observe: function(subject, topic, data) {
		// Ignore everything which is not change of preferences
		if (topic != "nsPref:changed") {
			return;
		}

		switch(data) {
			case "symbol":
		/*		this.tickerSymbol = this.prefs.getCharPref("symbol").toUpperCase();
				this.refreshInformation();*/
				break;
		}
	},
}