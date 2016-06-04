'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Job Schema
 */
var JobSchema = new Schema({
	createdBy: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	createdByUser: {
		type: Boolean,
		default: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	service_supplier: {
		type: Schema.ObjectId,
		ref: 'ServiceSupplier',
		required: 'Por favor seleccione un prestador de servicios'
	},
	name: {
		type: String,
		default: '',
		required: 'Por favor ingrese un nombre',
		trim: true
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	status: {
		type: Schema.ObjectId,
		ref: 'JobStatus',
		required: 'Por favor seleccione un estado de trabajo'
	},
	reviewCount: {
		type: Number,
		default: 0
	},
	start_date: {
		type: Date,
		default: Date.now,
		required: 'Por favor ingrese una fecha de inicio'
	},
	expected_date: {
		type: Date,
		required: 'Por favor ingrese una fecha estimada'
	},
	finish_date: {
		type: Date
	},
	created_date: {
		type: Date,
		default: Date.now
	},
	pictures: [{
		type: String,
		default: []
	}],
	reported: {
		type: Boolean,
		default: false
	}
});

mongoose.model('Job', JobSchema);