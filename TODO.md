- [] Rename `Schema` to `Type`
- [] Rename `TypeContainer` to `Schema`
- [] Remove `Type#type`
- [] Seperate sugar from the schema evaluator
- [] Make type inferer modular via middleware

## Rename `Schema` to `Type`
The name schema is leftover from when the code was largely based on Mongooses' schema/type system. 
Schematic, however, does not differientiate between types and schemas (all schemas are types, all types are schemas) to allow for
easier embedding (mongoose has trouble with embedded schemas). Type is a much clearer name for the base class (as it stands Number inherits from Schema, it'd be nicer if it inherited from a `Type` object instead)

## Rename `TypeContainer` to `Schema`
Schematics type container class is more akin to the Schema from mongoose. It keeps tracks of types, handles inferring types from schema object trees, etc.
Types handle casting and validation, Schemas will only deal with managing types

## Extendable/Modular Schema Parser/Evaluator
I'm working towards seperating the syntax sugar from the schema evaluator. This is just some pseudocode to keep me on track

```javascript
var types = require('schematic/types')
types.use(function (type, options) {
  // magical code that evaluates [String] -> {type: 'Array', items: 'String'}
  // or {foo: String} -> {type: Document, schema: {foo: 'String'}}
  // or maybe even ['foo', 'bar', 'baz'] -> {type: 'String', enum: ['foo', 'bar', 'baz']}
})
```
Schema.middleware = []

Schema.infer 
  object = typeof object in ['function', 'array', 'Schema:Object'] ? {type: object} : object
  explicit = object.type && !object.type.type
  type = explicit ? object.type : object
  options = explicit ? keys(object).filter(name -> name !== 'type').each(key -> options[key] = object[key]) : {}

  if type is Schema 
  // run middleware
  each(middleware, fn -> type = fn(type, options) || type)
  if typeof type == 'string' || (type.name && type = type.name)
    return types(type)(options, key, parent)
  else 
   return type(options, key, parent)
 ``````
