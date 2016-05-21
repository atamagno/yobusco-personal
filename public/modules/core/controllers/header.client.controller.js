'use strict';

angular.module('core').controller('HeaderController',
	function($scope, Authentication, Menus, MessageSearch) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		if ($scope.authentication.user)
		{
			MessageSearch.query({
				userId: $scope.authentication.user._id,
				condition: 'received'
			}).$promise.then(function (response) {
				var unreadMessages = response.filter(getUnread);
				$scope.newMessages = unreadMessages.length;
			});
		}

		$scope.$on('updateUnread', function(event, unreadMessages) {
			$scope.newMessages = unreadMessages;
		});

		function getUnread(message) {
			return !message.read;
		}

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	});