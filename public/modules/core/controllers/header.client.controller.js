'use strict';

angular.module('core').controller('HeaderController',
	function($scope, Authentication, Menus, MessageSearch) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');

		if ($scope.authentication.user)
		{
			MessageSearch.unreadMessages.query({
				userId: $scope.authentication.user._id
			}).$promise.then(function (response) {
				$scope.newMessages = response.unreadCount;
			});
		}

		$scope.$on('updateUnread', function(event, unreadMessages) {
			$scope.newMessages = unreadMessages;
		});

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	});