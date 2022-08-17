---
title: "Efficient Pagination Using Deferred Joins"
date: "Tue Aug 16 12:23:36 -0400 2022"
category: links
link: https://aaronfrancis.com/2022/efficient-pagination-using-deferred-joins
---

TIL that pagination via `LIMIT` and `OFFSET` (i.e. how most of us are doing
it) is not very performant for large datasets. Instead, you can use a
"deferred join" to fetch just the ID from the table and then an outer query
has fewer IDs to work with.

I've used this approach in the past with Rails to avoid loading a lot of
records into memory, but never specifically with pagination.

[Aaron][1] has more details.

[1]: {{ page.link }}
