---
layout: post
title: PHP Script To Delete All WordPress Tables
categories:
  - development
---
I've had to do this a few times when I wasn't able to just drop the entire database, so I threw together a small PHP script that will do it for you.

<script type="text/javascript" src="http://gist.github.com/318109.js"> </script>

Just add your username, password, and database name and save it as `drop_wp_tables.php`. If you have shell access you can run `php drop_wp_tables.php`. Otherwise upload it to your site and pull up http://yoursite.com/wp_delete.php. **Make sure you delete this file if you upload it to your site!**

**Note**: If you used something other than wp_ as your table prefix, make sure to edit the script accordingly.
