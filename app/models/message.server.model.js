'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Message Schema
 */
var MessageSchema = new Schema({
	content: {
		type: String,
		default: '',
		required: 'Please fill message content',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	from: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	to: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	read: {
		type: Boolean,
		default: false,
		required: true
	},
});

mongoose.model('Message', MessageSchema);