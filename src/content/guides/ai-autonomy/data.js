// Ported verbatim from the original standalone guide (public/guides/Marc-Bastien-AI-Autonomy-Levels.html).
// Fields: c = colour slot (c1..c5), flow nodes (i = icon, t = text, h = human step),
// cards, skills (checklist; progress key is `${id}-${index}`), next = steps to the next level.
const DATA = [
  {
    id:1, label:"Copilot", title:"Copilot mode", c:"c1",
    desc:"AI assists with inline completions and answers questions. You write most code yourself — autocomplete, boilerplate generation, and quick lookups.",
    flow:[
      {i:"user",  t:"You write code",  h:1},
      {i:"sparkles",t:"AI suggests"},
      {i:"eye",   t:"You review",      h:1},
      {i:"ok",    t:"Accept / reject", h:1},
    ],
    cards:[
      {i:"target",t:"What this level does",items:["AI provides inline code completions as you type","Chat sidebar answers questions about your code","Generates boilerplate from natural language prompts","Explains errors when you paste stack traces"]},
      {i:"list",t:"What you should be doing",items:["Making all architectural decisions yourself","Reviewing every line of AI output before accepting","Learning to write clear, specific prompts","Using version control manually for all changes"]}
    ],
    skills:[
      "Write prompts that produce usable code on first attempt",
      "Recognize when AI output is wrong or subtly broken",
      "Understand your stack well enough to validate suggestions",
      "Know when to ask AI vs write it yourself",
      "Debug effectively using AI chat with good context"
    ],
    next:[
      {s:"Start using an agentic tool",d:"Claude Code, Cursor, or similar — AI reads files and runs commands"},
      {s:"Create a project context file",d:"A CLAUDE.md that tells the AI about your codebase conventions"},
      {s:"Let AI make multi-file edits",d:"Shift from asking questions to giving implementation tasks"},
      {s:"Learn to review diffs",d:"Review the diff as a whole instead of watching every keystroke"}
    ]
  },
  {
    id:2, label:"Supervised", title:"Supervised agent", c:"c2",
    desc:"You plan the work, the agent implements it, and you review every change. The AI reads your codebase, runs commands, and makes edits — but you verify everything before committing.",
    flow:[
      {i:"map",   t:"You plan",       h:1},
      {i:"bot",   t:"Agent builds"},
      {i:"code",  t:"Edits files"},
      {i:"eye",   t:"You review diff",h:1},
      {i:"commit",t:"You commit",     h:1},
    ],
    cards:[
      {i:"target",t:"What this level does",items:["Agent reads multiple files and makes coordinated changes","Agent runs commands: tests, builds, linting","You create branches and the agent implements on them","Iterative feedback loop: you direct, agent adjusts"]},
      {i:"list",t:"What you should be doing",items:["Writing plans in plan mode before implementation","One branch per task, one session per branch","Maintaining CLAUDE.md with project conventions","Starting fresh sessions to manage context window"]}
    ],
    skills:[
      "Write a CLAUDE.md that front-loads essential project knowledge",
      "Use plan mode to break work into clear steps",
      "Manage context: surgical file reads, clean session boundaries",
      "Externalize plans to files instead of keeping them in chat",
      "Review AI diffs with the same rigor as a code review",
      "Recognize when context is degraded and start fresh"
    ],
    next:[
      {s:"Create subagents",d:"Researcher, reviewer, and test-runner with isolated contexts"},
      {s:"Implement hooks",d:"Auto-formatting, pre-commit gates, and audit routing"},
      {s:"Build test coverage",d:"High enough that 'tests pass' actually means it works"},
      {s:"Create a plan-refine skill",d:"Produces implementation-ready plans with verification steps"},
      {s:"Add CI pipelines",d:"Validate PRs independently with automated checks"}
    ]
  },
  {
    id:3, label:"Gated", title:"Gated autonomy", c:"c3",
    desc:"The agent works autonomously between defined checkpoints. You approve the plan and the PR — between gates, the agent implements, tests, and self-corrects. Quality is enforced by hooks, tests, and CI.",
    flow:[
      {i:"file",  t:"You approve plan",h:1},
      {i:"bot",   t:"Agent implements"},
      {i:"shield",t:"Hooks enforce"},
      {i:"test",  t:"Tests validate"},
      {i:"gitpr", t:"CI gates PR"},
      {i:"eye",   t:"You review PR",   h:1},
    ],
    cards:[
      {i:"target",t:"What this level does",items:["Agent reads plan files and implements features independently","Hooks auto-format, block dangerous commands, route audits","Subagents handle research, review, testing in isolation","CI validates every PR before merge"]},
      {i:"list",t:"What you should be doing",items:["Writing strategic plans and acceptance criteria","Reviewing PRs and final diffs, not watching every edit","Tuning hooks and skills based on agent mistakes","Tracking token usage and optimizing context efficiency"]}
    ],
    skills:[
      "Design a tiered hook system (format, pre-commit, audit, protection)",
      "Create subagents with appropriate tool restrictions and models",
      "Write plan files as contracts with verification steps",
      "Build CI/CD pipelines that catch integration issues",
      "Structure skills that load on demand without bloating context",
      "Know when to delegate to subagent vs handle in main session",
      "Configure git worktrees for parallel isolated work"
    ],
    next:[
      {s:"Run headless sessions",d:"Use 'claude -p' for non-interactive execution that produces PRs"},
      {s:"Achieve 70%+ test coverage",d:"Including E2E tests for critical user flows"},
      {s:"Let agent commit to branches",d:"Without manual review of every change"},
      {s:"Run overnight tasks",d:"Agent produces PR, you review in the morning"},
      {s:"Machine-verifiable criteria",d:"Every plan has acceptance criteria the agent can check itself"}
    ]
  },
  {
    id:4, label:"Continuous", title:"Continuous autonomy", c:"c4",
    desc:"The agent runs for hours or overnight. It plans, implements, tests, reviews its own work, and produces a PR. You review the output — not the process. Automated verification makes unsupervised execution safe.",
    flow:[
      {i:"writing",t:"You write spec",  h:1},
      {i:"play",   t:"Headless run"},
      {i:"refresh",t:"Self-corrects"},
      {i:"gitpr",  t:"PR created"},
      {i:"checks", t:"CI passes"},
      {i:"checkbox",t:"You review PR",  h:1},
    ],
    cards:[
      {i:"target",t:"What this level does",items:["Agent executes complete plans overnight without your terminal","Automatic branch creation, implementation, testing, and PR","Self-corrects: if tests fail, debugs and retries automatically","Morning delivery: PR with passing CI and verification checklist"]},
      {i:"list",t:"What you should be doing",items:["Writing specs and plan files as primary engineering output","Reviewing PRs and running manual verification checklists","Conducting post-mortems when agent ships something wrong","Focusing on architecture, security, and business logic"]}
    ],
    skills:[
      "Write machine-verifiable acceptance criteria with zero ambiguity",
      "Design E2E test suites catching cross-feature integration bugs",
      "Run headless Claude sessions that produce reviewable PRs",
      "Build plan revision gates for invalidated assumptions",
      "Implement rebase-and-validate between sequential checkpoints",
      "Monitor and optimize token spend across autonomous runs",
      "Use git worktrees for safe parallel autonomous execution",
      "Debug agent failures from PR diffs without session replay"
    ],
    next:[
      {s:"Implement Agent Teams",d:"Manager agent orchestrating specialized parallel workers"},
      {s:"Enable inter-agent communication",d:"Shared task lists with dependency tracking"},
      {s:"Design adaptive orchestration",d:"Agent revises plans when assumptions change"},
      {s:"Set up Routines",d:"Scheduled autonomous tasks: nightly audits, daily deploys"},
      {s:"Build review agents",d:"Agents that evaluate other agents' output quality"}
    ]
  },
  {
    id:5, label:"Orchestrator", title:"Multi-agent orchestration", c:"c5",
    desc:"Multiple specialized agents coordinate on complex work. A planning agent creates specs, workers build in parallel, review agents audit. You approve final output and make strategic decisions.",
    flow:[
      {i:"compass",  t:"You set direction",h:1},
      {i:"hierarchy",t:"Manager plans"},
      {i:"split",    t:"Workers parallel"},
      {i:"merge",    t:"Auto-merge"},
      {i:"report",   t:"Brief generated"},
      {i:"clipcheck",t:"You verify",       h:1},
    ],
    cards:[
      {i:"target",t:"What this level does",items:["Manager decomposes goals into checkpoint branches","Parallel workers implement independent checkpoints","Agents communicate through shared task lists","Manager waits for CI, merges, rebases, continues"]},
      {i:"list",t:"What you should be doing",items:["Defining product direction and architectural boundaries","Reviewing aggregate output for coherence","Monitoring costs, failure rates, plan revision frequency","Making security, compliance, and deployment decisions"]}
    ],
    skills:[
      "Design agent team topologies with clear ownership boundaries",
      "Implement shared task lists with dependency and status tracking",
      "Build canary checkpoint patterns (first checkpoint pauses for review)",
      "Create SubagentStop hooks validating worker output before merge",
      "Design integration test phases after all checkpoints merge",
      "Implement adaptive plan revision for invalidated assumptions",
      "Set up Routines for scheduled autonomous operations",
      "Optimize multi-agent token economics across parallel runs",
      "Debug coordination failures across parallel agent sessions"
    ],
    next:[
      {s:"Meta-agents",d:"Agents that design, create, and improve other agents"},
      {s:"Cross-project orchestration",d:"Agents managing work across multiple repositories"},
      {s:"Self-improving systems",d:"Pipelines that tune their own prompts and workflows"},
      {s:"You are defining the frontier",d:"This is where the map ends — keep building"}
    ]
  }
];

export default DATA
