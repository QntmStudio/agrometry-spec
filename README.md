# agrometry-spec

An open specification for in-field agricultural measurements: how a low-cost
sensor node (e.g. a spectral/NDVI node on LoRaWAN) describes **what it measured,
how it was calibrated and where the data came from**, in a form that researchers,
integrators and platforms can verify independently.

> **Status: v0, draft, not yet validated on real hardware.** Everything may change
> (SemVer `0.y.z`). No interoperability is promised; the design is to be validated
> against a real LoRaWAN pilot before anything is frozen. The reference code and the
> test key are for study and testing only, not for production.

## Why

Existing models are either too heavy for LoRaWAN (SOSA/SSN, SensorML) or too
compact to carry metadata (Cayenne LPP, bare SenML). None covers ground-level
spectral/NDVI measurements with calibration and provenance. This spec fills that
gap by **reusing** SenML, IPSO IDs, SOSA and PROV-O rather than reinventing them.

## What is in scope (v0)

| Component | Description |
|---|---|
| Observation record | Logical JSON record: SenML-style names/units, base time, raw per-band values (up/down channels), integration time, gain, quality flags, schema version |
| Compact binary frame | LoRaWAN-sized frame: type, 32-bit app counter, fixed-resolution measures, battery/panel voltage, internal temperature, reset reason, firmware and calibration IDs, truncated MAC tag |
| Calibration attestation | COSE_Sign1 record: sensor ID, reference (panel / cosine diffuser), geometry, validity window, coefficient version |
| Batch receipt | Signed daily Merkle root, RFC 3161 timestamp, per-measurement inclusion proof |
| Test vectors | Valid and invalid payloads with the expected decoded record |
| Decoders | Payload formatter for TTN and ChirpStack (field decoding; MAC verified in the backend) |
| Mapping | Correspondence to SenML, SOSA and PROV-O |

Out of scope for v0: full SOSA ontology, SensorML 3.0, NGSI-LD, per-measurement
asymmetric signatures, public calibration registry, conformance programme.

## Layout

```
spec/v0/        specification text (record, binary frame, calibration, batch receipt)
reference/      reference encoder/decoder + AES-CMAC (Node): cd reference && npm ci && npm test
decoders/       TTN / ChirpStack payload formatter (ES5)
schema/v0/      JSON Schemas (versioned $id)
test-vectors/   valid / invalid examples
LICENSES/       full license texts
```

## Licensing

See [LICENSE.md](LICENSE.md). Spec text: CC BY 4.0. Schemas and code: Apache-2.0.
Contributions are accepted under the [DCO](CONTRIBUTING.md); there is no CLA.

All content is original work of the maintainers. The reference implementation and the
decoders have no runtime dependencies (Node built-ins only); `ajv` (MIT) is a
dev dependency used by the tests. Standards
(SenML, COSE, RFC 3161/9162, SOSA, PROV-O) are referenced, not copied.

## Governance

See [GOVERNANCE.md](GOVERNANCE.md). The name and logo are not covered by any
license granted here.
