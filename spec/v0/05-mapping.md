# 5. Mapping to existing standards

> Draft. This is a design proposal, not a conformance claim.

The spec reuses existing vocabularies instead of defining new ones. Where it does
define something, this table says why.

| This spec | SenML (RFC 8428) | SOSA / SSN (W3C) | PROV-O (W3C) |
|---|---|---|---|
| Record `bn` | base name `bn` | `sosa:Sensor` identifier | `prov:Agent` (sensor) |
| Record `bt` | base time `bt` | `sosa:resultTime` | `prov:generatedAtTime` |
| Entry `n` | name `n` | `sosa:ObservableProperty` | - |
| Entry `v` | value `v` | `sosa:hasSimpleResult` | - |
| Entry `u` | unit `u` | `qudt:unit` or UCUM code in the result | - |
| Entry `integrationMs`, `gain` | no equivalent: out-of-band metadata | `sosa:Procedure` parameters | - |
| Entry `quality` | no equivalent | `ssn-system` quality / `sosa:Result` annotations | - |
| `calibrationId` | no equivalent | `sosa:usedProcedure` (the calibration) | `prov:wasInfluencedBy` |
| Batch receipt | no equivalent | - | `prov:Entity` with `prov:wasAttributedTo` the issuer |

## Notes

- SenML states that accuracy and statistical metadata travel out of band (RFC 8428).
  `integrationMs`, `gain`, `quality` and the calibration reference are exactly that
  metadata; v0 carries them in the record instead of out of band.
- Units use UCUM-style codes where one exists (`Cel`, `V`); `count` is used for raw counts.
- A JSON-LD context that makes the record a valid SOSA observation is **not**
  provided in v0. Whether it is worth the weight on constrained links is an open question.
- IPSO / LwM2M object IDs for spectral bands are unresolved (see the README of this folder).
