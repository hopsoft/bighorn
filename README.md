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

When emitting events to Google Analytics and Piwik, event data is converted to [KVN](https://github.com/hopsoft/kvn) format. This allows underlying data structure to be serialized, transmitted, and persisted in a way that is cross-platform and language agnostic. For more information, see the [KVN repository](https://github.com/hopsoft/kvn).

## Usage

```html
<script type="text/javascript" src="/path/to/bighorn.min.js"></script>
<script type="text/javascript">

Bighorn.track({
name:       "click",
type:       "affiliate-link",
host:       "my-site.com",
target:     "great-offer.com",
value:      7.50,
utm_source: "affiliate_partner"
});

</script>
```

## Tracking Events

### Clicks

It's useful to capture as much information as possible when a click event occurs.
For example, I typically track the following data points.
_Feel free to add additional data points as your usecase dictates._

- `name`    - the name of the event (can be custom)
- `trigger` - the DOM event that triggered the event
- `host`    - the page (without querystring) hosting the link
- `target`  - the page (without querystring) the click is sending traffic to
- `type`    - the type of link (i.e. banner-ad, text-ad, etc...)
- `partner` - the partner the link is sending traffic to
- `value`   - the anticipated revenue from the event

> __Important:__ How the data points are structured when tracked with Bighorn will impact the type of reports & visualizations available in tools like Google Analytics & Piwik.

Here's an example link & Bighorn tracking optimized for Piwik reporting.

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
  var data = {
    name:    'click',
    trigger: event.type,
    host:    window.location.hostname + window.location.pathname,
    target:  event.target.hostname + event.target.pathname,
    type:    $el.data('type'),
    partner: $el.data('partner'),
    value:   Number($el.data('value') || 0)
  };

  Bighorn.track(data);
});
```

> __Note:__ The value was calculated with a formula assuming
>           a $20 price point for the book,
>           a 10% revenue share on gross sales,
>           & anticipating that 1% of clicks result in a purchase:
>           `20 * 0.1 * 0.01`
>           This formula will need to be updated regularly to ensure it reflects accurate anticipated revenue.

> __Important:__ You'll need to build custom formulas to determine click value based on your own performance data.

## Development
To build Bighorn, you will need [webpack](https://github.com/webpack/webpack). To run tests, you will need an HTTP server like [http-server](https://github.com/indexzero/http-server)

### Setup

```
git clone git@github.com:hopsoft/bighorn.git
cd bighorn
npm install
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
