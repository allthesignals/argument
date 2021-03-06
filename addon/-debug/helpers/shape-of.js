import { assert } from '@ember/debug';
import { get } from '@ember/object';
import { resolveValidator, makeValidator } from '../utils/validators';

export default function shapeOf(shape) {
  assert(`The 'shapeOf' helper must receive exactly one shape`, arguments.length === 1);
  assert(`The 'shapeOf' helper must receive an object to match the shape to, received: ${shape}`, typeof shape === 'object');
  assert(`The object passed to the 'shapeOf' helper must have at least one key:type pair`, Object.keys(shape).length > 0);

  let typeDesc = [];

  for (let key in shape) {
    shape[key] = resolveValidator(shape[key]);

    typeDesc.push(`${key}:${shape[key]}`);
  }

  return makeValidator(`shapeOf({${typeDesc.join()}})`, (value) => {
    for (let key in shape) {
      if (shape[key](get(value, key)) !== true) {
        return false;
      }
    }

    return true;
  });
}
