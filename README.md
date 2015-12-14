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

## Development

### Get started

```
git clone git@github.com:hopsoft/bighorn.git
cd bighorn
npm install -g webpack expose-loader http-server
```

### Build the `bighorn.js` scripts

```sh
webpack
UGLIFY=true webpack
```

### Test in a browser

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

