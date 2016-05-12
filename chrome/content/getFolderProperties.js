function getFolderProperties(aFolder, aOpen) {
	const nsIMsgFolder = Components.interfaces.nsIMsgFolder;
	let properties = [];

	properties.push("folderNameCol");

	properties.push("serverType-" + aFolder.server.type);

	// set the SpecialFolder attribute
	properties.push("specialFolder-" + getSpecialFolderString(aFolder));

	// Now set the biffState
	switch (aFolder.biffState) {
		case nsIMsgFolder.nsMsgBiffState_NewMail:
			properties.push("biffState-NewMail");
			break;
		case nsIMsgFolder.nsMsgBiffState_NoMail:
			properties.push("biffState-NoMail");
			break;
		default:
			properties.push("biffState-UnknownMail");
	}

	properties.push("isSecure-" + aFolder.server.isSecure);

	// A folder has new messages, or a closed folder or any subfolder has new messages.
	if (aFolder.hasNewMessages ||
			(!aOpen && aFolder.hasSubFolders && aFolder.hasFolderOrSubfolderNewMessages))
		properties.push("newMessages-true");

	if (aFolder.isServer) {
		properties.push("isServer-true");
		let unread = aFolder.getNumUnread(true);
		if (unread > 0) {
			properties.push("hasUnreadMessages-true");
		}
	}
	else
	{
		// We only set this if we're not a server
		let shallowUnread = aFolder.getNumUnread(false);
		if (shallowUnread > 0) {
			properties.push("hasUnreadMessages-true");
		}
		else
		{
			// Make sure that shallowUnread isn't negative
			shallowUnread = 0;
		}
		let deepUnread = aFolder.getNumUnread(true);
		if (deepUnread - shallowUnread > 0)
			properties.push("subfoldersHaveUnreadMessages-true");
	}

	properties.push("noSelect-" + aFolder.noSelect);
	properties.push("imapShared-" + aFolder.imapShared);

	return properties.join(" ");
}