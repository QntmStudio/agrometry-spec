import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { Ajv2020 } from 'ajv/dist/2020.js';

const root = new URL('../../', import.meta.url);
const read = (p: string): any => JSON.parse(readFileSync(new URL(p, root), 'utf8'));
const validate = new Ajv2020({ strict: true }).compile(read('schema/v0/observation.schema.json'));

test('valid vectors validate', () => {
  assert.equal(validate(read('test-vectors/valid/minimal.json')), true);
  assert.equal(validate(read('test-vectors/valid/frame-5-bands.json').record), true);
});

test('invalid vectors are rejected', () => {
  for (const f of readdirSync(new URL('test-vectors/invalid/', root))) {
    assert.equal(validate(read(`test-vectors/invalid/${f}`)), false, f);
  }
});
