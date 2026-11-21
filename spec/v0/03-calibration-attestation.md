# 3. Calibration attestation

> Draft.

A calibration attestation is a COSE_Sign1 object (RFC 9052) whose payload is a
CBOR map (CDDL below). It binds a `cal_id` to the information needed to turn raw
counts into physical values.

```cddl
attestation = {
  1 => bstr .size 8,      ; sensor DevEUI
  2 => uint,              ; cal_id (matches frame cal_id)
  3 => reference,         ; calibration reference
  4 => geometry,
  5 => [ + band ],        ; band table
  6 => tstr,              ; coefficient version
  7 => uint,              ; valid from (epoch s)
  8 => uint,              ; valid until (epoch s)
}
reference = { 1 => "white-panel" / "cosine-diffuser", ? 2 => tstr }  ; id of the reference
geometry  = { 1 => float, 2 => float }                                ; view zenith/azimuth, degrees
band      = { 1 => uint, 2 => float, ? 3 => float }                   ; band_id, centre nm, bandwidth nm
```

Rules:

- A dataset is only interpretable with at least one reference measurement
  (panel or cosine diffuser); the field is mandatory. Reference and geometry
  fields are borrowed from the Geoscience Australia NSD metadata standard.
- Signing keys and per-unit coefficients stay with the issuer; the attestation
  carries only the coefficient **version**.
- No public registry of attestations in v0.
