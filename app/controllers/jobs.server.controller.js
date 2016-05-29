'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	mailer = require('./mailer.server.controller'),
	mailer = require('./mailer.server.controller'),
	Job = mongoose.model('Job'),
	ServiceSupplier = mongoose.model('ServiceSupplier'),
	User = mongoose.model('User'),
	async = require('async'),
	_ = require('lodash');

/**
 * Create a Job
 */
exports.create = function(req, res) {

	var job = new Job(req.body);
	job.createdBy = req.user;

	async.waterfall([
		function(done) {
			job.save(function(err) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					done(err, job);
				}
			});
		},
		function(job, done) {
			ServiceSupplier.findById(job.service_supplier).exec(function(err, servicesupplier) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					servicesupplier.jobCount++;
					servicesupplier.overall_rating++;
					done(err, job, servicesupplier);
				}
			});
		},
		function(job, servicesupplier, done) {
			User.findById(job.createdBy).exec(function(err, createdBy) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					done(err, job, servicesupplier, createdBy);
				}
			});
		},
		function(job, servicesupplier, createdBy, done) {
			if (!job.createdByUser) {
				User.findById(job.user).exec(function (err, user) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						done(err, job, servicesupplier, createdBy, user);
					}
				});
			} else {
				done(null, job, servicesupplier, createdBy, null);
			}
		},
		function(job, servicesupplier, createdBy, user, done) {
			servicesupplier.save(function (err) {
				if (!err) {

					if (job.createdByUser) {
						mailer.sendMail(res, 'new-job-for-service-supplier-email',
							{
								serviceSupplier: servicesupplier.display_name,
								userName: createdBy.displayName
							}, 'Nuevo trabajo', servicesupplier.email);
						mailer.sendMail(res, 'new-job-by-user-email',
							{
								serviceSupplier: servicesupplier.display_name,
								userName: createdBy.displayName
							}, 'Nuevo trabajo', createdBy.email);
					} else {
						if (user) {
							mailer.sendMail(res, 'new-job-for-user-email',
								{
									serviceSupplier: servicesupplier.display_name,
									userName: user.displayName
								}, 'Nuevo trabajo', user.email);
							mailer.sendMail(res, 'new-job-by-service-supplier-email',
								{
									serviceSupplier: servicesupplier.display_name,
									userName: user.displayName
								}, 'Nuevo trabajo', servicesupplier.email);
						}
					}

					res.jsonp(job);
				}

				done(err);
			});
		}
	], function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
	});

/*
	var job = new Job(req.body);
	job.createdBy = req.user;

	job.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			ServiceSupplier.findById(job.service_supplier).exec(function(err, servicesupplier) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					servicesupplier.jobCount++;
					servicesupplier.overall_rating++;
					servicesupplier.save(function (err) {
						if (err) {
							return res.status(400).send({
								message: errorHandler.getErrorMessage(err)
							});
						} else {

							if (job.createdByUser) {
								mailer.sendMail(res, 'new-job-for-service-supplier-email',
									{
										serviceSupplier: servicesupplier.display_name,
										userName: job.createdBy.displayName
									}, 'Nuevo trabajo', servicesupplier.email);
								mailer.sendMail(res, 'new-job-by-user-email',
									{
										serviceSupplier: servicesupplier.display_name,
										userName: job.createdBy.displayName
									}, 'Nuevo trabajo', job.createdBy.email);
							} else {
								mailer.sendMail(res, 'new-job-for-user-email',
									{
										serviceSupplier: servicesupplier.display_name,
										userName: job.createdBy.displayName
									}, 'Nuevo trabajo', job.createdBy.email);
								mailer.sendMail(res, 'new-job-by-service-supplier-email',
									{
										serviceSupplier: servicesupplier.display_name,
										userName: job.createdBy.displayName
									}, 'Nuevo trabajo', servicesupplier.email);
							}

							res.jsonp(job);
						}
					});
				}
			});
		}
	});
	*/
};

/**
 * Show the current Job
 */
exports.read = function(req, res) {
	res.jsonp(req.job);
};

/**
 * Update a Job
 */
