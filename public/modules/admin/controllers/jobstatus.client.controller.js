'use strict';

// JobStatus controller
angular.module('admin').controller('JobStatusController',
	function($scope, $stateParams, $state, Authentication, JobStatusAdmin, $uibModal, Alerts) {
		$scope.authentication = Authentication;
		$scope.alerts = Alerts;

		// If user is not signed in then redirect back home
		if (!$scope.authentication.user || ($scope.authentication.user.roles.indexOf('admin') === -1)) $state.go('home');

		$scope.createModalInstance = function (templateUrl) {

			var modalInstance = $uibModal.open({
				templateUrl: templateUrl,
				controller: 'JobStatusModalInstanceCtrl'
			});

			return modalInstance;
		};

		$scope.openDeleteModal = function () {

			var modalInstance = $scope.createModalInstance('deleteJobStatusModal');
			modalInstance.result.then(function () {
				$scope.remove()
			});
		};

		$scope.openEditModal = function () {

			var modalInstance = $scope.createModalInstance('editJobStatusModal');
			modalInstance.result.then(function () {
				$scope.update()
			});
		};

		// Create new JobStatus
		$scope.create = function() {
			// Create new JobStatus object
			var jobstatus = new JobStatusAdmin ({
				name: this.name
			});

			// Redirect after save
			jobstatus.$save(function(response) {
				Alerts.show('success','Estado de trabajo creado exitosamente');
				$state.go('admin.viewJobStatus', { jobstatusId: response._id});

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
				Alerts.show('danger',$scope.error);
			});
		};

		// Remove existing JobStatus
		$scope.remove = function() {
			$scope.jobstatus.$remove(function() {
				Alerts.show('success','Estado de trabajo eliminado exitosamente');
				$scope.currentPage = 1;
				$scope.navigateToPage();
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
				Alerts.show('danger',$scope.error);
			});
		};

		// Update existing JobStatus
		$scope.update = function() {
			var jobstatus = $scope.jobstatus;

			jobstatus.$update(function() {
				Alerts.show('success','Estado de trabajo actualizado exitosamente');
				$state.go('admin.viewJobStatus', { jobstatusId: jobstatus._id});
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
				Alerts.show('danger',$scope.error);
			});
		};

		$scope.itemsPerPage = 5;
		$scope.maxPages = 5;
		$scope.showList = false;

		$scope.navigateToPage = function() {
			$state.go('admin.listJobStatus', {
				currentPage: $scope.currentPage,
				itemsPerPage: $scope.itemsPerPage
			});
		};

		// Find a list of JobStatus
		$scope.find = function() {
			$scope.jobstatus = JobStatusAdmin.query({
				currentPage: $stateParams.currentPage,
				itemsPerPage: $stateParams.itemsPerPage
			}).$promise.then(function (response) {
					$scope.currentPage = $stateParams.currentPage;
					$scope.totalItems = response.totalItems;
					$scope.jobstatus = response.jobstatus;
					$scope.showList = $scope.totalItems > 0;
				});
		};

		// Find existing JobStatus
		$scope.findOne = function() {
			$scope.jobstatus = JobStatusAdmin.get({
				jobstatusId: $stateParams.jobstatusId
			});
		};
	});

angular.module('admin').controller('JobStatusModalInstanceCtrl',
	function ($scope, $uibModalInstance) {

	$scope.ok = function () {
		$uibModalInstance.close();
	};

	$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};
});