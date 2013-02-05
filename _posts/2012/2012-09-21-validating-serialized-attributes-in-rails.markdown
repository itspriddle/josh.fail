---
layout: default
date: "Fri Sep 21 17:35:55 -0400 2012"
title: "Validating Serialized Attributes in Rails"
---

ActiveRecord provides a `serialize` method, which can be used to transparently
store a Hash, etc in a single database column.

```ruby
class Post < ActiveRecord::Base
  serialize :meta, Hash
end

p = Post.new
p.meta = { author: 'Josh' }
```

I needed a way to perform validations on specific values of a serialized
column. There wasn't a clear way of doing this, but I eventually came across
[ActiveRecord::Store](http://api.rubyonrails.org/classes/ActiveRecord/Store/ClassMethods.html)
which made it easy.

```ruby
class Post < ActiveRecord::Base
  store :meta, :author

  validates :author, presence: true
end

p = Post.new
p.valid? #=> false
p.errors[:author] #=> ["can't be blank"]
p.author = 'Josh'
p.valid? #=> true

p = Post.new meta: { author: 'Josh' }
p.valid? #=> true
```

Easy!
