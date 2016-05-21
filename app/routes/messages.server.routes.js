'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var messages = require('../../app/controllers/messages.server.controller');

	// Messages Routes
	app.route('/messages')
		.get(messages.list)
		.post(users.requiresLogin, messages.create);

	app.route('/messages/:messageId').get(messages.read);

	// Finish by binding the Message middleware
	app.param('messageId', messages.messageByID);

	app.route('/messages-by-user/:userId/:condition').get(messages.listByUser);
};
