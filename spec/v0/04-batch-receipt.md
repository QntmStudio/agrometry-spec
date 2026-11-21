# 4. Batch receipt

> Draft.

A batch receipt lets a third party check that a frame existed unchanged at a given time.

1. **Leaf**: `SHA-256(0x00 || DevEUI || frame bytes)` for each accepted frame of the day.
2. **Tree**: Merkle tree with the hashing rules of RFC 9162 section 2.1 (`0x01` prefix for interior nodes).
3. **Root**: the daily root is signed as a COSE_Sign1 and submitted for an RFC 3161 timestamp.
4. **Inclusion proof**: per frame, as in RFC 9162 section 2.1.3.

Receipt contents: date, tree size, root hash, issuer signature, RFC 3161 token.

What this does **not** prove: that the sensor measured the physical world correctly,
or that the issuer did not drop frames before inclusion. Legal effect of the
timestamp (e.g. under eIDAS) is outside this specification and no effect is promised.
