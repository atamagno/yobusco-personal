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

        var pendingStatusID = '56263383477f128bb2a6dd88';
        var activeStatusID = '56269183477f11b662a6dd88';

        // Fetch all jobs with pending status.
        Job.find({ status: pendingStatusID }).exec(function(err, jobs) {
            if (err) {
                console.error('%s: Error retrieving jobs', Date(Date.now));
            } else {

                // TODO: compare new field created_date.
                for (var i = 0; i < jobs.length; i++) {

                    var jobToUpdate = jobs[i];

                    var now = new Date();
                    var jobCreatedDatePlusOneDay = jobs[i].created_date;
                    jobCreatedDatePlusOneDay.setDate(jobCreatedDatePlusOneDay.getDate() + 1);

                    // If the job is pending after one day of being created, change the status to active.
                    if (jobCreatedDatePlusOneDay < now)
                    {
                        jobToUpdate.status = activeStatusID;
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