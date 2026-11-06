> Archived plan from May 2026, since superseded. Certs and roles are as of that date.
>
> **Historical (superseded):** this plan predates the redesign. Its stack and hosting notes (TypeScript, CRA, Render) are wrong. See the root `CLAUDE.md` for the current site.

# marcbastien.com — Site Update Plan

## Problem Statement
The site currently positions Marc as a "Cloud Developer" focused on frontend/fullstack web development. It needs to be repositioned as a **Systems Administrator & Cloud Engineer** to align with his current career trajectory, resume, and active job application (Junior System Administrator — City of Miami Beach). The hiring panel may visit this URL — it must reinforce, not contradict, the resume narrative.

---

## Architecture Reference
- **Stack:** React + TypeScript, CRA build (static/js/main.*.js, static/css/main.*.css)
- **Hosting:** Likely Render, Cloudflare, or similar static host
- **Structure:** Single-page app, one route, anchor-based navigation
- **Sections (by DOM ID):**
  - `header#home` — Hero (name, title, CTAs, photo)
  - `section#about` — Bio, stats cards, personal photo
  - `section#experience` — Skills grid (Frontend Dev / Backend Dev)
  - `section#services` — Service cards (Software Dev / AWS Cloud / System Admin)
  - `section#portfolio` — Project cards (6 items)
  - `section#testimonials` — Swiper carousel (4 testimonials)
  - `section#contact` — Contact info + form
  - `footer#footer` — Nav links, copyright

---

## Issue Inventory

| ID | Priority | Section | Issue | Dependencies |
|----|----------|---------|-------|-------------|
| 01 | P0 | `#home` | Title says "Cloud Developer" — should reflect sysadmin/cloud engineer | None |
| 02 | P0 | `#about` | Bio is generic web dev copy — needs to match resume profile | None |
| 03 | P0 | `#about` | Experience stat says "4+ Years" — resume says 5+ | None |
| 04 | P0 | `#experience` | Skills split as "Frontend Dev / Backend Dev" — wrong categories entirely | None |
| 05 | P0 | `#services` | Cards prioritize Software Dev and list WordPress/Shopify — wrong focus | #04 |
| 06 | P1 | `#portfolio` | MyAutoTab is missing. Coding exercises (Color Game, Task Planner) dominate | None |
| 07 | P1 | `#portfolio` | Existing client sites (XPS, Villa Majorca, Garage Epoxy) are web dev work | #06 |
| 08 | P1 | `#contact` | Google Voice number (941-800-1822) differs from resume (305-331-9346) | None |
| 09 | P2 | `#home` | "Hire Me!" CTA text is informal for a sysadmin audience | None |
| 10 | P2 | `#testimonials` | Testimonials are all web dev/design clients — still valid but need context | None |
| 11 | P2 | global | resume.marcbastien.com link in nav — verify it's updated or remove | None |
| 12 | P2 | `#about` | "Clients 5+ Worldwide" stat card — reframe for sysadmin context | None |
| 13 | P1 | new `#ai-engineering` | Add new section showcasing AI engineering / automation work between `#services` and `#portfolio` | None |

---

## Implementation Specs

### ISSUE-01: Update Hero Title (P0)
**File:** Find the component rendering `header#home` (likely `src/components/Header.tsx` or `src/sections/Home.tsx` or similar)
**Change:**
- Replace `"Cloud Developer"` with `"Systems Administrator & Cloud Engineer"`
- Keep "Hello I'm" and "Marc Bastien" as-is
- Update CTA buttons: "View Resume" stays, "Let's Talk" stays

### ISSUE-02: Rewrite About Me Bio (P0)
**File:** Component rendering `section#about`
**Replace the current bio paragraph with:**
```
Systems administrator and infrastructure engineer with 5+ years supporting enterprise environments across municipal government, healthcare, and cloud operations. Currently serving as Tier 2 IT Support at a South Florida municipality, managing Active Directory, Entra ID, endpoint security, network infrastructure, and IP telephony systems. CCNA and AWS Solutions Architect certified with hands-on experience in cloud infrastructure, scripting, automation, and change management. Independently building and maintaining a production application demonstrating database administration, CI/CD pipeline management, and structured deployment workflows.
```

