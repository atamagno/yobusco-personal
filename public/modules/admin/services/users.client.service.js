'use strict';

angular.module('admin').factory('UsersAdmin',
	function($resource) {
		return $resource('users-admin/:userId/:currentPage/:itemsPerPage', { userId: '@_id'}, {
			query: { method: 'GET', isArray: false },
			update: { method: 'PUT' }
		});
	});