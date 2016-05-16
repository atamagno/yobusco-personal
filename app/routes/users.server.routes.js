'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');

	// Setting up the users admin api
	app.route('/users-admin')
		.get(users.list)
		.post(users.requiresLogin, users.isAdmin, users.create);

	app.route('/users-admin/:userId')
		.get(users.read)
		.put(users.requiresLogin, users.isAdmin, users.updateForAdmin)
		.delete(users.requiresLogin, users.isAdmin, users.delete);

	app.param('userId', users.userForAdminByID);
	
	app.route('/users-admin/:currentPage/:itemsPerPage').get(users.listByPage);

	// Setting up the users profile api
	app.route('/users/me').get(users.me);
	app.route('/users')
		.get(users.list)
		.put(users.requiresLogin, users.update);

	// Setting up the users password api
	app.route('/users/password').post(users.changePassword);
	app.route('/auth/forgot').post(users.forgot);
	app.route('/auth/reset/:token').get(users.validateResetToken);
	app.route('/auth/reset/:token').post(users.reset);

	// Setting up the users authentication api
	app.route('/auth/signup').post(users.signup);
	app.route('/auth/signin').post(users.signin);
	app.route('/auth/signout').get(users.signout);
};