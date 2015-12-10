# Bighorn

A standardized interface for event tracking.

### Supported Backends

* [Google Analytics](https://developers.google.com/analytics)
* [Piwik](https://developer.piwik.org/)
* [Ahoy](https://github.com/ankane/ahoy)

## Usage

```html
<script type="text/javascript" src="bighorn.js"></script>
<script type="text/javascript">
Bighorn.track("category", "action", "label", 1);
</script>
```

## Development

### Get started

```
git clone ...
cd bighorn
npm install
```

### Build the `bighorn.js` script

```sh
./node_modules/webpack/bin/webpack.js
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
```

