# Governance

## Current model

Single maintainer organisation (initial stewards). Decisions are taken in public
issues and pull requests; the maintainers have the final say while the spec is `0.y.z`.

## Versioning

SemVer. While the major version is `0`, any element may change in any release.
Schemas carry versioned `$id` URIs. Breaking changes are listed in `CHANGELOG.md`.

## Changes

1. Open an issue describing the problem and, where possible, evidence (a real device, a payload capture).
2. Submit a pull request with spec text, schema changes and test vectors together.
3. A change is merged when a maintainer approves it and the test vectors pass.

## Neutrality and exit path

The goal is a neutral standard, not a product. If independent adopters appear
(a university, a consortium, a platform), the maintainers commit to discuss
transferring stewardship of the spec and its name to a neutral foundation.

## Review at 12 months

Success indicators: independent implementations, pilot partners using the schema,
dataset access requests, actual maintenance hours. If there is no external adopter
after 12 months, maintenance effort is reduced and the repository is kept as
technical documentation.
