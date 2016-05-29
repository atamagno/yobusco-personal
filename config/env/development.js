'use strict';

module.exports = {

	app: {
		title: 'Yo Busco',
		port: process.env.OPENSHIFT_NODEJS_PORT || 8002,
		server: process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
	},

	db: {
		port: process.env.OPENSHIFT_MONGODB_DB_PORT || '27017',
		server: process.env.OPENSHIFT_MONGODB_DB_HOST || '127.0.0.1',
		user: process.env.OPENSHIFT_MONGODB_DB_USERNAME || 'admin',
		password: process.env.OPENSHIFT_MONGODB_DB_PASSWORD || 'BEKI3Yk9we9V',
		//database: 'manodeobratest',
		database: 'yobusco',
	},

	mailer: {
		from: process.env.MAILER_FROM || 'sandbox5828bd2f4b634ad39b54049443bbdc6f.mailgun.org',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'Mailgun',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'postmaster@sandbox5828bd2f4b634ad39b54049443bbdc6f.mailgun.org',
				pass: process.env.MAILER_PASSWORD || '0869030670e24a94af7c440353c926f9'
			}
		}
	},

	dbConnectionString : function()
	{
		// should return 'mongodb://user:password@server:port
		return 'mongodb://localhost/yobusco';
		//return 'mongodb://' + this.db.user + ':' + this.db.password + '@' + this.db.server + ':' + this.db.port + '/'  + this.db.database
	}
};
