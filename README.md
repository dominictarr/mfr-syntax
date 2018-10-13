# mfr-syntax

A more better query language for map-filter-reduce,
actually, this also replaces the AST and thus interpreter,
so it's not even a rewrite it's a reinvention inspired by map-filter-reduce.
But, it has the same goals, but a better means to achive them.

## development status

The following documentation explains the _benefits_ of this redesign - there is enough code
there to prove this works, but it's not fully hooked up to streams and io just yet.
So unfortunatel, it cant be used right now. Writing this up because I'm gonna put it
down for a while and then come back to this later.

## motivation & thought process

The first thing you'll see is there is a proper syntax instead of just
some JSON thing.

For example to query all new ssb threads posted within the last week:

```
filter(value.{content: {type:eq("post"), root: isUndefined(), timestamp: gt(1538695853960) }})
```
which you can see forms is quite similar to the old way, but not as  cluttered by {}'s
```
[{"$filter": {"value": {
  "content": {
    "type": "post",
    "root": {"$is": "undefined"}
  },
  "timestamp": {"$gt": 1538695853960}
}}}]
```
which has 6 pairs of opening and closing curly braces! (if you also count ()'s then the new
way has the same number (it looses one around filter, but gains one around post) however
having two mixed style of brackets is easier to follow. Also, the new way has only one pair
of quotes vs 10! most importantly it fits neatly on a single line!

But this isn't just about a more succinct query language, it's about new abilities.
two problems have been on my mind: how to do join queries, and how to express reduces.

### reduces

map-filter-reduce has always had a reduce thing, but I don't think it got used very often.
On the other hand, doing hand-written reduces via flumeview-reduce was quite handy!
For example, ssb-friends uses a reduce to model the follow graph, skipping the boiler plate,
the reduce function looks like this:

```
var from = data.value.author
var to = data.value.content.contact
var value =
  data.value.content.following === true ? 1 :
  data.value.content.following === false ? -2 :
  data.value.content.blocking || data.value.content.flagged ? -1
  : null

if(isFeed(from) && isFeed(to) && value != null) {
  g[from] = g[from] || {}
  g[from][to] = value
}
return g
```

to express that as `mfr` we will soon (TODO) be able to do this:

```
filter(value.content.{
  type: eq("contact"), contact: isFeed(),
  following: or(isBoolean(), .blocking.isBoolean()
})
map({
  from: value.author,
  to: value.content.contact,
  value:
    //here I am taking care to fully express the legacy quirks because that is what really
    //determines this actually usable
    value.content.following.isBoolean() ?
    value.content.following ? 1 : -2 : or(value.content.blocking, value.content.flagged) ? -1 : null
  })
.filter(value.neq(null))
.reduce(set(.from, set(.to, .value)), {}) //this is where the magic happens!
```

The important thing here isn't that it's less code, but that it's _expressable as a query_
which means that clients can just do a query instead of creating a plugin!

## "." operator

I should probably talk about how the `.` thing works. it's kinda the star of the show here really.
The above code examples look relatively like ordinary object oriented code, lots of chaining.
it looks like `foo.bar.eq(2)` is calling bar's `eq` method, but eq is not actually a property
of bar. actually `.` is more like pipe `|` or "compose" operator. foo.bar.eq(2) could be read
as `eq(get(get(this, 'foo'), 'bar'), 2)`. It looks like property access, because `.{name}`
accesses the `get` function.

### "." isn't property access it's _compose_: pass the value on the left into the right.

`foo.bar.eq(2)`

we take the input (some piece of data) and apply several
transformations: getting foo from it, getting bar from it, and checking that it's equal to 2.

This also means the code generally reads from _left to right, top to bottom_.

(while there are some right to left written languages, I don't know of any bottom to top languages!)
Should it be strange that code often reads from inside to outside?

### .. means "parent" as in unix directories

Sometimes it's necessary to refer to two things in the same operation. For example,
to check that two fields are equal (or the many ways to combine or compare things)

`.bar` means to instead of taking bar from the current input, take bar from it's parent.
`..bar` means take bar from it's parent's parent. so say we have an object:

`{foo: 1, bar:2, baz: 2}` then `foo.eq(.bar)` checks wether foo and bar is equal.
foo.eq(1) takes the object {} and gets the `foo` property, and passes that into `eq`
as if it's `eq(foo, 1)`. But comparing foo to a static value isn't what we need,
we need to compare to another value on our object, `bar` but to do that we need to step back
past foo, to the {} then to bar. so `foo.eq(.bar)` is how we do that.

now that there is a way to refer to multiple values, it's possible to have joins!

## joins

if you wanted to retrive new posts and their replies, currently you'd do a filter
query (as used in the first example) and then on the client side, do additional
queries to get to get those messages, filtered by the messages who's root is the key
in our thread.

```
filter(value.content.{type: eq("post"), root: isUndefined()})
.map({
  key, value, timestamp,
  replies: source("log").filter(value.content.root.eq(....key))
})
```

`source` (TODO, implement) takes a string, because there could be many async
lookups. it would be easy to just refer to any other query or view this way!

### note to self:

hmm, writing up this documentation, I realize that accessing previous items this way is gonna
be a bit tricky. maybe the answer is that functions should be able to be called directly.
so instead of `foo.eq(.bar)` you could do `eq(foo, bar)` then that join query would be
`filter(eq(.key, value.content.root))` which means you don't have to carefully figure out how
many ...'s to have.

Also, I realize that the parent operator only needs to be allowed at the start of a pipeline,
in the middle or end is silly! (since it just throws away those values)

## Abstract Syntaxt Tree (AST)

Joins were something that I always wanted in `map-filter-reduce` but wasn't sure how to do them.
eventually, I realized the real limiting factor was that the old style didn't have a good
way of expressing operations with multiple arguments. fixing that involved redesigning
the AST. in the old design, the queries are written directly in the AST, hence the awkwardness.
That AST was designed to be relatively tollerable to hand write, but this reduced it's expressiveness.

The new AST is more lispy:

```
{name: operation_name, value: [arguments...]}
``
which are recursively nested.

## License

MIT


