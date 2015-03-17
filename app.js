
var path = require('path'),
	fs = require('fs'),
	backup = require('./src/backup'),
	ftpupload = require('./src/ftpupload');

var config = readConfig();

/**
 * Execute the backup
 */
backup.execute(config,  function(err) {

	if (err) {
		console.log(err);
		return;
	}

	/**
	 * Execute the FTP upload
	 */
	ftpupload.execute(config, function(err) {
		if (err) {
			console.log(err);
		}
	});
});



/**
 * Read configuration
 */
function readConfig() {
	var fname = path.join(__dirname, './config.json');

	var	data = fs.readFileSync(fname),
	cfg = JSON.parse(data);
	return cfg;
}