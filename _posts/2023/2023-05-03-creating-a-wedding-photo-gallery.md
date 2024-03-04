---
title: "Creating a wedding photo gallery"
date: "Wed May 3 16:00:33 -0400 2023"
category: dev
tags: [wedding, jekyll, ruby, photos]
---

We got pictures back from [our photographer][1] a while ago---so naturally
I had to create a [photo gallery website][2]. This stuff is still way too
hard...

All told, my wedding photo gallery is 6.5gb. That means my go-to, GitHub
Pages, won't work for hosting as they only allow 1gb projects.

I'm embarrassed to admit, my beautiful wife was the one who had to remind me
[where I work][3]---I _am_ web hosting. So, I spun up a cheap VPS and got
things setup.

I'm not good enough as a designer to come up with a design on my own. So, I
bought the Aurel theme on Themeforest (a different place I used to work).

First up, I needed to create thumbnails for all the photos. I threw together a
quick and dirty ruby script to do just that:

```ruby
#!/usr/bin/env ruby
require "mini_magick"

ARGV.each do |file|
  destination = "#{file}.tmp"

  puts "Resizing #{file} ..."

  MiniMagick::Image.open(file).tap do |img|
    img.resize "500x500"
    img.strip
    img.quality 88
    img.write destination
  end

  File.unlink file
  File.rename destination, file
end
```

Next, I created a script to generate YAML files for the fullsize and thumbnail
images:

```ruby
#!/usr/bin/env ruby
require "mini_magick"
require "yaml"

output = {}

thumbs = ARGV.delete "--thumbs"

Dir["photos/**/*.jpg"].sort.each do |path|
  next if thumbs && path =~ /thumbs/
  next if !thumbs && path !~ /thumbs/

  i = MiniMagick::Image.new(path)

  name = File.basename(path)

  type = case path
         when /wedding/
           "wedding"
         when /engagement/
           "engagement"
         when /booth/
           "booth"
         end

  info = {
    "width"  => i.width,
    "height" => i.height,
    "path"   => "/#{path}",
    "name"   => name,
    "type"   => type,
  }

  output[name] = info
end

puts output.to_yaml
```

I generate two files with this:

```sh
resize-photos --thumbs > _data/thumbs.yml
resize-photos > _data/photos.yml
```

These files can be looped over in my theme with `site.data.thumbs` or
`site.data.photos`.

I won't go in depth on the theme setup. The interesting part is the photo
galleries.

There are 3 galleries: engagement photos, wedding photos, and photo booth
photos.

The Jekyll template for the engagement photos page looks like:

```liquid
{%- raw -%}
---
layout: gallery
permalink: /engagement/
paginate: false
title: Engagement Photos
---

{% assign photos = site.data.photos | where_exp: "item", "item.type == 'engagement'" %}
{% for img in photos %}
  {% include photo-grid-item.html type="engagement" path=img.path name=img.name width=img.width height=img.height index=forloop.index0 %}
{% endfor %}
{% endraw %}
```

That uses the `_data` files created above to loop through each photo for the
engagement gallery. Each photo then renders `photo-grid-item.html`:

```liquid
{%- raw -%}
{% assign thumb = site.data.thumbs[include.name] %}
{% assign name = "" %}
{% assign name_a = include.name | remove: ".jpg" | split: "-" %}
{% for s in name_a %}
{% assign n = s | capitalize %}
{% unless forloop.last %}
{% assign n = n | append: " " %}
{% endunless %}
{% assign name = name | append: n %}
{% endfor %}
<div class="grid-item element grid_b2p">
  <div class="grid-item-inner">
    <a class="aurel_pswp_slide aurel_drag_protect aurel_dp aurel_no_select" href="{{ include.path }}" data-size="{{ include.width }}x{{ include.height }}" data-count="{{ include.index }}">
      <img src="{{ thumb.path }}" class="grid_thmb" alt="{{ name }}"/>

      <div class="grid-item-content">
        <h4>{{ name }}</h4>
      </div>

      <div class="grid-item-overlay aurel_js_bg_color" data-bgcolor="rgba(17,17,17,0.3)"></div>
    </a>

    <div class="aurel-img-preloader"></div>
  </div>
</div>
{% endraw %}
```

Since there are 6.5gb of photos in total, I also threw in this Jekyll plugin
at `_plugins/photos_symlinker.rb` that runs when I use `jekyll build`:

```ruby
require "fileutils"

Jekyll::Hooks.register :site, :post_write do |site|
  source = "#{site.source}/_photos"
  dest   = "#{site.dest}/photos"

  FileUtils.ln_s source, dest, force: true

  Jekyll.logger.info "photo-symlinker", "symlinked #{source} to #{dest}"
end
```

To deploy the generated site I have a `Rakefile` with a few tasks:

```ruby
desc "Build and deploy the site to production"
task deploy: :build do
  sh "rsync -P -auv --exclude downloads --copy-links --delete -e ssh _site/ gallery.chrysandjosh.wedding:/var/www/html/"
end

desc "Build the site"
task :build do
  sh "jekyll build"
end

task :generate_downloads do
  require "yaml"

  %w[booth engagement wedding].each do |type|
    Dir.chdir "photos/" do
      files = Dir["#{type}/*.jpg"]

      sh "rm -f ../downloads/#{type}.zip"
      sh "zip -r ../downloads/#{type}.zip #{files.join(" ")}"
    end
  end
end
```

I manually run `rake generate_downloads` to create zip files of each gallery
in a `downloads/` directory. Then `rake deploy` builds the site with Jekyll
and uses rsync to copy the `_site/` directory to my server (I skip the
downloads directory).

That about covers everything!

This was a fun project to work on because it used to be a lot harder to
generate image galleries with Jekyll. These days you can actually do it
without data files as I outlined in a [different post][4] but I wanted to be
able to edit the YAML files to be able to skip certain photos.

[1]: https://kevindemassio.com
[2]: https://gallery.chrysandjosh.wedding
[3]: https://www.a2hosting.com
[4]: {% post_url 2022/2022-06-26-jekyll-image-galleries-in-2022 %}
