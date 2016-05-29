var config = require('./../config/env/development'),
    mailer = require('./../app/controllers/mailer.server.controller'),
    mongoose = require('mongoose');

var db = mongoose.connect(config.dbConnectionString(), function(err) {
    if (err) {
        console.error('Could not connect to MongoDB!');
        console.log(err);
    }
    else
    {
        console.log('Successfully connected to MongoDB!');
    }
});

var approveJobApp = function() {

    var self = this;

    self.initialize = function() {
        require('./../app/models/job.server.model.js');
    };

    self.start = function() {
        var Job = mongoose.model('Job');

        var activeStatusID = '56269183477f11b662a6dd88';
        var delayedStatusID = '56269183477f11b0b2a99d88';

        // Fetch all jobs with active status.
        Job.find({ status: activeStatusID }).exec(function(err, jobs) {
            if (err) {
                console.error('%s: Error retrieving jobs', Date(Date.now));
            } else {

                for (var i = 0; i < jobs.length; i++) {

                    var jobToUpdate = jobs[i];

                    var now = new Date();
                    if (jobToUpdate.expected_date > now) {

                        jobToUpdate.status = delayedStatusID;
                        jobToUpdate.save(function(err, job) {
                            if (err) {
                                console.error('%s: Error updating job %s', Date(Date.now), job._id);
                            } else {

                                // TODO; send email here.
                                console.log('Succesfully updated job %s', job._id);
                            }
                        });
                    }
                }
            }
        });
    }
}

var app = new approveJobApp();
app.initialize();
app.start();