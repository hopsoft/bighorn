var _ = require("lodash");

Bighorn.debug = true;

if (typeof global === "object") {
  global.self = {};
  global.self.Bighorn = Bighorn;
}

QUnit.module( "Bighorn", {
  beforeEach: function() {
    delete self._gaq;
    delete self._paq;
    delete self.ahoy;
    delete self.ga;
  }
});

var nameSchema = {
  "properties": {
    "name": {
      "enum": [
        "foo",
        "bar",
        "baz"
      ]
    }
  }
};

var typeSchema = {
  "properties": {
    "type": {
      "enum": [
        "foo",
        "bar",
        "baz"
      ]
    }
  }
};

function ahoyMock() {
  var Mock = function () {
    this.track = function(name, eventData) {
      this.name = name;
      this.eventData = eventData;
    };
  };
  return new Mock();
}

function aqMock() {
  var Mock = function () {
    this.push = function(list) {
      this.list = list;
    };
  };
  return new Mock();
}

function gaMock(data) {
  return function (method, type, category, action, label, value) {
    data.method = method;
    data.type = type;
    data.category = category;
    data.action = action;
    data.label = label;
    data.value = value;
  };
}

function validEventData() {
  return {
    name: "example-event",
    type: "test",
    host: "github.com/hopsoft/bighorn",
    target: "github.com/hopsoft/bighorn",
    value: 0.25,
    utm_source: "bighorn-test-suite"
  };
}

QUnit.test( "should attach validation errors when validating multiple schemas with invalid data", function() {
  var result = Bighorn.track(validEventData(), nameSchema, typeSchema);
  ok( _.isArray(result.event_data.validation_errors), "validation errors should be an array" );
  ok( result.event_data.validation_errors.length === 2, "2 validation errors should be present" );
});

QUnit.test( "should pass validation when validating multiple schemas with valid data", function() {
  var data = _.merge(validEventData(), { name: "foo", type: "bar" });
  var result = Bighorn.track(data, nameSchema, typeSchema);
  ok( _.isArray(result.event_data.validation_errors), "validation errors should be an array" );
  ok( _.isEmpty(result.event_data.validation_errors), "validation errors should be empty" );
});

QUnit.test( "should return a valid result when tracking with no args", function() {
  var result = Bighorn.track();
  ok( result, "result should be an object" );
  ok( result.trackers, "result.trackers should be an object" );
  ok( result.trackers._gaq === false, "_gaq should be false" );
  ok( result.trackers._paq === false, "_paq should be false" );
  ok( result.trackers.ahoy === false, "ahoy should be false" );
  ok( result.trackers.ga === false, "ga should be false" );
});

QUnit.test( "should return a valid result when tracking with empty event data", function() {
  var result = Bighorn.track({});
  ok( result, "result should be an object" );
  ok( result.trackers, "result.trackers should be an object" );
  ok( result.trackers._gaq === false, "_gaq should be false" );
  ok( result.trackers._paq === false, "_paq should be false" );
  ok( result.trackers.ahoy === false, "ahoy should be false" );
  ok( result.trackers.ga === false, "ga should be false" );
});

QUnit.test( "should attach validation errors when tracking with empty event data", function() {
  var result = Bighorn.track({});
  ok( result.event_data.validation_errors, "validation errors should be present" );
  ok( result.event_data.validation_errors.length === 6, "6 validation errors should be present" );
});

QUnit.test( "should track with ahoy with partial event data", function() {
  self.ahoy = ahoyMock();
  var event = { name: "test" };
  var result = Bighorn.track(event);
  ok( result.trackers.ahoy, "ahoy should be true even though validation errors are present" );
  ok( result.event_data.validation_errors.length === 5, "5 validation errors should be present" );
});

QUnit.test( "should track with ahoy with valid event data", function() {
  self.ahoy = ahoyMock();
  var eventData = validEventData();
  var result = Bighorn.track(eventData);
  ok( result.trackers.ahoy, "ahoy should be true" );
  ok( result.event_data.validation_errors.length === 0, "no errors should be present" );
  ok( self.ahoy.name === eventData.name );
  ok( self.ahoy.eventData.name === eventData.name );
  ok( self.ahoy.eventData.type === eventData.type );
  ok( self.ahoy.eventData.host === eventData.host );
  ok( self.ahoy.eventData.target === eventData.target );
  ok( self.ahoy.eventData.value === eventData.value );
  ok( self.ahoy.eventData.utm_source === eventData.utm_source );
});

QUnit.test( "should track with _paq with partial event data", function() {
  self._paq = aqMock();
  var event = { name: "test" };
  var result = Bighorn.track(event);
  ok( result.trackers._paq, "_paq should be true even though validation errors are present" );
  ok( result.event_data.validation_errors.length === 5, "5 validation errors should be present" );
});

QUnit.test( "should track with _paq with valid event data", function() {
  self._paq = aqMock();
  var eventData = validEventData();
  var result = Bighorn.track(eventData);
  ok( result.trackers._paq, "_paq should be true" );
  ok( result.event_data.validation_errors.length === 0, "no errors should be present" );
  ok( self._paq.list[0] === "trackEvent" );
  ok( self._paq.list[1] === Bighorn.kvn({ target: eventData.target }) );
  ok( self._paq.list[2] === Bighorn.kvn(eventData) );
  ok( self._paq.list[3] === Bighorn.kvn({ name: eventData.name }) );
  ok( self._paq.list[4] === eventData.value );
});

QUnit.test( "should track with _gaq with partial event data", function() {
  self._gaq = aqMock();
  var event = { name: "test" };
  var result = Bighorn.track(event);
  ok( result.trackers._gaq, "_gaq should be true even though validation errors are present" );
  ok( result.event_data.validation_errors.length === 5, "5 validation errors should be present" );
});

QUnit.test( "should track with _gaq with valid event data", function() {
  self._gaq = aqMock();
  var eventData = validEventData();
  var result = Bighorn.track(eventData);
  ok( result.trackers._gaq, "_gaq should be true" );
  ok( result.event_data.validation_errors.length === 0, "no errors should be present" );
  ok( self._gaq.list[0] === "trackEvent" );
  ok( self._gaq.list[1] === Bighorn.kvn({ target: eventData.target }) );
  ok( self._gaq.list[2] === Bighorn.kvn(eventData) );
  ok( self._gaq.list[3] === Bighorn.kvn({ name: eventData.name }) );
  ok( self._gaq.list[4] === eventData.value );
});

QUnit.test( "should track with ga with partial event data", function() {
  self.ga = gaMock({});
  var event = { name: "test" };
  var result = Bighorn.track(event);
  ok( result.trackers.ga, "ga should be true even though validation errors are present" );
  ok( result.event_data.validation_errors.length === 5, "5 validation errors should be present" );
});

QUnit.test( "should track with ga with valid event data", function() {
  var data = {};
  self.ga = gaMock(data);
  var eventData = validEventData();
  var result = Bighorn.track(eventData);
  ok( result.trackers.ga, "ga should be true" );
  ok( result.event_data.validation_errors.length === 0, "no errors should be present" );
  ok( data.method === "send" );
  ok( data.type === "event" );
  ok( data.category === Bighorn.kvn({ target: eventData.target }) );
  ok( data.action === Bighorn.kvn(eventData) );
  ok( data.label === Bighorn.kvn({ name: eventData.name }) );
  ok( data.value === eventData.value );
});
