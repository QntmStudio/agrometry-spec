"use strict";
// Payload formatter for The Things Stack (TTN) and ChirpStack.
// Decodes the frame defined in spec/v0/02-binary-frame.md.
//
// Network servers do not hold the node's application-layer MAC key, so the tag
// is returned as hex and NOT verified here. Verification happens in the
// backend (see reference/src/frame.ts).
//
// Written in TypeScript and compiled to ES5 into decoders/uplink.js (committed), because
// the network servers run plain JavaScript. Do not edit the .js by hand: `npm run build:decoder`.
var QUALITY = ['saturated', 'low-light', 'dirty-window'];
var RESET = ['unknown', 'power-on', 'watchdog', 'brown-out', 'software', 'pin'];
function u16(b, o) {
    return (b[o] << 8) | b[o + 1];
}
function u32(b, o) {
    return ((b[o] << 24) >>> 0) + (b[o + 1] << 16) + (b[o + 2] << 8) + b[o + 3];
}
function i8(v) {
    return v > 127 ? v - 256 : v;
}
function round2(v) {
    return Math.round(v * 100) / 100;
}
function decodeUplink(input) {
    var b = input.bytes;
    if (!b || b.length < 31) {
        return { data: {}, errors: ['frame too short'] };
    }
    if (b[0] >> 4 !== 0 || (b[0] & 0x0f) !== 1) {
        return { data: {}, errors: ['unsupported frame version/type'] };
    }
    var n = b[9];
    if (n < 1 || b.length !== 26 + 5 * n) {
        return { data: {}, errors: ['bad length'] };
    }
    var quality = [];
    for (var i = 0; i < QUALITY.length; i++) {
        if (b[8] & (1 << i))
            quality.push(QUALITY[i]);
    }
    var bands = [];
    for (var k = 0; k < n; k++) {
        var o = 10 + 5 * k;
        bands.push({ id: b[o], up: u16(b, o + 1), down: u16(b, o + 3) });
    }
    var s = 10 + 5 * n;
    var tag = '';
    for (var t = b.length - 8; t < b.length; t++) {
        tag += ('0' + b[t].toString(16)).slice(-2);
    }
    return {
        data: {
            counter: u32(b, 1),
            gain: Math.pow(2, b[5]),
            integrationMs: u16(b, 6) / 10,
            quality: quality,
            bands: bands,
            vbat: round2(2 + b[s] * 0.01),
            vpanel: round2(2 + b[s + 1] * 0.01),
            temp: i8(b[s + 2]) * 0.5,
            resetReason: RESET[b[s + 3]] || 'unknown',
            firmwareId: u16(b, s + 4),
            calibrationId: u16(b, s + 6),
            tag: tag,
        },
    };
}
// Allow `require` in tests without breaking plain-script loading by the network servers.
if (typeof module !== 'undefined')
    module.exports = { decodeUplink: decodeUplink };
