# Michelle Ngo Portfolio

SvelteKit 2 portfolio deployed to GitHub Pages at https://wolfwdavid.github.io/michelle_ngo_two/

## One-time GitHub repo settings (manual)

After cloning and pushing this repo to `wolfwdavid/michelle_ngo_two`, configure
the following in the GitHub UI. They cannot be set via code.

### Settings → Pages

- **Source:** GitHub Actions (NOT "Deploy from a branch")
- **Enforce HTTPS:** enabled
- **Custom domain:** none (using default `*.github.io` for v1)

### Settings → Branches → main → Branch protection rule

- [x] Require a pull request before merging
- [x] Require status checks to pass before merging
  - [x] Require branches to be up to date before merging
  - Status check: `lint-and-build` (the job in `.github/workflows/deploy.yml`)
- [x] Do not allow bypassing the above settings

### Note

First deploy after enabling Pages may take 5–10 minutes to become reachable.
Subsequent deploys propagate within ~1 minute. The CI verify job retries for
~3 minutes; if the first deploy's verify step fails, wait 10 minutes and
re-run the workflow manually.

## Local development

```bash
nvm use            # Node 22 LTS (per .nvmrc)
npm install
npm run dev        # http://localhost:5173/
npm run build      # outputs build/
npm run preview    # serves build/ locally
npm run check      # type check
npm run lint
```
