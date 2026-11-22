import { createCipheriv } from 'node:crypto';

function aesBlock(key: Buffer, block: Buffer): Buffer {
  const c = createCipheriv('aes-128-ecb', key, null);
  c.setAutoPadding(false);
  return Buffer.concat([c.update(block), c.final()]);
}

function dbl(b: Buffer): Buffer {
  const out = Buffer.alloc(16);
  for (let i = 0; i < 16; i++) out[i] = ((b[i]! << 1) & 0xff) | (i < 15 ? b[i + 1]! >> 7 : 0);
  if (b[0]! & 0x80) out[15] = out[15]! ^ 0x87;
  return out;
}

const xor = (a: Buffer, b: Buffer): Buffer => Buffer.from(a.map((v, i) => v ^ b[i]!));

/** AES-128-CMAC (RFC 4493). */
export function aesCmac(key: Buffer, msg: Buffer): Buffer {
  const k1 = dbl(aesBlock(key, Buffer.alloc(16)));
  const k2 = dbl(k1);
  const n = Math.max(1, Math.ceil(msg.length / 16));
  const complete = msg.length > 0 && msg.length % 16 === 0;
  let last: Buffer = msg.subarray((n - 1) * 16);
  if (complete) last = xor(last, k1);
  else {
    const padded = Buffer.alloc(16);
    last.copy(padded);
    padded[last.length] = 0x80;
    last = xor(padded, k2);
  }
  let x: Buffer = Buffer.alloc(16);
  for (let i = 0; i < n - 1; i++) x = aesBlock(key, xor(x, msg.subarray(i * 16, i * 16 + 16)));
  return aesBlock(key, xor(x, last));
}
