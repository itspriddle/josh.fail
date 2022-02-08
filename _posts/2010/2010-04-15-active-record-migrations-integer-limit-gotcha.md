---
date: Thu Apr 15 21:59:14 -0400 2010
title: ActiveRecord Migrations - integer limit gotcha
category: dev
redirect_from:
- /blog/2010/active-record-migrations-integer-limit-gotcha.html
- /dev/2010/active-record-migrations-integer-limit-gotcha.html
---

I work on a few apps that deal with phone numbers. I usually store these
as `bigint(11)` in MySQL. My migrations always seemed to ignore this.

    t.integer :phone_number, :limit => 11

Tonight, I found the following method in ActiveRecord that explains this
weirdness:

    # Maps logical Rails types to MySQL-specific data types.
    def type_to_sql(type, limit = nil, precision = nil, scale = nil)
      return super unless type.to_s == 'integer'

      case limit
      when 1; 'tinyint'
      when 2; 'smallint'
      when 3; 'mediumint'
      when nil, 4, 11; 'int(11)'  # compatibility with MySQL default
      when 5..8; 'bigint'
      else raise(ActiveRecordError, "No integer type has byte size #{limit}")
      end
    end

To fix this, try `t.integer :phone_number, :limit => 5` instead.

It seems that (at least with the MySQL adapter), limit actually specifies
the number of *bytes* that are using in the column, rather than the display
limit.

Hope that helps someone else.
