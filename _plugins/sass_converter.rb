require 'sass'
require File.expand_path('../../stylesheets/bourbon/lib/bourbon.rb', __FILE__)

module Jekyll
  class SassConverter < Converter
    safe true
    priority :low

    def matches(ext)
      ext =~ /scss/i
    end

    def output_ext(ext)
      ".css"
    end

    def convert(content)
      begin
        puts "Performing Sass Conversion."
        engine = Sass::Engine.new(content,
          :cache      => false,
          :syntax     => :scss,
          :load_paths => ["./stylesheets/"]
        )
        engine.render
      rescue StandardError => e
        puts "!!! SASS Error: " + e.message
      end
    end
  end
end
