---
title: Random Date Helpers
---

I wrote these as helpers for a project I'm making with CodeIgniter, but you
can use them in any application.

```php
<?php

// Converts n seconds to an HH:MM:SS time stamp
function seconds_to_time($seconds)
{
  $out = '';
  $hours = '';
  $mins = '';
  $secs = '';

  $mins = str_pad(floor($seconds / 60), 2, '0', STR_PAD_LEFT). ':';

  if ($mins > 60)
  {
    $hours = floor($mins / 60). ':';
    $mins = str_pad(($mins - 60), 2, '0', STR_PAD_LEFT). ':';
  }

  $secs = str_pad(floor($seconds % 60), 2, '0', STR_PAD_LEFT);

  return $hours.$mins.$secs;
}

// ------------------------------------------------------------------------

// Returns an array HTML for 3 dropdown boxes for month/day/year
// Optional suffix can be appended to each elements HTML name
function date_dropdown($suffix = '')
{
  $out = array('month', 'day', 'year');
  $months = array(1 => 'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December');

  // Month dropdown
  $out['month'] = "<select name=\"month$suffix\">n";
  foreach ($months as $k => $v)
  {
    $out['month'] .= "<option value=\"". str_pad($k, 2, '0', STR_PAD_LEFT) .'"'.
             (str_pad($k, 2, '0', STR_PAD_LEFT) == date('m') ? ' selected="selected"' : '').
             ">$v</option>n";
  }
  $out['month'] .= "</select>n";

  // Day dropdown
  $out['day'] = "<select name=\"day$suffix\">n";
  for ($i = 1; $i < = 31; $i++)
  {
    $out['day'] .= "<option value=\"". str_pad($i, 2, '0', STR_PAD_LEFT) .'"'.
            ($i == date('d') ? ' selected="selected"' : '').
            ">$i</option>n";
  }
  $out['day'] .= "</select>n";

  // Year dropdown
  $out['year'] = "<select name=\"year$suffix\">n";
  for ($y = 2006; $y <= date('Y'); $y++)
  {
    $out['year'] .= "<option value=\"$y\"".($y == date('Y') ? ' selected="selected"' : '').
            ">$y</option>n";
  }
  $out['year'] .= "</select>n";

  return $out;
}
```
