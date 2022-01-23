---
title: AIM Web Presence API
---

So I've been dabbling with AIM's Web Presence API -- which basically allows
developers to get info on a particular AIM user.

This all started from me seeing how Facebook was able to scrape a user's
status message. After a little googling, I've come up with this function. Note
-- you'll need to enter your own AIM API key and screen name to use it.

It generates an IM link with a title (popup) equivalent to my current AIM
status. If I'm offline, there is no IM link, and it states that I am not
online.

I've searched high and low for something like this. I might be mistaken, but I
believe this to be the only method of doing this that is publicly available.
Perhaps they're all buried under hundreds of Google search pages.

At any rate -- here it is. Feel free to use/modify it at will.

```php
<?php

function aim_presence() {
	// See http://developer.aim.com/ref_api for details on AIM's API

	// This is the URL to a special XML file produced by AIM.. replace with your AIM API key
	$url = "http://api.oscar.aol.com/presence/get?k=AIM_API_KEY&f=xml&t=joshnevercraft&statusMsg=1";

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$data = curl_exec($ch);
	curl_close($ch);

	$xml = new SimpleXMLElement($data);

	$out = '<span class="aim-presence">';

	$state = $xml->data->users->user[0]->state;
	$status = strip_tags( $xml->data->users->user[0]->statusMsg );
	$icon = $xml->data->users->user[0]->presenceIcon;

	if ( $state == 'away' || $state == 'online' ) {
		$out .= '<a href="aim:goim?screenname=Joshnevercraft&amp;message=Follow+the+white+rabbit" title="'.
				$status.'">josh nevercraft</a> '.
				'( '. ucfirst( $state ) .' )';
	} else {
		$out .= "josh nevercraft ( Offline )";
	}
	return $out. '</span>';
}

echo aim_presence();

?>
```
