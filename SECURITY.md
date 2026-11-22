# Security policy

This repository holds a specification and a reference implementation. Please report
weaknesses in the design (for example in the MAC construction or the receipt
format) or in the reference code privately, using GitHub's
"Report a vulnerability" feature on this repository, instead of a public issue.

The v0 specification is a draft: some limits are already documented in
`spec/v0/02-binary-frame.md` (symmetric MAC, truncated tag, no key management).
Do not use the draft or its test key in production.

Only the latest draft on `main` is supported. Reports are acknowledged on a
best-effort basis; there is no bug bounty.
