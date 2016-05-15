window.addEventListener("load", function(e) {
	UnreadHighlighter.init();
}, false);

function customDisplay(string) {
	document.getElementById("my-panel").label = string;
}

/*window.setInterval(
	function() {
		// This works
		let nameColumn = UnreadHighlighter.pane.columns.getColumnAt(0);
		UnreadHighlighter.pane.treeBoxObject.invalidate(nameColumn);
	}, 250); //update period*/

var UnreadHighlighter = {
	
	/** Addon user preferences */
	prefs: null,
	/** The folder pane in TB window. */
	pane: document.getElementById("folderTree"),
	
	/** "Constructor" */
	init: function() {
		// Getting the preferences object
		this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
			.getService(Components.interfaces.nsIPrefService)
			.getBranch("extensions.m4_addon.");
		// Make it update the preferences on the fly by listening to their changes.
		this.prefs.addObserver("", this, false);
		/* Apply the preferences once when starting TB, otherwise
		 * they won't show up until they are changed. */
		this.applyPreferenceAsClass("folder-highlight", this.pane);
		this.applyPreferenceAsClass("account-highlight", this.pane);
		
		/* 
		 * Now create a Mutation Observer to listen for changes to DOM
		 * (like when the class of an element is updated).
		 */
/*		var observer = new MutationObserver (this.redraw);
		var config = {subtree: true, attributes: true, characterData: true, chhildList: true};
		// Register it with the folder pane
		observer.observe(this.pane, config);*/
		
		this.setupListener();
	},
	
	/* AUTOMATIC UPDATING (REDRAWING) */
	
	/**
	 * Creates a new listener for folder changes
	 * and registers it.
	 */
	setupListener: function() {
		customDisplay("Initializing listener...");
		var folderListener = {
		/*	OnItemPropertyChanged: function(item, property, oldValue, newValue) {
				customDisplay: ("heard");
			}*/
//			OnItemAdded: this.redraw,
//			OnItemRemoved: this.redraw,
//			OnItemPropertyChanged: this.redraw,
			OnItemIntPropertyChanged: this.redraw,
//			OnItemBoolPropertyChanged: this.redraw,
//			OnItemUnicharPropertyChanged: this.redraw,
//			OnItemPropertyFlagChanged: this.redraw,
//			OnItemEvent: this.redraw,
//			OnFolderLoaded: this.redraw,
//			OnDeleteOrMoveMessagesCompleted: this.redraw
		};
		var flags = Components.interfaces.nsIFolderListener.intPropertyChanged;
		MailServices.mailSession.AddFolderListener(folderListener, flags);
	},
	
	i: 0,
	/** The callback function to be run by observer. */
	redraw: function() {
		let fpane = UnreadHighlighter.pane;
		let nameColumn = fpane.columns.getColumnAt(0);
		fpane.treeBoxObject.invalidate(nameColumn);
		// TODO Delete testing code:
		UnreadHighlighter.i++;
		customDisplay("redraw" + UnreadHighlighter.i);
	},
	
	/*
	 * OPTIONS HANDLING
	 * I don't know how to conditionally load CSS,
	 * so instead I implement the conditions as CSS classes
	 * on the folderTree element.
	 */
	
	/**
	 * Class names associated with each option.
	 * This object is used to translate the option name
	 * to the CSS class name to mark the folderTree with.
	 */
	classNames: {
		"folder-highlight": "highlight-folders",
		"account-highlight": "highlight-accounts"
	},
	
	/**
	 * Applies the preference to the given target as a class name.
	 * Works properly for boolean preferences only.
	 * @param preference The preference name to check
	 * @param target The target DOM element
	 */
	applyPreferenceAsClass: function(preference, target) {
		var setTrue = this.prefs.getBoolPref(preference);
		var className = this.classNames[preference];
		
		// Apply the setting to the element, if not present already.
		if (setTrue && !target.classList.contains(className)) {
			target.classList.add(className);
		} else if (!setTrue && target.classList.contains(className)) {
			target.classList.remove(className);
		}
	},
	
	observe: function(subject, topic, data) {
		// Ignore everything which is not change of preferences
		if (topic != "nsPref:changed") {
			return;
		}
		// TODO Remove this testing code
		var folders = this.prefs.getBoolPref("folder-highlight");
		var accounts = this.prefs.getBoolPref("account-highlight");
		//var text = "";
		/*if(folders) {text += "Highlight folders";}
		if(accounts) {text += "Highlight accounts";}
		customDisplay(data);*/

		/*
		 * If more options change, a separate event is generated for each,
		 * ie. this function is called for every option separately.
		 * The data argument is the name of the option changed, so:
		 */ 
		switch(data) {
			case "folder-highlight":
			case "account-highlight":
				this.applyPreferenceAsClass(data, this.pane);
				break;
			default:
				return;
		}
	}
}