require "jekyll-paginate-v2"

# Exclude posts with categories archive, vault, or an archive attribute set
Jekyll::PaginateV2::Generator::PaginationModel.prepend Module.new {
  def paginate(template, config, site_title, all_posts, all_tags, all_categories, all_locales)
    all_posts.reject! do |post|
      %w(archive vault).include?(post["category"].to_s) || post["archive"]
    end

    super
  end
}
