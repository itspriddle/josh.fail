---
layout: page
title: TextMate Rsync bundle
---
This is a little TextMate bundle I wrote to let you use SSH/rsync to upload your website.

See the [README](http://github.com/itspriddle/tm-rsync/blob/master/README.md) for installation/usage
or [fork it](http://github.com/itspriddle/tm-rsync/).

### Installation ###

    git clone git://github.com/itspriddle/tm-rsync.git \
      ~/Library/Application\ Support/TextMate/Bundles/rsync.tmbundle
    osascript -e 'tell app "TextMate" to reload bundles'

### Setup ###
To get going, setup these variables in your TM project:

![Variable Setup](/images/tm-rsync/setup.png)

### Usage ###
When you're ready, run **&#8963;+&#8984;+r**. If everything looks good in the results,
remove the `--dry-run` option and run **&#8963;+&#8984;+r** again.

### Caveats ###
You **must** have a .tmproj setup to use this.

### Download ###
<div class="download">
  <a href="http://github.com/itspriddle/tm-rsync/zipball/master" style="border:0!important">
    <img border="0" width="90" src="http://github.com/images/modules/download/zip.png" />
  </a>
  <a href="http://github.com/itspriddle/tm-rsync/tarball/master">
    <img border="0" width="90" src="http://github.com/images/modules/download/tar.png" />
  </a>
</div>
