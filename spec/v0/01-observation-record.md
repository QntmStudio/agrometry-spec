# 1. Observation record (logical JSON)

> Draft. Unvalidated against a real pilot.

The observation record is the decoded, backend-side representation of one
measurement frame. It follows SenML conventions (RFC 8428): a base name (`bn`),
a base time (`bt`) and a list of entries (`e`; SenML uses `e` in its legacy form
and a bare array in the current one; v0 uses a named array to allow extra
top-level fields). Schema: [`schema/v0/observation.schema.json`](../../schema/v0/observation.schema.json).

| Field | Meaning |
|---|---|
| `schemaVersion` | Version of this schema, `0.0.0` for the draft |
| `bn` | Sensor identifier, `urn:dev:eui:<16 hex>` |
| `bt` | Base time, seconds since epoch. **Network receive time**: nodes have no real-time clock |
| `counter` | 32-bit application counter from the frame |
| `calibrationId`, `firmwareId` | IDs carried in the frame, resolved by the calibration attestation |
| `resetReason` | Last reset cause |
| `tagVerified` | Whether the application-layer MAC was verified by the decoder |
| `e[]` | Entries: raw band counts per channel, battery/panel voltage, internal temperature |

Raw values are kept as counts. Conversion to reflectance or NDVI is a downstream
step that needs the calibration attestation (section 3); the record never carries
derived indices as if they were measurements.

Quality flags: `saturated`, `low-light`, `dirty-window`.
