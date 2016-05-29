'use strict';

angular.module('jobs')
	.factory('JobSearch',
		function($resource) {
			return {
				jobs: $resource('jobs-by-user/:jobUserId/:isServiceSupplier/:status', { jobUserId: '@_id'}),
				reviews: $resource('reviews-by-job/:jobId', { jobId: '@_id'}),
			}
		});