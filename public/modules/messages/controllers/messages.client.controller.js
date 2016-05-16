'use strict';

// Messages controller
angular.module('messages').controller('MessagesController',
	function($scope, $stateParams, $location, Authentication, Messages, ServiceSuppliers) {
		$scope.authentication = Authentication;

		$scope.selectedServiceSupplier = undefined;
		ServiceSuppliers.query().$promise.then(function(servicesuppliers) {
			$scope.servicesuppliers = servicesuppliers;
			if ($stateParams.servicesupplierId) {
				for (var i = 0; i < servicesuppliers.length; i++) {
					if (servicesuppliers[i]._id === $stateParams.servicesupplierId) {
						$scope.selectedServiceSupplier = servicesuppliers[i];
						break;
					}
				}
			}
		});

		// Create new Message
		$scope.create = function() {
			// Create new Message object
			var message = new Messages ({
				name: this.name
			});

			// Redirect after save
			message.$save(function(response) {
				$location.path('messages/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Message
		$scope.remove = function(message) {
			if ( message ) { 
				message.$remove();

				for (var i in $scope.messages) {
					if ($scope.messages [i] === message) {
						$scope.messages.splice(i, 1);
					}
				}
			} else {
				$scope.message.$remove(function() {
					$location.path('messages');
				});
			}
		};

		// Update existing Message
		$scope.update = function() {
			var message = $scope.message;

			message.$update(function() {
				$location.path('messages/' + message._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Messages
		$scope.find = function() {
			$scope.messages = Messages.query();
		};

		// Find existing Message
		$scope.findOne = function() {
			$scope.message = Messages.get({ 
				messageId: $stateParams.messageId
			});
		};
	});