### ISSUE-03: Fix Experience Stat (P0)
**File:** Same as #about component
**Change:** `"4+ Years"` → `"5+ Years"`

### ISSUE-04: Restructure Skills Section (P0)
**File:** Component rendering `section#experience`
**Replace the two-card layout ("Frontend Development" / "Backend Development") with:**

**Card 1: "Infrastructure & Identity"**
| Skill | Level |
|-------|-------|
| Active Directory / Entra ID | Experienced |
| Microsoft Intune / MDM | Experienced |
| Windows Server | Experienced |
| Linux Administration | Intermediate |
| Hyper-V / VMware | Intermediate |
| Microsoft 365 / SharePoint | Experienced |

**Card 2: "Cloud & Automation"**
| Skill | Level |
|-------|-------|
| AWS (VPC, EC2, S3, IAM) | Experienced |
| Azure (VMs, VNet, Entra ID) | Intermediate |
| Bash / PowerShell Scripting | Experienced |
| CI/CD Pipeline Design | Experienced |
| Docker / Containerization | Intermediate |
| Networking (TCP/IP, DNS, DHCP) | Experienced |

**Note:** Keep the same visual layout (two cards, skill + level format with green dots). Only the category names and skill items change.

### ISSUE-05: Rewrite Services Cards (P0)
**File:** Component rendering `section#services`
**Replace the three cards with:**

**Card 1: "System Administration"** (was the weakest card — now leads)
- Active Directory & Entra ID Management
- Endpoint Deployment & Intune MDM
- IP Telephony (3CX / Amazon Chime)
- Microsoft 365 / SharePoint / OneDrive
- User Account & Access Control

**Card 2: "Cloud & Infrastructure"** (replaces "AWS Cloud")
- AWS VPC, EC2, S3, IAM Architecture
- Azure VMs, VNet, Entra ID
- Network Infrastructure & Troubleshooting
- Server Maintenance & Patch Management
- Monitoring, Alerting & Incident Response

**Card 3: "Automation & Development"** (replaces "Software Development")
- Bash / PowerShell / JavaScript Scripting
- CI/CD Pipeline Design & Management
- Database Administration (PostgreSQL)
- REST API Development (.NET / Node.js)
- Technical Documentation & Change Control

### ISSUE-06: Update Portfolio — Add MyAutoTab, Reorder (P1)
**File:** Component rendering `section#portfolio`
**Changes:**
1. **Add MyAutoTab as the FIRST portfolio item:**
   - Title: "MyAutoTab"
   - Description: "Multi-tenant vehicle management platform — .NET, PostgreSQL, CI/CD pipelines, Row-Level Security, automated testing"
   - Button 1: "Private Repo"
   - Button 2: "Staging Site" → links to `https://web.staging.myautotab.com`
   - Screenshot: Take a screenshot or use a placeholder image of the staging site

2. **Reorder remaining items:**
   - MyAutoTab (new, first)
   - Expense Tracker (keep — demonstrates fullstack)
   - XPS Xpress Pompano (keep — real client work)
   - Villa Majorca (keep — real client work)
   - REMOVE: Color Guessing Game (coding exercise, not professional)
   - REMOVE: Task Planner (coding exercise, not professional)
   - REMOVE: Garage Epoxy (third Shopify site is redundant)

**Final portfolio: 4 items** (MyAutoTab, Expense Tracker, XPS Xpress, Villa Majorca)

### ISSUE-07: Covered by ISSUE-06 (portfolio reorder)

### ISSUE-08: Fix Contact Phone Number (P1)
**File:** Component rendering `section#contact`
**Change:** Replace Google Voice number `+19418001822` / display `+19418001822` with resume number `305-331-9346`
**OR** remove the phone number entirely if you prefer email/LinkedIn only.

