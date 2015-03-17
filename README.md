

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

## Using it

* Install node.js;
* Update the configuration file to indicate database and FTP server editing the file `config.json`
* Install node modules with the following command

    `$cd mysqlbackup`

    `$npm install`

* Run it with the command

    `$node app`

