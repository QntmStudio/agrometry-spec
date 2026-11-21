# 2. Compact binary frame

> Draft. Sizes and field widths are proposals, not validated on real LoRaWAN payloads.

The frame is the LoRaWAN application payload of one uplink. All multi-byte
integers are **big-endian**. The frame carries no timestamp: time is the network
receive time (see section 1).

## Layout

| Offset | Size | Field | Notes |
|---|---|---|---|
| 0 | 1 | `ver_type` | High nibble: frame version (`0`). Low nibble: type (`1` = spectral observation) |
| 1 | 4 | `counter` | uint32 application counter, +1 per frame, never reused for a key |
| 5 | 1 | `gain_code` | gain = 2^code |
| 6 | 2 | `integration` | uint16, units of 0.1 ms |
| 8 | 1 | `quality` | bit0 saturated, bit1 low-light, bit2 dirty-window |
| 9 | 1 | `n_bands` | 1..255 |
| 10 | 5 x n | bands | per band: `band_id` u8, `up` u16, `down` u16 (raw counts) |
| 10+5n | 1 | `vbat` | V = 2.00 + x * 0.01 (2.00 to 4.55 V) |
| 11+5n | 1 | `vpanel` | same scale as `vbat` |
| 12+5n | 1 | `temp` | int8, units of 0.5 C (-64.0 to 63.5 C) |
| 13+5n | 1 | `reset` | 0 unknown, 1 power-on, 2 watchdog, 3 brown-out, 4 software, 5 pin |
| 14+5n | 2 | `fw_id` | uint16 firmware ID |
| 16+5n | 2 | `cal_id` | uint16 calibration ID |
| 18+5n | 8 | `tag` | truncated AES-CMAC, see below |

Total size: 26 + 5n bytes. Example: 5 bands = 51 bytes.

`band_id` is an index into the band table of the calibration attestation
identified by `cal_id` (nominal centre wavelength, bandwidth). v0 defines no
global band registry.

## Application-layer MAC

`tag` = first 8 bytes of AES-128-CMAC (RFC 4493) over
`DevEUI (8 bytes) || frame bytes before tag`, with a per-node 128-bit key.

This gives end-to-end integrity between node and backend, independent of the
network server. Limits, stated plainly:

- The MAC is **symmetric**: only the holder of the key can verify it. It does not
  prove anything to a third party; third-party trust comes from the batch receipt
  and its timestamp (section 4).
- A truncated 64-bit tag is a trade-off for payload size, not a validated choice.
- No hash chain between frames in v0. Counter gaps reveal losses; chaining
  tags is an open question.
- Key provisioning and rotation are not specified in v0.

## Payload size

The frame has to fit the application payload limit at the data rate in use. The
LoRaWAN regional limit at the lowest EU868 data rate should be checked against
the Regional Parameters document before relying on 51 bytes.
