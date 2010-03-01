---
layout: post
title: PHP Script To Delete All WordPress Tables
---
I've had to do this a few times when I wasn't able to just drop the entire database, so I threw together a small PHP script that will do it for you.  Get it on <a href="http://pastie.org/385753">Pastie</a>.

Just add your username, password, and database name and save it as wp_delete.php. If you have shell access you can run `php wp_delete.php`. Otherwise upload it to your site and pull up http://yoursite.com/wp_delete.php. <strong>Make sure you delete this file if you upload it to your site!</strong>

**Note**: If you used something other than wp_ as your table prefix, make sure to edit the script accordingly.
