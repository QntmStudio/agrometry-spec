# Decoders

`uplink.js` is a payload formatter exposing `decodeUplink(input)`, the signature
used by The Things Stack (TTN) and ChirpStack JavaScript codecs. Paste it as the
uplink formatter of a device profile.

- It decodes fields only. The application-layer MAC tag is returned as `tag` (hex)
  and is **not** verified: network servers do not hold the node key.
- Verification and conversion to the observation record are done by the backend,
  see `reference/frame.js`.
- ES5 syntax, no dependencies.

Submission to the TTN Device Repository is not done; its contribution terms
should be read first.
