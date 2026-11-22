# Contributing

## Developer Certificate of Origin

We use the [DCO](https://developercertificate.org/) instead of a CLA. Sign off every commit:

```
git commit -s
```

which appends `Signed-off-by: Your Name <you@example.com>`. The address in your
commits is public: use your GitHub `noreply` address if you do not want to expose
a personal one (`git config user.email ID+USERNAME@users.noreply.github.com`).

## Branches and releases

- `main` holds released drafts only and is the default branch. Nobody pushes to it
  directly.
- `development` is the integration branch. Open your pull request against it.
- Work on a short-lived branch named `feat/...`, `fix/...`, `docs/...` or `chore/...`,
  branched from `development`. Pull requests into `development` are squash-merged.
- A release is a pull request from `development` to `main` (merge commit), followed
  by a `vMAJOR.MINOR.PATCH` tag on `main` and an entry in `CHANGELOG.md`.

## Guidelines

- Conventional Commits, one concern per commit.
- Spec changes come with schema changes and test vectors.
- Prefer reusing SenML / IPSO / SOSA / PROV-O terms over inventing new ones.
- Code, identifiers and comments in English.
