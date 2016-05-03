module.exports = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "Bighorn Event",
  "type": "object",
  "description": "Schema that describes a Bighorn event.",
  "required": [
    "name",
    "value",
    "utm_source"
  ],
  "properties": {
    "name": {
      "description": "The name of the event",
      "type": "string"
    },
    "trigger": {
      "description": "The event trigger. For example, the DOM event.",
      "type": "string"
    },
    "type": {
      "description": "The event type (an additional qualifier to help distinguish events).",
      "type": "string"
    },
    "info": {
      "description": "Additional event information (placeholder for custom event data).",
      "type": "string"
    },
    "host": {
      "description": "The page or API endpoint (without scheme & querystring) where the event was triggered.",
      "type": "string"
    },
    "target": {
      "description": "The page or API endpoint (without scheme & querystring) where traffic or data is being sent.",
      "type": "string"
    },
    "partner": {
      "description": "The name of the partner receiving the traffic or data.",
      "type": "string"
    },
    "value": {
      "description": "The event value.",
      "type": "number"
    },
    "utm_source": {
      "description": "The attributable source of the event (may be different than the current visit).",
      "type": "string"
    },
    "utm_campaign": {
      "description": "The attributable campaign (may be different than the current visit).",
      "type": "string"
    },
    "utm_medium": {
      "description": "The attributable medium (may be different than the current visit).",
      "type": "string"
    },
    "utm_content": {
      "description": "The attributable content (may be different than the current visit).",
      "type": "string"
    },
    "utm_term": {
      "description": "The attributable term (may be different than the current visit).",
      "type": "string"
    },
    "validationErrors": {
      "description": "Validation errors if any.",
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  }
};
