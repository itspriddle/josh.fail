---
layout: post
title: IPTV Project
---

The project I mentioned a few weeks back with IMDB lookups, will be my
official ITT Tech Fest project.

Basically, the software will be designed to be dropped on any machine running
AMP (Apache, MySQL, PHP), and will be a way for users to organize DVD rips.

Movie files (in the test they are H.263 encoded .mp4s) are FTP'd into a
predetermined 'movies' folder. I chose this method over an HTTP/PHP uploader,
because it simply isn't practical to conduct ~1gb uploads over an HTTP stream.
Just a note: you could use any method to upload files: SCP, FTP, NFS, Samba -
or if you're running on the same box you encode with, its even easier. [and if
i have to explain _how_ to copy files on a localhost, you need to go
away and pretend like you've never heard of 'computers']

Once this happens, the user (or Admin) is required to log into a web based
control panel to perform various actions on the movie file before it is
officially ready for the end product (which I'll get into in just a bit).

Once the Admin has logged in, the following happens:

* If there are any FILES which are not in the DATABASE, they must be NEW
* Tell the Admin how many NEW FILES there are, and prompt him to GET IMDBID

Once the Admin attempts to GET IMDBIDs, the following happens:

* Compile a list of all NEW FILES
* We're using (Version type) to designate special version movies, ex Alien
  (Extended Cut)
* Unfortunately, IMDB does not put this into their movie titles, so a search
  on the above string would NOT return Alien
* So, to combat this, we'll STRIP VERSION from the title, ex:
  strip_version("Alien (Extended Cut)") = Alien
* Once we have a workable title, we're going to QUERY IMDB for possible
  matches.

QUERY IMDB:

* This will take workable titles from all NEW MOVIES and search IMDB for 5
  possible matches.
* Give the ADMIN a list of matches, allow him to pick 1 of them, or manually
  enter an IMDBID (which he'd have to manually lookup, of course).
* Once ADMIN has made selections, all of this information is uploaded to the
  DATABASE with a special flag saying "Hey, we have the IMDBID, but thats it.
  Give me more info"

LOOKUP DETAILS:

* This takes every movie that has an IMDBID in the database, but we DO NOT
  have extended details for (such as year, runtime, genre), and looks up that
  information from IMDB
* If the genre retrieved is not in our local database, add it
* All of the information retrieved is inserted into the DATABASE

Once all this has been done, we officially have all of the information we
need. Using the IMDBID, you can actually pull this information directly from
their site and format it however you need. The reason I'm using a database, is
(really just that I wanted to get better with MySQL, but..) it allows us to
perform quicker searches on content, by title, year, genre, or anything else
we decide to store locally.

Now, all of this leads way to the front end (which I don't have much done with
yet :() This will produce a "pretty list" of all the content in the movies
folder, retrieve movie information on the fly from IMDB, and allow the user to
search content in a variety of ways. Once they have chosen a movie, they'll
get a special MRU for the particular movie, that can be opened in a media
player.

A lot of work for a fancy link... but its going to be absolutely brilliant.

More to come on this and many other issues on a day off near you.
