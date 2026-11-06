# Graph Report - WebPortfolio  (2026-11-06)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 383 nodes · 728 edges · 20 communities (13 shown, 7 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cba8d6de`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 17

## God Nodes (most connected - your core abstractions)
1. `react` - 24 edges
2. `react-router` - 16 edges
3. `useDocumentTitle()` - 13 edges
4. `react-icons` - 13 edges
5. `StubDynamo` - 12 edges
6. `Home()` - 12 edges
7. `lambda_handler()` - 11 edges
8. `HandlerTests` - 10 edges
9. `formatDate()` - 10 edges
10. `LevelSection()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `Home()`  [EXTRACTED]
  src/App.jsx → src/pages/Home.jsx
- `Layout()` --calls--> `Footer()`  [EXTRACTED]
  src/App.jsx → src/components/footer/Footer.jsx
- `Layout()` --calls--> `Nav()`  [EXTRACTED]
  src/App.jsx → src/components/nav/Nav.jsx
- `Home()` --calls--> `useDocumentTitle()`  [EXTRACTED]
  src/pages/Home.jsx → src/hooks/useDocumentTitle.js
- `renderAt()` --calls--> `useHashScroll()`  [EXTRACTED]
  src/hooks/useHashScroll.test.js → src/hooks/useHashScroll.js

## Import Cycles
- None detected.

## Communities (20 total, 7 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (36): react, react-router, App(), Layout(), Memo, GuideLayout(), slugify(), TocList() (+28 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (42): gitHooksInstalled(), inspect(), inspectSegment(), main(), path, ROOT, segments(), SEPARATORS (+34 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (46): dependencies, @emailjs/browser@^5.0.3, react@^19.3.1, react-dom@^19.3.1, react-icons@^5.7.0, react-markdown@^10.1.0, react-router@^7.18.5, remark-gfm@^4.0.1 (+38 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (23): @emailjs/browser, react-icons, About(), AiEngineering(), data, Contact(), fillAndSubmit(), data (+15 more)

### Community 4 - "Community 4"
Cohesion: 0.15
Nodes (7): increment(), lambda_handler(), read(), _response(), event(), HandlerTests, StubDynamo

### Community 5 - "Community 5"
Cohesion: 0.16
Nodes (18): auditVerdict(), classify(), fs, isFixture(), isLogicFile(), isTestFile(), main(), path (+10 more)

### Community 6 - "Community 6"
Cohesion: 0.19
Nodes (18): DATA, Icon(), ICONS, AiAutonomyLevels(), AutonomyScale(), FlowDiagram(), InfoCards(), LevelSection() (+10 more)

### Community 7 - "Community 7"
Cohesion: 0.16
Nodes (10): Footer(), VisitCounter(), CountUp(), CTA(), Header(), metrics, HeaderSocials(), readFlag() (+2 more)

### Community 8 - "Community 8"
Cohesion: 0.18
Nodes (14): links, Nav(), pages, SectionLink(), isAtPageBottom(), SECTION_IDS, useActiveSection(), applyTheme() (+6 more)

### Community 9 - "Community 9"
Cohesion: 0.23
Nodes (7): certs, now, AskMarc(), FollowUp(), prefersReducedMotion(), prompts, renderChat()

### Community 10 - "Community 10"
Cohesion: 0.22
Nodes (9): scripts, build, prepare, preview, start, test, test:once, test:security (+1 more)

### Community 11 - "Community 11"
Cohesion: 0.29
Nodes (6): background_color, display, icons, name, short_name, theme_color

### Community 12 - "Community 12"
Cohesion: 0.53
Nodes (3): legacyCopy(), useCodeCopy(), AvdEnterpriseWorkspace()

## Knowledge Gaps
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Community 0` to `Community 2`, `Community 3`, `Community 6`, `Community 7`, `Community 8`, `Community 9`, `Community 12`?**
  _High betweenness centrality (0.279) - this node is a cross-community bridge._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.08961748633879782 - nodes in this community are weakly interconnected._
- **Why does `@babel/parser` connect `Community 2` to `Community 1`?**
  _High betweenness centrality (0.138) - this node is a cross-community bridge._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.0512987012987013 - nodes in this community are weakly interconnected._
- **Why does `@babel/traverse` connect `Community 2` to `Community 1`?**
  _High betweenness centrality (0.138) - this node is a cross-community bridge._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.0517120894479385 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.07030527289546716 - nodes in this community are weakly interconnected._