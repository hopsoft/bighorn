# Bighorn

A standardized interface for event tracking.

## Overview

A single/simple API for collecting metrics for various backends.
Think of it as a poor man's version of [segment.io](https://segment.com/)

Bighorn auto-detects supported backends by checking for their known/common variables in the global namespace.

### Supported Backends

* [Google Analytics](https://developers.google.com/analytics)
* [Piwik](https://developer.piwik.org/)
* [Ahoy](https://github.com/ankane/ahoy)

## Notable Features

### KVN

__KVN__ *(pronounced kevin)* means __Key Value Notation__.
It's similar to JSON but is more limited in scope & can be used to store simple data structures as strings.

#### Rules

* Data structures can only be 1 level deep
* Only primitive types can be used for keys & values
* Colons & semicolons are prohibited from use in keys & values
* Keys are sorted alphabetically

#### Example

```javascript
var data = { d: "example with whitespace", a: true, c: "example", b: 1 };

// would be represented as
"a:true; b:1; c:example; d:example with whitespace;"
```

## Usage

```html
<script type="text/javascript" src="/path/to/bighorn.min.js"></script>
<script type="text/javascript">

// standard use
Bighorn.track("foo", "bar", "baz", 1);

// use with kvn compliant objects
Bighorn.track({category: "foo"}, {action: "bar"}, {label: "baz"}, 2);

</script>
```

## Tracking Events

### Clicks

It's useful to capture as much information as possible when a click event occurs.
For example, I typically track the following data points.

- `name`    - the name of the event (can be custom)
- `trigger` - the DOM event that triggered the event
- `host`    - the page hosting the link
- `target`  - the domain the click is sending traffic to
- `type`    - the type of link (i.e. banner-ad, text-ad, etc...)
- `partner` - the partner (if any) the link is sending traffic to
- `value`   - the anticipated revenue from the event

> __Important:__ How the data points are structured when tracked with Bighorn will impact the type of reports & visualizations available in tools like Google Analytics & Piwik.

Here's an example that structures an HTML link & its Bighorn tracking that is optimized for Piwik reporting.

```html
<a id='amazon-link' href='http://www.amazon.com/dp/0596517742/?tag=YOUR_ASSOCIATES_ID'
   data-type='affiliate-link'
   data-partner='Amazon'
   data-value='.02'>Buy JavaScript the Good Parts</a>
```

```javascript
// example in jquery for brevity
$('#amazon-link').on('mouseup', function (event) {
  var $el = $(event.target);
  var action = {
    name:    'click',
    trigger: event.type,
    host:    window.location.host,
    target:  event.target.hostname,
    type:    $el.data('type'),
    partner: $el.data('partner'),
    value:   Number($el.data('value') || 0)
  };
  var category = { host: action.host };
  var label = { name: action.name };

  Bighorn.track(category, action, label, action.value);
});
```

> __Note:__ The value was calculated with a formula.
>           A $20 price point for the book, a 10% revenue share on gross sales, & anticipating that 1% of clicks result in a purchase:
>           `20 * 0.1 * 0.01`
>           This formula will need to be updated regularly to ensure it reflects accurate anticipated revenue.

> __Important:__ You'll need to build custom formulas to determine click value based on your own performance data.

## Development

### Setup

```
git clone git@github.com:hopsoft/bighorn.git
cd bighorn
npm install -g webpack expose-loader http-server
```

### Build

```sh
webpack
UGLIFY=true webpack
```

### Test

```sh
http-server
```

```sh
open http://localhost:8080/test
```

```javascript
// in the browser console
Bighorn.track("foo", "bar", "baz", 1);
Bighorn.track({category: "foo"}, {action: "bar"}, {label: "baz"}, 2);
```

