'use strict';

angular.module('messages')
	.factory('Messages',
		function($resource) {
			return $resource('messages/:messageId', { messageId: '@_id' }, { update: { method: 'PUT' } });
		})
	.factory('MessageSearch',
		function($resource) {
			return $resource('messages-by-user/:userId/:condition', { userId: '@_id'})
		});