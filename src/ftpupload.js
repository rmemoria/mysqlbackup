
var Ftp = require('ftp'),
	path = require('path');


exports.execute = function(config, callback) {
	if (!config.ftp || !config.ftp.host) {
		console.log('FTP skipped');
		callback();
		return;
	}

	var ftp = new Ftp();

	console.log('Connecting to ' + config.ftp.host + '...');

	ftp.on('ready', function() {
		console.log('   Connected');
		uploadFile(config, ftp, callback);
	});

	var opts = {
		host: config.ftp.host
	};

	// user was defined ?
	if (config.ftp.user) {
		opts.user = config.ftp.user;
	}

	// password was defined ?
	if (config.ftp.password) {
		opts.password = config.ftp.password;
	}

	ftp.connect({
		host: config.ftp.host,
		user: config.ftp.user,
		password: config.ftp.password
	});
};


function uploadFile(config, ftp, callback) {
	var dir = config.ftp.dir? config.ftp.dir: '/';

	console.log('   cwd ' + dir);
	// change the dir
	ftp.cwd(dir, function(err) {
		if (err) {
			callback(err);
			return;
		}

		ftp.binary(function(err) {
			var fname = path.basename(config.zipfile);

			console.log('   uploading ' + fname);

			// upload file
			ftp.put(config.zipfile, fname, function(err) {
				if (err) {
					console.log('Error: ' + err);
					callback(err);
					return;
				}

				ftp.end();
				callback();
			});

		});

	});
}
