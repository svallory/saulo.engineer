import * as fs from 'fs';
import * as yaml from 'yaml';
import * as path from 'path';
import type { JsonObjectExpression, ObjectLiteralExpression } from 'typescript';

/**
 * Removes specified properties from an object.
 *
 * When `shallow` is `false` (the default), it will recursively remove
 * the properties from nested objects.
 *
 * @param obj - The object to remove properties from.
 * @param properties - An array of property names to remove.
 * @param shallow - Whether to remove just own properties (true) or own and inherited (false). Defaults to false.
 */
function removeProperties(
  obj: Record<string, any>,
  properties: string[],
  shallow = false,
) {
  if (!obj) return obj;

  if (shallow) {
    for (const prop of properties) {
      delete obj[prop];
    }
  } else {
    for (const key of Object.keys(obj)) {
      if (properties.includes(key)) {
        delete obj[key];
      } else if (typeof obj[key] === "object") {
        removeProperties(obj[key], properties, false);
      }
    }
  }

  return obj
}

/**
 * Recursively updates the value of `property` in place,
 * by applying the `transform` function to it
 *
 * @param obj - The object to remove properties from.
 * @param property - The name of the property to update.
 * @param transform - A function that transforms the property value
 * @returns the obj receive
 */
function transformProperty(
  obj: Record<string, any>,
  property: string,
  transform: (value: any, path: string[], rootObj: Record<string, any>) => any,
): Record<string, any> {

  const transformDeep = (obj: Record<string, any>, path: string[]) => {
    if (!obj) return obj;

    if (property in obj) {
      obj[property] = transform(obj[property], path, obj);
    }

    for (const key in obj) {
      if (typeof obj[key] === "object") {
        path.push(key)
        transformDeep(obj[key], path);
      }
    }

    return obj
  }

  return transformDeep(obj, []);
}

type SchemaTransformFn = (schema: Record<string, any>) => Record<string, any>;

const BASE_URI = 'https://saulo.engineer/contributes/marko-js/schemas'

const transformations: SchemaTransformFn[] = [
  // remove x-stoplight keys
  s => removeProperties(s, ['x-stoplight']),
  // replace $ref to Yaml by reference to json
  s => transformProperty(s, '$ref', ref => ref.replace('.yaml', '.json')),
  // make $refs absolute
  s => transformProperty(s, '$ref', (ref: string) =>
    ref.startsWith('/') ? `${BASE_URI}${ref.replace('.json', '')}` : ref),
]

// Function to convert YAML file to JSON and save it to schemas directory
function convertYamlToJson(srcFilePath: string) {
  try {
    const yamlContent = fs.readFileSync(srcFilePath, 'utf8');
    let jsonData = yaml.parse(yamlContent);

    jsonData = transformations.reduce((schema, f) => f(schema), jsonData)

    const jsonFilePath = `schemas/${path.relative('src', srcFilePath)}`.replace(/\.yaml$/, '.json');

    fs.mkdirSync(path.dirname(jsonFilePath), { recursive: true });
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonData, null, 2), 'utf8');
    console.log(`Converted and saved: ${jsonFilePath}`);
  } catch (error) {
      console.error(`Error converting file: ${srcFilePath}`, error);
  }
}

// Function to process all YAML files in a directory
function processDirectory(directory: string) {
    const files = fs.readdirSync(directory, { withFileTypes: true });
    files.forEach(file => {
        const fullPath = path.join(directory, file.name);
        if (file.isDirectory()) {
            processDirectory(fullPath);
        } else if (file.isFile() && fullPath.endsWith('.yaml')) {
            convertYamlToJson(fullPath);
        }
    });
}

// Function to start monitoring YAML files in the src/ folder
function watchDirectory(directory: string) {
    fs.readdir(directory, { withFileTypes: true }, (err, files) => {
        if (err) throw err;

        files.forEach(file => {
            const fullPath = path.join(directory, file.name);
            if (file.isDirectory()) {
                watchDirectory(fullPath);
            } else if (file.isFile() && fullPath.endsWith('.yaml')) {
                fs.watch(fullPath, (eventType, filename) => {
                    if (eventType === 'change') {
                        console.log(`Detected change in: ${fullPath}`);
                        convertYamlToJson(fullPath);
                    }
                });
            }
        });
    });
}

// Convert all YAML files initially
console.log('Converting all YAML files in src/ directory...');
processDirectory('src');

// Start watching the 'src/' directory
console.log('Watching for YAML file changes in the src/ directory...');
watchDirectory('src');