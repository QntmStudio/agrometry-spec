import { timingSafeEqual } from 'node:crypto';
import { aesCmac } from './cmac.js';

const TAG_LEN = 8;
const QUALITY = ['saturated', 'low-light', 'dirty-window'];
const RESET = ['unknown', 'power-on', 'watchdog', 'brown-out', 'software', 'pin'];

const macInput = (devEui, body) => Buffer.concat([devEui, body]);
const tagOf = (key, devEui, body) => aesCmac(key, macInput(devEui, body)).subarray(0, TAG_LEN);

/** Encode a frame. `f` uses raw wire values (see spec section 2). */
export function encodeFrame(f, { key, devEui }) {
  const n = f.bands.length;
  const body = Buffer.alloc(18 + 5 * n);
  body.writeUInt8(f.version << 4 | 1, 0);
  body.writeUInt32BE(f.counter, 1);
  body.writeUInt8(f.gainCode, 5);
  body.writeUInt16BE(f.integration, 6);
  body.writeUInt8(f.quality, 8);
  body.writeUInt8(n, 9);
  f.bands.forEach((b, i) => {
    const o = 10 + 5 * i;
    body.writeUInt8(b.id, o);
    body.writeUInt16BE(b.up, o + 1);
    body.writeUInt16BE(b.down, o + 3);
  });
  const s = 10 + 5 * n;
  body.writeUInt8(f.vbat, s);
  body.writeUInt8(f.vpanel, s + 1);
  body.writeInt8(f.temp, s + 2);
  body.writeUInt8(f.reset, s + 3);
  body.writeUInt16BE(f.fwId, s + 4);
  body.writeUInt16BE(f.calId, s + 6);
  return Buffer.concat([body, tagOf(key, devEui, body)]);
}

/** Decode a frame into an observation record. Throws on malformed input. */
export function decodeFrame(frame, { key, devEui, receivedAt }) {
  if (frame.length < 26 + 5) throw new Error('frame too short');
  if (frame[0] >> 4 !== 0 || (frame[0] & 0x0f) !== 1) throw new Error('unsupported frame version/type');
  const n = frame[9];
  if (n < 1 || frame.length !== 26 + 5 * n) throw new Error('bad length');
  const body = frame.subarray(0, frame.length - TAG_LEN);
  const expected = tagOf(key, devEui, body);
  const tagVerified = timingSafeEqual(expected, frame.subarray(frame.length - TAG_LEN));
  const q = frame[8];
  const quality = QUALITY.filter((_, i) => q & (1 << i));
  const integrationMs = frame.readUInt16BE(6) / 10;
  const gain = 2 ** frame[5];
  const e = [];
  for (let i = 0; i < n; i++) {
    const o = 10 + 5 * i;
    for (const [channel, off] of [['up', 1], ['down', 3]]) {
      const entry = { n: `band-${frame[o]}`, v: frame.readUInt16BE(o + off), u: 'count', channel, integrationMs, gain };
      if (quality.length) entry.quality = quality;
      e.push(entry);
    }
  }
  const s = 10 + 5 * n;
  e.push({ n: 'vbat', v: round(2 + frame[s] * 0.01), u: 'V' });
  e.push({ n: 'vpanel', v: round(2 + frame[s + 1] * 0.01), u: 'V' });
  e.push({ n: 'temp', v: frame.readInt8(s + 2) * 0.5, u: 'Cel' });
  return {
    schemaVersion: '0.0.0',
    bn: `urn:dev:eui:${devEui.toString('hex')}`,
    bt: receivedAt,
    counter: frame.readUInt32BE(1),
    calibrationId: String(frame.readUInt16BE(s + 6)),
    firmwareId: String(frame.readUInt16BE(s + 4)),
    resetReason: RESET[frame[s + 3]] ?? 'unknown',
    tagVerified,
    e,
  };
}

const round = (v) => Math.round(v * 100) / 100;
