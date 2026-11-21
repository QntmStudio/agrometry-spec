import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { aesCmac } from '../cmac.js';
import { decodeFrame, encodeFrame } from '../frame.js';

const hex = (s) => Buffer.from(s.replace(/\s/g, ''), 'hex');
const key = hex('2b7e151628aed2a6abf7158809cf4f3c');
const devEui = hex('0102030405060708');

test('AES-CMAC matches RFC 4493 vectors', () => {
  assert.equal(aesCmac(key, Buffer.alloc(0)).toString('hex'), 'bb1d6929e95937287fa37d129b756746');
  assert.equal(aesCmac(key, hex('6bc1bee22e409f96e93d7e117393172a')).toString('hex'), '070a16b46b4d4144f79bdd9dd04a287c');
  assert.equal(
    aesCmac(key, hex('6bc1bee22e409f96e93d7e117393172aae2d8a571e03ac9c9eb76fac45af8e5130c81c46a35ce411')).toString('hex'),
    'dfa66747de9ae63030ca32611497c827',
  );
});

const vector = JSON.parse(readFileSync(new URL('../../test-vectors/valid/frame-5-bands.json', import.meta.url)));

test('decodes the published frame vector', () => {
  const rec = decodeFrame(hex(vector.frameHex), { key, devEui, receivedAt: vector.receivedAt });
  assert.deepEqual(rec, vector.record);
  assert.equal(vector.frameHex.length / 2, 51);
});

test('encode round-trips to the published vector', () => {
  assert.equal(encodeFrame(vector.wire, { key, devEui }).toString('hex'), vector.frameHex);
});

test('tampered frame is flagged, not accepted', () => {
  const f = hex(vector.frameHex);
  f[12] ^= 0x01;
  assert.equal(decodeFrame(f, { key, devEui, receivedAt: 0 }).tagVerified, false);
});

test('rejects malformed frames', () => {
  assert.throws(() => decodeFrame(hex('00'), { key, devEui, receivedAt: 0 }), /too short/);
  const f = hex(vector.frameHex);
  assert.throws(() => decodeFrame(f.subarray(0, 50), { key, devEui, receivedAt: 0 }), /bad length/);
  f[0] = 0x11;
  assert.throws(() => decodeFrame(f, { key, devEui, receivedAt: 0 }), /unsupported/);
});
