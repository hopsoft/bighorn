# Bighorn

A standardized interface for event tracking.

## Overview

Bighorn exposes a simple API for emitting events to multiple backends.
Think of it as a poor man's version of [segment.io](https://segment.com/)

Bighorn auto-detects backends by checking for their variable names on the global namespace. i.e. window, self

### Supported Backends

* [Google Analytics](https://developers.google.com/analytics)
* [Piwik](https://developer.piwik.org/)
* [Ahoy](https://github.com/ankane/ahoy)

__Note__: Bighorn formats structured data as [KVN](https://github.com/hopsoft/kvn)
when emitting events to some backends to capture the richest dataset possible.

## Basic Usage

```html
<script type="text/javascript" src="/path/to/bighorn.min.js"></script>
<script type="text/javascript">

Bighorn.track({
  name: "click",
  type: "affiliate-link",
  host: "my-site.com/example",
  target: "great-offer.com/example",
  value: 7.50,
  utm_source: "traffic-source"
});

</script>
```

## Advanced Usage

It's possible to validate with additional JSON schemas.

```html
<script type="text/javascript" src="/path/to/bighorn.min.js"></script>
<script type="text/javascript">

// schema to restrict event names
var nameSchema = {
  "properties": {
    "name": {
      "enum": [
        "click",
        "mouseup"
      ]
    }
  }
};

var eventData = {
  name: "click",
  type: "affiliate-link",
  host: "my-site.com/example",
  target: "great-offer.com/example",
  value: 7.50,
  utm_source: "traffic-source"
};

Bighorn.track(data, nameSchema);

// note: track accepts N-number of additional schemas to validate with
// Bighorn.track(data, nameSchema, otherSchema, extraSchema, ...);
</script>
```

### Setup

```
git clone git@github.com:hopsoft/bighorn.git
cd bighorn
npm install
```

### Build

```sh
make
```

### Test

```sh
npm test
```

```sh
npm start
open http://localhost:8080/test
```
