# Specification v0 (draft)

1. [Observation record](01-observation-record.md)
2. [Compact binary frame](02-binary-frame.md)
3. [Calibration attestation](03-calibration-attestation.md)
4. [Batch receipt](04-batch-receipt.md)

Still to write: mapping to SenML / SOSA / PROV-O.

Open design questions (unvalidated, to be settled by a pilot):

- Real overhead of the truncated MAC on LoRaWAN payloads; hash chaining.
- Key provisioning and rotation.
- Which IPSO IDs cover spectral bands and NDVI.
- Global band registry vs per-attestation band table.
