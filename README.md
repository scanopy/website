# scanopy.net

Marketing website for [Scanopy](https://scanopy.net) — SvelteKit + Tailwind, fully prerendered static site (`@sveltejs/adapter-static`). The docs sub-site in `docs/` is built separately and copied into `build/docs` by `npm run build`. Deploys on push to `main`.

```sh
npm install       # also installs docs/ dependencies
npm run dev       # dev server
npm run build     # full production build (site + docs)
```

## Form Monitoring

The public lead-capture forms are the inbound channel for the highest-value deals and have silently broken in production more than once (most recently June 2026: the `/commercial` "Request a Quote" form did nothing on click, with no error shown). A weekly Playwright suite submits each form on the **live site** end to end so a broken form is caught within a week instead of by a frustrated prospect.

- Specs live in `e2e/`, shared helpers in `e2e/helpers.ts`, config in `playwright.config.ts`.
- CI: `.github/workflows/form-monitor.yml` — every Monday 06:00 UTC, plus manual runs via the Actions tab (_Form Monitor_ → _Run workflow_).
- On failure the workflow goes red (GitHub emails the repo owner) **and** opens a GitHub issue labeled `form-monitor` (or comments on the existing open one). The Playwright report with screenshots and traces is attached to the run as an artifact.

### Coverage

Every form found on the site is listed here. Both forms submit to Brevo (`sibforms.com`) via `src/lib/brevo.ts` — there is no server-side form handling in this repo.

| Form                                                      | Page tested   | Spec                        | Real submission?       |
| --------------------------------------------------------- | ------------- | --------------------------- | ---------------------- |
| Contact modal — "Request a Quote" (the June 2026 failure) | `/commercial` | `e2e/contact-modal.spec.ts` | yes                    |
| Contact modal — Enterprise "Request Information"          | `/pricing`    | `e2e/contact-modal.spec.ts` | yes                    |
| Contact modal — Self-Hosted "Contact Us"                  | `/` (home)    | `e2e/contact-modal.spec.ts` | yes                    |
| Newsletter signup (footer, sitewide)                      | `/` (home)    | `e2e/newsletter.spec.ts`    | attempted — see caveat |

The contact modal is one component with three separate page-level trigger wirings; a page-specific JS error can break one page while the others keep working, so each path submits for real.

Each weekly run creates **3 real Brevo contact inquiries and 1 newsletter attempt** (double that in the worst case, since CI retries a failed test once).

**Newsletter caveat:** the newsletter form has reCAPTCHA v3 enforcement enabled in Brevo, and automated browsers always score too low to pass — verified July 2026 that this is score-based bot protection, not a config mismatch (Brevo's own hosted form uses the same site key and the same `submit` action as `src/lib/brevo.ts`). The newsletter spec therefore verifies everything up to that boundary: the form renders, clicking Subscribe fires the POST (catching the "click does nothing" failure mode), Brevo receives and parses the submission, and the UI gives the user feedback. It cannot confirm that a real human's subscription is accepted — worth a quick manual subscribe check if the form is ever suspect. If Brevo ever accepts the automated submission, the spec asserts the full success UI as well.

### Sentinel convention — keeping test data out of the lead list

Every submission the suite makes is marked so it can be filtered everywhere downstream. **Downstream filters key on these exact values — don't change them casually** (they live in `e2e/helpers.ts`):

- **Email:** `formtest+YYYYMMDD@scanopy.net` (e.g. `formtest+20260705@scanopy.net`)
- **First name / last name / company:** `AUTOMATED TEST`
- **Use-case message:** `AUTOMATED TEST - weekly production form monitor. Please ignore.`

Suggested filters:

- **Brevo:** a segment or automation matching _EMAIL contains `formtest+`_ (or _FIRSTNAME equals `AUTOMATED TEST`_) → auto-blocklist or periodically bulk-delete. This also keeps test contacts out of any workflows/sequences.
- **Gmail:** filter `to:(formtest+)` → skip inbox, archive. Newsletter double-opt-in confirmations go to wherever `formtest@scanopy.net` routes — make sure that alias exists (or accept the bounce).

Brevo hosted forms have no test mode, so real submissions are intentional: the point is exercising the production code path end to end.

### Running locally

```sh
npm run test:forms          # headless
npm run test:forms:headed   # watch it happen
```

**Warning:** local runs submit real (sentinel-marked) data to production Brevo, exactly like CI.

### Adding a new form to the suite

Adding a form to the site should always come with a spec here:

1. Create `e2e/<form-name>.spec.ts` (one spec file per form).
2. Use the helpers: `seedCookieConsent` (keeps the cookie banner from intercepting clicks and analytics from recording the run), `gotoHydrated` (the site is prerendered — clicking before hydration silently does nothing), sentinel values from `helpers.ts`, and `submitAndExpectBrevoSuccess` (asserts the POST fires, returns 2xx, and `success:true`). For a non-Brevo endpoint, add a sibling helper that matches that endpoint's URL and success shape.
3. Assert the user-visible success state, not just the network response.
4. Add a row to the coverage table above.

### Forms / widgets that are NOT monitored, and why

- **`NewsletterCTA.svelte`** — dead component, rendered by zero routes (the footer is the only live newsletter instance). Nothing to test in production; if it ever gets wired into a page, add a spec.
- **"Talk to Sales" / demo buttons** — external Cal.com scheduling links, not forms.
- **`mailto:` links** (licensing@, etc.) — no form pipeline to break.
- **Cookie consent banner, service-catalog search box** — no network submission.
