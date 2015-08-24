

# mysqlbackup

Simple app to perform a mysql database backup and send it to a FTP server

**Author:** Ricardo Memoria
[rmemoria@gmail.com](rmemoria@gmail.com)

## Features

* Perform MySQL database backup;
* Keep a list of backup performed in the last days (configured);
* Transmit the latest backup file to a FTP server;

## Requirements

* Node.js (https://nodejs.org)

## Configuration

Modify the file config.json to configure how backup will be done. Possible options are:

`backupDir`: Folder where backup files will be saved;
`mysqldump`: Full path and name of mysqldump command (usually in MySQL bin folder);
`maxDays`: It is expected that backup will be done daily, so mysqlbackup will delete any backup file older than the number of days specified;
`mysql`: Configuration parameters to connect to the MySQL database;
`ftp`: Configuration parameters to connect to a FTP server;

## Using it

* Install node.js;
* Update the configuration file to indicate database and FTP server editing the file `config.json`
* Install node modules with the following command

    `$cd mysqlbackup`

    `$npm install`

* Run it with the command

    `$node app`

