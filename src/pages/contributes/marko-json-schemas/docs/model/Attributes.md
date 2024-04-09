---
stoplight-id: mtcws2x6vbtgr
tags: [model, docs]
---

# Attributes

Attributes can be defined for a specific tag or once for all tags in a library.

An attribute can be defined by simply specifying it's type:

<!--
type: tab
title: Example
-->

```json
{
  "attributes": {
    "variant": "string" 
  }
}
```

<!--
type: tab
title: Schema
-->

```json json_schema
$ref: "../../schemas/models/attribute.string.json"
```

<!-- type: tab-end -->

or by specifying an object which allows the customization of various aspects of the attribute:


<!--
type: tab
title: Example
-->

```json
{
  "attributes": {
    "variant": {
      "type": "string",
      "description": "Specifies the component variant",
      "enum": [
        "primary",
        "secondary"
      ]
    }
  }
}
```

<!--
type: tab
title: Schema 
-->

```json json_schema
$ref: "../../schemas/models/attribute.object.json"
```

<!-- type: tab-end -->