### ISSUE-09: Update CTA Language (P2)
**File:** `#about` component
**Change:** "Hire Me!" button → "Get In Touch" (more professional, links to #contact)

### ISSUE-10: Testimonials — No Change Needed (P2)
The testimonials are from real clients and still demonstrate professionalism, communication, and reliability. These soft-skill signals are valuable regardless of role. Leave as-is.

### ISSUE-11: Verify Resume Link (P2)
**Check:** Navigate to `https://resume.marcbastien.com` and verify it shows an updated resume, not an old version. If it's outdated, either update it or change the "View Resume" button to link to a PDF hosted on the main domain or remove it and offer the resume on request.

### ISSUE-12: Reframe Stat Cards (P2)
**File:** `#about` component
**Change the three stat cards:**
- "Experience / 4+ Years" → "Experience / 5+ Years" (covered in #03)
- "Clients / 5+ Worldwide" → "Environments / 5+ Managed" (more sysadmin-relevant)
- "Projects / 10+ Completed" → "Certifications / 6 Active" (stronger signal for sysadmin)

### ISSUE-13: Add AI & Automation Engineering Section (P1)

**Context:** This is a React + TypeScript portfolio site (CRA build). The site has these sections in order: `header#home`, `section#about`, `section#experience`, `section#services`, `section#portfolio`, `section#testimonials`, `section#contact`, `footer#footer`. Navigation uses anchor links and there's a bottom nav bar with icon buttons.

Add a new section showcasing AI engineering and automation work. Position between `#services` and `#portfolio` (or between `#portfolio` and `#testimonials` — use judgment based on the flow).

**Section IDs and copy:**
- Section ID: `#ai-engineering`
- Eyebrow text: "Building the Future"
- Section title: "AI & Automation Engineering"
- Intro paragraph above the cards:
  > "I design automated systems that enforce quality, security, and process discipline — so nothing reaches production without passing through structured gates."

**Files to create:**
- `src/components/ai-engineering/AiEngineering.jsx`
- `src/components/ai-engineering/ai-engineering.css`

**Files to modify:**
- `src/App.jsx` — import and render `<AiEngineering />` between `<Services />` and `<Portfolio />`
- `src/components/nav/Nav.jsx` — add a nav icon/link for `#ai-engineering` (bot or circuit icon — e.g. `BsRobot` from `react-icons/bs`, or `AiOutlineRobot` from `react-icons/ai`)

**Card content** (display as cards matching the existing site's visual style — dark background, green accents, rounded cards with subtle borders; each card has an icon/visual indicator at top, title, 2–3 sentence description, and a tag/chip row):

**Card 1: "Automated Quality Enforcement"**
- Description: "Designed a tiered quality gate system that enforces code standards, security policies, and test coverage automatically. Includes auto-formatting on every file change, pre-commit validation that blocks bad code, intelligent audit routing based on what changed, and protected file rules that prevent accidental modification of critical configs."
- Tags: `CI/CD`, `Git Hooks`, `Bash`, `Automated Testing`, `Quality Assurance`

**Card 2: "Multi-Agent Orchestration System"**
- Description: "Built a subagent architecture with specialized AI workers — a read-only researcher for codebase exploration, a reviewer for code quality analysis, and a test-runner for isolated test execution. Each agent has scoped tool access and model selection for cost-efficient, secure operation."
- Tags: `Agent Design`, `Context Management`, `Prompt Engineering`, `Task Decomposition`

**Card 3: "AI-Powered Security Auditing"**
- Description: "Created a custom database security audit system that automatically validates multi-tenant data isolation, Row-Level Security policies, soft-delete compliance, and SQL injection prevention across every database operation before code reaches production."
- Tags: `PostgreSQL`, `.NET`, `EF Core`, `Security`, `Automated Auditing`

**Card 4: "Structured Change Management"**
- Description: "Developed a plan-driven engineering methodology where every change starts with a structured specification — problem statement, dependency ordering, acceptance criteria, and rollback strategy. Changes are implemented one at a time, each verified before moving to the next, ensuring nothing ships without passing automated checks."
- Tags: `Systems Design`, `Technical Writing`, `Change Management`, `Process Engineering`

**Design guidelines:**
- Match the existing site's dark theme, green accent color, monospace headings, and card style
- Cards in a 2x2 grid on desktop, single column on mobile (`max-width: 600px` breakpoint)
- Use existing CSS custom properties from `src/index.css` (`--color-bg`, `--color-primary`, `--container-width-lg/md/sm`, `--transition`) — do NOT hardcode colors
- Subtle hover effects consistent with the rest of the site (match `services.css` / `portfolio.css` patterns)
- Each card should feel substantial but scannable — no walls of text
- Tag chips: small rounded pills with subtle border, green accent on hover

**Navigation update:**
- Add a nav icon/link for the new section in the bottom navigation bar (`Nav.jsx`)
- Icon should represent AI or automation (bot icon, circuit icon, or similar)
- Insert the nav entry in the same position as the section appears (between Services and Portfolio)
- Ensure `activeNav` state and `onClick` handlers follow the existing pattern

**Constraints:**
- Do NOT change any existing sections — only add the new one
- Keep the same component patterns used elsewhere in the codebase (paired `.jsx` + `.css`, component imports its own stylesheet, hardcoded `data` array rendered with `.map()`)
- Match existing CSS class naming conventions (e.g. `ai-engineering__container`, `ai-engineering__card`, `ai-engineering__card-tags`)
- Ensure the section is responsive at 1024px and 600px breakpoints
- Verify all existing anchor nav links (`#home`, `#about`, `#experience`, `#services`, `#portfolio`, `#testimonials`, `#contact`) still work after adding the new section

---

## Verification Steps

After all changes, verify:
1. [ ] Hero says "Systems Administrator & Cloud Engineer" (not "Cloud Developer")
2. [ ] About bio matches the updated text above
3. [ ] Stats read: 5+ Years, 5+ Environments, 6 Certifications
4. [ ] Skills section shows Infrastructure & Identity / Cloud & Automation (not Frontend/Backend)
5. [ ] Services lead with System Administration, then Cloud & Infrastructure, then Automation
6. [ ] MyAutoTab is the first portfolio item with staging link
7. [ ] Color Guessing Game, Task Planner, and Garage Epoxy are removed from portfolio
8. [ ] Contact phone matches resume (305-331-9346) or is removed
9. [ ] "Hire Me!" changed to "Get In Touch"
10. [ ] resume.marcbastien.com is current or link is updated/removed
11. [ ] No console errors after changes
12. [ ] Mobile responsive — check at 375px width
13. [ ] All anchor nav links (#home, #about, #experience, #services, #ai-engineering, #portfolio, #testimonials, #contact) still work
14. [ ] New `#ai-engineering` section renders between `#services` and `#portfolio` with intro paragraph and 4 cards (2x2 grid desktop, single column mobile)
15. [ ] Bottom nav bar shows new icon for `#ai-engineering` and clicking it scrolls to the section
16. [ ] AI Engineering card tags render as chips and match site theme (green accent, dark bg, no hardcoded colors)

---

## Session Strategy

**Session 1 — P0 changes (Issues 01-05):**
Start by finding the component file structure. Run `find src -name "*.tsx" -o -name "*.ts" | head -40` and `cat src/App.tsx | head -50` to understand routing and component imports. Then update hero title, about bio, stats, skills section, and services section. Build and verify.

**Session 2 — P1 changes (Issues 06-08):**
Update portfolio — add MyAutoTab, remove exercise projects, reorder. Fix contact phone number. Build and verify.

**Session 3 — P2 polish (Issues 09, 11-12):**
Update CTA text, verify resume link, reframe stat cards. Final build, responsive check, deploy.

**Session 4 — AI Engineering section (Issue 13):**
Create `src/components/ai-engineering/AiEngineering.jsx` + `ai-engineering.css` following the paired-component + hardcoded-data-array pattern used elsewhere. Wire it into `App.jsx` between Services and Portfolio. Add nav entry with bot/circuit icon. Build and verify responsive layout at 1024px and 600px breakpoints, confirm smooth-scroll anchor navigation still works for all sections.
