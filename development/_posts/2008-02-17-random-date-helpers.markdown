---
layout: post
title: Random Date Helpers
---
I wrote these as helpers for a project I'm making with CodeIgniter, but you can use them in any application.

{% highlight php %}

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
      $months = array(1 =&gt; 'January', 'February', 'March', 'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December');

      // Month dropdown
      $out['month'] = "&lt;select name="month$suffix"&gt;n";
      foreach ($months as $k =&gt; $v)
      {
        $out['month'] .= "&lt;option value="". str_pad($k, 2, '0', STR_PAD_LEFT) .'"'.
                 (str_pad($k, 2, '0', STR_PAD_LEFT) == date('m') ? ' selected="selected"' : '').
                 "&gt;$v&lt;/option&gt;n";
      }
      $out['month'] .= "&lt;/select&gt;n";

      // Day dropdown
      $out['day'] = "&lt;select name="day$suffix"&gt;n";
      for ($i = 1; $i &lt; = 31; $i++)
      {
        $out['day'] .= "&lt;option value="". str_pad($i, 2, '0', STR_PAD_LEFT) .'"'.
                ($i == date('d') ? ' selected="selected"' : '').
                "&gt;$i&lt;/option&gt;n";
      }
      $out['day'] .= "&lt;/select&gt;n";

      // Year dropdown
      $out['year'] = "&lt;select name="year$suffix"&gt;n";
      for ($y = 2006; $y &lt;= date('Y'); $y++)
      {
        $out['year'] .= "&lt;option value="$y"".($y == date('Y') ? ' selected="selected"' : '').
                "&gt;$y&lt;/option&gt;n";
      }
      $out['year'] .= "&lt;/select&gt;n";

      return $out;
    }
{% endhighlight %}
