---
layout: post
title: Kate Project Manager Plugin on Kubuntu
categories:
  - linux
---
It was a pain, but this ought to work:

    # apt-get install kde-devel automake1.9
    # tar -vjxf /home/priddle/Desktop/projectmanager-0.1.2-24.tar.bz2 -C /usr/src/
    # cd /usr/src/projectmanager/
    # ./configure --prefix=/usr
    # make
    # make install

I just did a clean install and I'm determined to keep it that way. So I removed these packages after:

    cervisia cvs gettext-kde hspell kappfinder kapptemplate kbabel kbugbuster
    kcachegrind kde-core kde-devel kdebase kdebase-dev kdelibs4-dev kdesdk
    kdesdk-kfile-plugins kdesdk-kio-plugins kdesdk-misc kdesdk-scripts kmtrace
    kompare kpager kpersonalizer kspy ktip kuiviewer kunittest libacl1-dev
    libapr1 libaprutil1 libarts1-dev libartsc0-dev libasound2-dev libaspell-dev
    libattr1-dev libavahi-qt3-dev libbz2-dev libcvsservice0 libidn11-dev
    libjasper-dev libkonq4-dev liblua50-dev liblualib50-dev libogg-dev
    libopenexr-dev libpcre3-dev libpcrecpp0 libsasl2-dev libssl-dev libsvn1
    libtiff4-dev libtiffxx0c2 libvorbis-dev libxml2-utils libxslt1-dev lua50
    poxml qt3-designer subversion umbrello
