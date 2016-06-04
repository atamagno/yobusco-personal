'use strict';

// Messages controller
angular.module('messages').controller('MessagesController',
	function($scope, $rootScope, $state, $stateParams, Authentication, Messages, MessageSearch, ServiceSuppliers, $uibModal, Alerts, UsersAdmin) {
		$scope.authentication = Authentication;
		$scope.alerts = Alerts;

		$scope.itemsPerPage = 6;
		$scope.maxPages = 5;
		$scope.showList = false;

		if (!$scope.authentication.user) $state.go('home');

		$scope.initCreateScreen = function() {

			$scope.userId = $stateParams.userId;
			if ($stateParams.userId) {
				UsersAdmin.get({
					userId: $stateParams.userId
				}).$promise.then(function(user) {
						$scope.selectedServiceSupplier = user.displayName;
					});
			}
			else {
				$scope.selectedServiceSupplier = undefined;
				ServiceSuppliers.query().$promise.then(function(servicesuppliers) {
					$scope.servicesuppliers = servicesuppliers;
				});
			}
		};

		$scope.openCreateMessageModal = function () {

			var modalInstance = $uibModal.open({
				templateUrl: 'createMessageModal',
				controller: 'CreateMessageModalInstanceCtrl'
			});

			modalInstance.result.then(function () {
				$scope.create()
			});
		};

		// Create new Message
		$scope.create = function() {

			if (!$scope.content) {
				Alerts.show('danger','El mensaje no puede estar vacio.');
				return;
			}

			if (($scope.selectedServiceSupplier && $scope.selectedServiceSupplier._id) || ($scope.userId != '')) {

				// Create new Message object
				var message = new Messages ({
					content: this.content,
					from: $scope.authentication.user._id,
					to: $scope.userId != '' ? $scope.userId : $scope.selectedServiceSupplier.user._id
				});

				// Redirect after save
				message.$save(function(response) {
					Alerts.show('success','Mensaje enviado exitosamente');

					$state.go('messages.list', {
						condition: 'sent',
						currentPage: 1,
						itemsPerPage: $scope.itemsPerPage
					});
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
					Alerts.show('danger', $scope.error);
				});

			} else {
				Alerts.show('danger','Debes seleccionar un destinatario');
			}
		};

		// Find a list of Messages
		$scope.find = function() {

			$scope.showList = false;
			$scope.currentPage = $stateParams.currentPage;

			$scope.messagesCondition = $stateParams.condition;
			$scope.messageListTitle = 'Todos los mensajes';
			$scope.messageConditionLabel = '.';
			switch ($scope.messagesCondition) {
				case 'sent':
					$scope.messageListTitle = 'Mensajes enviados';
					$scope.messageConditionLabel = ' enviado.';
					break;
				case 'received':
					$scope.messageListTitle = 'Mensajes recibidos';
					$scope.messageConditionLabel = ' recibido.';
					break;
			}

			MessageSearch.messagesByUser.query({
				currentPage: $stateParams.currentPage,
				itemsPerPage: $scope.itemsPerPage,
				userId: $scope.authentication.user._id,
				condition: $scope.messagesCondition
			}).$promise.then(function (response) {
					$scope.currentPage = $stateParams.currentPage;
					$scope.totalItems = response.totalItems;
					$scope.messages = response.messages;
					$scope.showList = $scope.totalItems > 0;
			});
		};

		$scope.navigateToResults = function() {
			$state.go('messages.list', {
				condition: $scope.messagesCondition,
				currentPage: $scope.currentPage,
				itemsPerPage: $scope.itemsPerPage
			});
		};

		// Find existing Message
		$scope.findOne = function() {
			Messages.get({
				messageId: $stateParams.messageId
			}).$promise.then(function(message) {
				$scope.message = message;
				MessageSearch.unreadMessages.query({
					userId: $scope.authentication.user._id
				}).$promise.then(function (response) {
					$rootScope.$broadcast('updateUnread', response.unreadCount);
				});
			});
		};
	});

angular.module('messages').controller('CreateMessageModalInstanceCtrl',
	function ($scope, $uibModalInstance) {

		$scope.ok = function () {
			$uibModalInstance.close();
		};

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});