exports.update = function(req, res) {
	var job = req.job ;

	job = _.extend(job , req.body);

	job.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {

			var user = req.user;
			Job.findOne(job)
				.populate('service_supplier')
				.populate('user').exec(function (err, job) {

					mailer.sendMail(res, 'updated-job-for-user-updating-email',
						{
							userName: user.displayName,
							jobName: job.name
						}, 'Trabajo modificado', user.email);

					var mailOptions = { jobName: job.name };
					if (user.email == job.user.email) {
						mailOptions = {
							userName: job.service_supplier.display_name,
							userUpdating: job.user.displayName,
						};

						var emailTo = job.service_supplier.email;
					} else {
						mailOptions = {
							userName: job.user.displayName,
							userUpdating: job.service_supplier.display_name,
						};

						var emailTo = job.user.email;
					}

					mailer.sendMail(res, 'updated-job-for-user-not-updating-email', mailOptions, 'Trabajo modificado', emailTo);

					res.jsonp(job);
				});
		}
	});
};

/**
 * Delete an Job
 */
exports.delete = function(req, res) {
	var job = req.job ;

	job.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			ServiceSupplier.findById(job.service_supplier).exec(function(err, servicesupplier) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					servicesupplier.jobCount--;
					servicesupplier.overall_rating--;
					servicesupplier.save(function (err) {
						if (err) {
							return res.status(400).send({
								message: errorHandler.getErrorMessage(err)
							});
						} else {
							res.jsonp(job);
						}
					});
				}
			});
		}
	});
};

/**
 * List of Jobs
 */
exports.list = function(req, res) {
	Job.find().exec(function(err, jobs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(jobs);
		}
	});
};

/**
 * Job middleware
 */
exports.findJobByID = function(req, res, next, id) {
	Job.findById(id).populate('service_supplier', 'display_name').populate('user').populate('status').exec(function(err, job) {
		if (err) return next(err);
		if (!job) return next(new Error('Error al cargar trabajo ' + id));
		req.job = job ;
		next();
	});
};

exports.listByPage = function(req, res) {

	var currentPage = req.params.currentPage;
	var itemsPerPage = req.params.itemsPerPage;

	// TODO: add more validation to query string parameters here.
	if (currentPage && itemsPerPage) {
		currentPage = parseInt(currentPage);
		itemsPerPage = parseInt(itemsPerPage);
		var startIndex = (currentPage - 1) * itemsPerPage;

		var response = {};
		Job.count({}, function (err, count) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {

				response.totalItems = count;
				Job.find({}, {}, { skip: startIndex, limit: itemsPerPage }, function(err, jobs) {
					if (err) {
						return res.status(400).send({
							message: errorHandler.getErrorMessage(err)
						});
					} else {
						response.jobs = jobs;
						res.jsonp(response);
					}
				});
			}
		});

	} else {
		return res.status(400).send({
			message: errorHandler.getErrorMessage(err)
		});
	}
};

exports.listByUser = function(req, res) {

	var jobUserId = req.params.jobUserId;
	var isServiceSupplier = req.params.isServiceSupplier;

	if (isServiceSupplier === 'true') {
		ServiceSupplier.find({user: jobUserId}).exec(function (err, servicesuppliers) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				var servicesupplier = servicesuppliers[0];
				findJobsByUserID({service_supplier: servicesupplier._id}, req, res);
			}
		});
	}
	else {
		findJobsByUserID({user: jobUserId}, req, res);
	}
};

function findJobsByUserID(searchCondition, req, res) {
	Job.find(searchCondition).populate('service_supplier', 'display_name').populate('status').exec(function (err, jobs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var status = req.params.status;
			if (status === 'finished' || status === 'active' || status === 'pending') {

				var filteredJobs = [];
				if (status === 'finished') {
					filteredJobs = jobs.filter(finishedFilter);
				}
				else {
					statusFilterCondition = status;
					filteredJobs = jobs.filter(byStatusFilter);
				}

				jobs = filteredJobs;
			}

			res.jsonp(jobs);
		}
	});
}

var statusFilterCondition = '';
function byStatusFilter(job) {
	return job.status.keyword=== statusFilterCondition;
}

function finishedFilter(job) {
	return job.status.finished;
}

exports.listByServiceSupplier = function(req, res) {

	var serviceSupplierId = req.params.serviceSupplierId;
	Job.find({service_supplier: serviceSupplierId}).populate('service_supplier', 'display_name')
												   .populate('status').exec(function(err, jobs) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(jobs);
		}
	});
};

exports.canUpdate = function(req, res, next) {
	var job = req.job, user = req.user;
	// TODO: need to change the second condition here.
	if ((job.user.username !== user.username) && (job.service_supplier.display_name !== user.displayName)) {
		return res.status(401).send({
			message: 'El usuario no est\u00e1 autorizado'
		});
	}

	next();
};