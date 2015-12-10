# Bighorn

A standardized interface for event tracking.

### Supported Backends

* [Google Analytics](https://developers.google.com/analytics)
* [Piwik](https://developer.piwik.org/)
* [Ahoy](https://github.com/ankane/ahoy)

## Usage

```html
<script type="text/javascript" src="/path/to/bighorn.min.js"></script>
<script type="text/javascript">
Bighorn.track("foo", "bar", "baz", 1);
Bighorn.track({category: "foo"}, {action: "bar"}, {label: "baz"}, 2);
</script>
```

## Development

### Get started

```
git clone git@github.com:hopsoft/bighorn.git
cd bighorn
npm install
```

### Build the `bighorn.js` scripts

```sh
./node_modules/webpack/bin/webpack.js
UGLIFY=true ./node_modules/webpack/bin/webpack.js
```

### Test in a browser

```sh
./node_modules/http-server/bin/http-server
```

```sh
open http://localhost:8080/test
```

```javascript
// in the browser console
Bighorn.track("foo", "bar", "baz", 1);
Bighorn.track({category: "foo"}, {action: "bar"}, {label: "baz"}, 2);
```

