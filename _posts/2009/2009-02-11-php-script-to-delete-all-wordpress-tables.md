---
title: PHP Script To Delete All WordPress Tables
category: dev
redirect_from:
- /blog/2009/php-script-to-delete-all-wordpress-tables.html
- /dev/2009/php-script-to-delete-all-wordpress-tables.html
tags: [php, mysql, wordpress]
---

I've had to do this a few times when I wasn't able to just drop the entire
database, so I threw together a small PHP script that will do it for you.

```php
<?php // drop wp_ tables

// Set to your db
$database = 'my_db';

// Add your user/pass
if ( ! mysql_connect('localhost', 'username', 'password')) {
  die("Couldn't connect to db.  MySQL Error (".mysql_errno()."): ".mysql_error());
}

$res = mysql_query("SHOW TABLES FROM {$database}");

if (mysql_num_rows($res) > 0) {
  while ($r = mysql_fetch_array($res)) {
    $table = $r['Tables_in_'.$database];
    if (substr($table, 0, 3) == 'wp_') {
      if (mysql_query("DROP TABLE {$table}")) {
        echo "Deleted {$table}\n";
      } else {
        echo "Couldn't delete {$table}\n";
      }
    }
  }
}
```

Just add your username, password, and database name and save it as
`drop_wp_tables.php`. If you have shell access you can run
`php drop_wp_tables.php`. Otherwise upload it to your site and pull up
http://yoursite.com/wp_delete.php.

**Make sure you delete this file if you upload it to your site!**

**Note:** If you used something other than `wp_` as your table prefix, make sure
to edit the script accordingly.
