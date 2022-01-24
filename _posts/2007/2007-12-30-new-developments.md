---
title: New Development(s)
category: dev
redirect_from: /blog/2007/new-developments.html
---

Well, I've just finished building my first site with CodeIgniter, and I have
to say it was an absolute blast. The framework is wonderfull. Using it, I was
able to completely redesign Inglenook Realty in about 3 weeks with leaner,
more sensible code than I had implemented previously. Granted, there is about
twice as much code now as there was previously, but everything works perfectly
now - and I won't need to scrap the whole thing again if the owners want more
revisions down the road. Thank you CI!

I also got around to finishing up a small PHP script I had written called
dyndnsCron. This script can be installed as a cronjob and it will update your
IP address with DynDNS if it changes. It will also automatically make "fake"
changes to your account once a month to make sure it isn't deleted for
inactivity. [Those of us with free DynDNS accounts know all about that...]

```php
#!/usr/bin/php -q
<?php

/**
 * dyndnsCron
 *
 * @author		Joshua Priddle <jpriddle@nevercraft.net>
 * @copyright	Copyright (c) 2007, Joshua Priddle
 * @version 	1.0
 *
 * A simple PHP class to update a DynDNS hostname on *nix platforms.
 *
 * This script should be run as a cron by root daily.  Once a month
 * it will force an update to ensure that DynDNS does not delete your
 * account for inactivity.  It can also be run manually from the command line.
 *
 * NOTE: This script should be executable - run chmod +x update to give it
 *		 executable permissions.
 *
 * NOTE: You must have the following packages installed:
 *		 - PHP (compiled with MySQL extensions and CLI support)
 *		 - MySQL
 *		 - grep
 *		 - awk
 *		 - curl
 *
 * Most hosts should have these already.  If not, it should be as simple as:
 *
 *	Ubuntu: sudo apt-get install php5 php5-mysql php5-cli mysql-server-5.0 \
 *			grep awk curl
 *
 *	Fedora: (Not Sure Yet)
 *
 * 
 * MySQL Setup: From the MySQL prompt run the following commands.  You can
 * 				change the username, password, etc if you wish.  Make sure to 
 *				change the variables below if you do not use the defaults!
 *				You should NOT change column names, unless you update the script
 * 				accordingly.
 *
 * mysql> create database dyndns;
 * mysql> create table ip_log (id int not null auto_increment, date_checked date not null, ip varchar(15) not null, primary key (id));
 * mysql> grant select, insert on dyndns.ip_log to 'update_ip'@'localhost' identified by 'update_ip;
 *
 *
 * Cron Setup:  This assumes you have this script located in /root/dyndns
 *				As root, run crontab -e and then enter the following:
 *				
 *				0 5 * * * /root/dyndns/update
 *
 *				Note: DynDNS sends their warning emails out at about 6am on the 30th
 * 					  day your account hasn't been changed.  Running the cron at 5am
 *					  should change your account on the 30th day before their warning
 *					  email is sent
 */

class dyndnsCron {


	/*
	|---------------------------------------------------------------
	| CONFIGURATION
	|---------------------------------------------------------------
	| Change the options below to match your DynDNS details and
	| your database setup.
	|
	*/

	// The FULL path to your log file
	var $log_file 	= "/root/dyndns/update.log";

	// Replace with your username and password
	var $url 		= "https://USERNAME:PASSWORD@members.dyndns.org/nic/update";

	// Your DynDNS hostname (no http or www!)
	var $hostname 	= "";

	// DB Host (usually localhost)
	var $db_host	= "localhost";

	// DB User (update_ip, unless you created a custom database)
	var $db_user	= "update_ip";

	// DB Pass (update_ip, unless you created a custom database)
	var $db_pass	= "update_ip";

	// DB Name (dyndns, unless you created a custom database)
	var $db_name	= "dyndns";

	// -- END CONFIGURATION -- YOU SHOULD NOT NEED TO EDIT BELOW THIS LINE

	var $new_ip;
	var $old_ip;
	var $last_update;
	var $conn;

	function dyndnsCron() {
		$this->new_ip 	= trim(`/sbin/ifconfig eth0 | grep "inet addr" | awk '{print $2}' | awk -F: '{print $2}'`);
		$this->conn 	= mysql_connect($this->db_host, $this->db_user, $this->db_pass);
		if ( !mysql_select_db($this->db_name, $this->conn) ) {
			$this->_log("Couldn't connect to database");
			exit;
		}
		if ( $this->get_last_update() ) {
			if ( round( ( time() - $this->last_update ) / ( 60 * 60 * 24 ) ) > 29 ) {
				$this->force_update();
			} else {
				if ( $this->new_ip != $this->old_ip ) { 
					$this->updateIP($this->new_ip);
				} else {
					$this->_log("IP has not changed.  Aborting.");
				}
			}
		} else {
			$this->first_update();
		}
	}

	function first_update() {
		$sql = "INSERT INTO ip_log (date_checked, ip) VALUES (now(), '{$this->new_ip}')";
		if ( mysql_query($sql, $this->conn) ) { 
			$this->_log("First run.  Forcing manual update to {$this->new_ip}");
			$this->force_update();
			return TRUE;
		} else {
			return FALSE;
		}
	}

	function get_last_update() {
		$sql = "SELECT ip, unix_timestamp(date_checked) as last_update FROM ip_log ORDER BY date_checked DESC LIMIT 1";
		$res = mysql_query($sql, $this->conn);
		if ( mysql_num_rows($res) > 0 ) {
			while ( $r = mysql_fetch_array($res, $this->conn) ) { 
				$this->old_ip = $r['ip'];
				$this->last_update = $r['last_update'];
			}
			return TRUE;
		} else { 
			return FALSE;
		}
	}

	function force_update() {
		$this->_log("BEGIN FORCED UPDATE");
		$tmp_ip = substr($this->new_ip, 0, -1) . abs(substr($this->new_ip, -1) - 1);
		if ( ! $this->updateIP($tmp_ip) ) {
			$this->_log("Couldn't update IP to $tmp_ip!");
			exit;
		}
		sleep(120);
		if ( ! $this->updateIP($this->new_ip) ) {
			$this->_log("Couldn't update IP to {$this->new_ip}!");
		}
		$this->_log("END FORCED UPDATE");
	}

	function _log($message) {
		if ( $message != '' ) {
			exec("echo '". date('Y-m-d H:i:s') ." | $message' >> " . $this->log_file);
		}
	}

	function updateIP($ip) {
		$res = trim(`curl -k -d "hostname={$this->hostname}&myip=$ip" {$this->url} 2> /dev/null`);
		$this->_log($res);
		if ( strstr($res, 'good') ) {
			if ( mysql_query("INSERT INTO ip_log (date_checked, ip) VALUES (now(), '$ip')", $this->conn) ) {
				return TRUE;
			} 
		} 

		return FALSE;
	}

}

new dyndnsCron();

?>
```

If I don't make it back here before 08 - happy new year!
