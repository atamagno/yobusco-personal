'use strict';

angular.module('search')
    .controller('SuppliersResultsController',
        function($scope, $state, $stateParams, Authentication, ServiceSuppliersSearch, Alerts) {

            $scope.alerts = Alerts;
            $scope.authentication = Authentication;
            $scope.serviceSubcategoryId = $stateParams.serviceId;

            // TODO: we need to increment this number, maybe between 10-20?
            // We keep it low for now just for testing purposes due to the few suppliers in the data base.
            $scope.itemsPerPage = 5;
            $scope.maxPages = 5;
            $scope.showList = false;

            $scope.navigateToResults = function() {
                $state.go('resultsServiceSupplier.list', {
                    serviceId: $scope.serviceSubcategoryId,
                    currentPage: $scope.currentPage,
                    itemsPerPage: $scope.itemsPerPage
                });
            };

            $scope.getResults = function() {
                $scope.showList = false;
                ServiceSuppliersSearch.query({
                    serviceId: $stateParams.serviceId,
                    currentPage: $stateParams.currentPage,
                    itemsPerPage: $stateParams.itemsPerPage,
                    services: $stateParams.services,
                    jobAmount: $stateParams.jobAmount,
                    supplierName: $stateParams.supplierName
                }).$promise.then(function (response) {
                    $scope.currentPage = $stateParams.currentPage;
                    $scope.totalItems = response.totalItems;
                    $scope.servicesuppliers = response.servicesuppliers;
                    $scope.showList = $scope.totalItems > 0;
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                    Alerts.show('danger', $scope.error);
                });
            };
        })
    .controller('SuppliersFiltersController',
        function($scope, $state, $stateParams, ServiceSubcategories, RatingTypes, ServiceSuppliersSearch) {

            $scope.jobAmount = 0;
            $scope.serviceSubcategoryId = $stateParams.serviceId;
            $scope.itemsPerPage = 5;

            $scope.serviceSubcategories = [];
            ServiceSubcategories.query().$promise.then(function (services) {
                for (var i = 0; i < services.length; i++) {
                    $scope.serviceSubcategories.push({_id: services[i]._id, name: services[i].name, checked: false });
                }
            });

            $scope.ratings = [];
            RatingTypes.query().$promise.then(function (types) {
                for (var i = 0; i < types.length; i++) {
                    $scope.ratings.push({ _id: types[i]._id, name: types[i].name, description: types[i].description, rate: 0 });
                }
            });

            $scope.applyFilters = function() {

                var services = '';
                $scope.serviceSubcategories.forEach(function(service) {
                    if (service.checked) {
                        if (services.length) {
                            services += '%';
                        }
                        services += service._id;
                    }
                });

                $state.go('resultsServiceSupplier.list', {
                    serviceId: $scope.serviceSubcategoryId,
                    currentPage: 1,
                    itemsPerPage: $scope.itemsPerPage,
                    services: services,
                    jobAmount: $scope.jobAmount,
                    supplierName: $scope.supplierName
                });
            };

            $scope.resetFilters = function() {

                $scope.jobAmount = 0;
                $scope.supplierName = '';
                $scope.serviceSubcategories.forEach(function(service) {
                    service.checked = false;
                });

                $state.go('resultsServiceSupplier.list', {
                    serviceId: $scope.serviceSubcategoryId,
                    currentPage: 1,
                    itemsPerPage: $scope.itemsPerPage,
                    services: '',
                    jobAmount: '',
                    supplierName: ''
                }, {reload: true});
            };
        });