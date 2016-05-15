// Initialize UnreadHighlighter
window.addEventListener("load", function(e) {
	UnreadHighlighter.init();
}, false);

var UnreadHighlighter = {
	
	/** User preferences for this add-on */
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
		
		/* Listen for changes to the folder. This will update the view
		 * when user changes the "read" status of a message. */
		this.setupListener();
	},
	
	/*
	 * AUTOMATIC UPDATING (REDRAWING)
	 * This section deals with updating the view of the Folder Pane
	 * when the unread status of some messages is changed.
	 */
	
	/**
	 * Creates a new listener for folder changes
	 * and registers it.
	 */
	setupListener: function() {
		var folderListener = {
			OnItemIntPropertyChanged: this.redraw,
		};
		var flags = Components.interfaces.nsIFolderListener.intPropertyChanged;
		MailServices.mailSession.AddFolderListener(folderListener, flags);
	},
	/**
	 * The callback function to be run by the listener.
	 * This is where redrawing the Folder Pane takes place.
	 */
	redraw: function(item, property, oldValue, newValue) {
		// Ignore everything not concerning unread status of messages
		if (!property.equals("TotalUnreadMessages")) {
			return;
		}
		// The folder pane
		let fpane = UnreadHighlighter.pane;
		// The first column is the folder name
		let nameColumn = fpane.columns.getColumnAt(0);
		// Invalidating the column causes it to be redrawn.
		fpane.treeBoxObject.invalidateColumn(nameColumn);
	},
	
	/*
	 * OPTIONS HANDLING
	 * I don't know how to load CSS from JavaScript,
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
	
	/**
	 * Called when preferences change
	 */
	observe: function(subject, topic, data) {
		// Ignore everything which is not a change of preferences
		if (topic != "nsPref:changed") {
			return;
		}

		/*
		 * Here we filter out the preferences which are not of interest.
		 * 
		 * If more options change, a separate event is generated for each,
		 * ie. this function is called for every option separately.
		 * The data argument is the name of the option changed.
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