
var exec = require('child_process').exec,
	path = require('path'),
	fs = require('fs'),
	zip = require('archiver')('zip');

var cfg;

exports.execute = function(config, callback) {
	cfg = config;
	console.log('\n** UPDATING BACKUP OF ' + cfg.mysql.database);

	backupFile(callback);
};


function backupFile(callback) {
	var fo = path.join(cfg.backupDir, cfg.mysql.database + '.sql');

	cfg.backupFile = fo;

	try {
		fs.unlinkSync(fo);
	} catch (err) {

	}

	var cmd = cfg.mysqldump +
		" --user=" + cfg.mysql.user +
		" --password=" + cfg.mysql.password +
		" --databases " + cfg.mysql.database +
		" > " + fo;

	console.log('\nGenerating backup file ' + fo + '...');
	exec(cmd, function(err, stdout, stderr) {
		console.log(stderr);

		// check if backup file was successfully generated before continue
		fs.stat(fo, function(err, stat) {
			if (err) {
				callback(err);
				return;
			}

			if (stat.size === 0) {
				callback('ERROR: Backup file was not generated');
				return;
			}

			console.log('  Backup successfully generated');
			compressBackup(callback);
		});
	});
}


function compressBackup(callback) {
	var dt = new Date();

	var f = cfg.mysql.database + '.bkp.zip';

	var zipfile = path.join(cfg.backupDir, f);
	cfg.zipfile = zipfile;

	zip.on('error', function (err) {
		console.log(err);
		callback(err);
	});

	var out = fs.createWriteStream(zipfile);
	out.on('error', function (err) {
		console.log(err);
		callback(err);
	});

	// called when zip file is created and nothing else must be done
	out.on('close', function() {
		fs.stat(zipfile, function(err) {
			if (err) {
				callback("Zip file was not created: " + err);
				return;
			}
			console.log('  Zip successfully generated.');

			fs.unlinkSync(cfg.backupFile);

			var fdt = cfg.mysql.database + '-' + dt.getFullYear() + '-' +
				(dt.getMonth() + 1) + '-' + dt.getDate() + '.bkp.zip';
			fdt = path.join(cfg.backupDir, fdt);

			// copy database.zip to database-date.zip
			copyFile(cfg.zipfile, fdt, function(err) {
				if (err) {
					callback(err);
					return;
				}
				deleteOld(callback);
			});

		});
	});

	// zip file
	zip.pipe( out );

	console.log('\nCompressing backup file');
	console.log('File name = ' + zipfile + '...');

	zip.append( fs.createReadStream(cfg.backupFile), {name: 'etbmanager.bkp'})
		.finalize();
}


/**
 * Delete old backup files
 */
function deleteOld(callback) {
	if (!cfg.maxDays || cfg.maxDays <= 0) {
		callback();
		return;
	}

	console.log('\nDeleting files older than ' + cfg.maxDays + ' days');

	var dt = new Date();
	dt.setDate(dt.getDate() - cfg.maxDays);

	var lst = fs.readdirSync(cfg.backupDir);
	lst.forEach( function (file) {
		var f = path.join(cfg.backupDir, file);
		var info = fs.statSync( f );

		if (info.mtime < dt) {
			console.log('Deleting ' + f);
			fs.unlinkSync(f);
		}
	});

	callback();
}

/**
 * Copy a file
 * @param  {[type]}   fori     [description]
 * @param  {[type]}   fdest    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
function copyFile(fori, fdest, callback) {
	var out = fs.createWriteStream(fdest);
	out.on('close', callback);
	fs.createReadStream(fori).pipe(out);
}