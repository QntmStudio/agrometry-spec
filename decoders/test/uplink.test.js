import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const { decodeUplink } = createRequire(import.meta.url)('../uplink.js');
const vector = JSON.parse(readFileSync(new URL('../../test-vectors/valid/frame-5-bands.json', import.meta.url)));
const bytes = Array.from(Buffer.from(vector.frameHex, 'hex'));

test('decodes the published frame vector', () => {
  const { data, errors } = decodeUplink({ bytes, fPort: 1 });
  assert.equal(errors, undefined);
  assert.equal(data.counter, vector.wire.counter);
  assert.equal(data.gain, 4);
  assert.equal(data.integrationMs, 100);
  assert.deepEqual(data.quality, ['low-light']);
  assert.equal(data.bands.length, 5);
  assert.deepEqual(data.bands[0], { id: 1, up: vector.wire.bands[0].up, down: vector.wire.bands[0].down });
  assert.equal(data.vbat, 3.6);
  assert.equal(data.vpanel, 3.4);
  assert.equal(data.temp, 22);
  assert.equal(data.resetReason, 'power-on');
  assert.equal(data.firmwareId, 1);
  assert.equal(data.calibrationId, 7);
  assert.equal(data.tag, vector.frameHex.slice(-16));
});

test('decoder agrees with the reference record on every band value', async () => {
  const { data } = decodeUplink({ bytes, fPort: 1 });
  for (const b of data.bands) {
    const up = vector.record.e.find((e) => e.n === `band-${b.id}` && e.channel === 'up');
    const down = vector.record.e.find((e) => e.n === `band-${b.id}` && e.channel === 'down');
    assert.equal(up.v, b.up);
    assert.equal(down.v, b.down);
  }
});

for (const [name, input, msg] of [
  ['empty', { bytes: [] }, 'too short'],
  ['wrong version', { bytes: [0x11].concat(bytes.slice(1)) }, 'unsupported'],
  ['truncated', { bytes: bytes.slice(0, 50) }, 'bad length'],
]) {
  test(`rejects ${name}`, () => {
    const r = decodeUplink(input);
    assert.match(r.errors[0], new RegExp(msg));
  });
}
