/* Learning Data: the learning route's topics, films and series, in one language. Made by site-tools/build_series.py from
   modules/route.json and the topics: never edit it by hand. Drawn by route.js. */
window.LD_ROUTE = {
 "lang": "en",
 "text": {
  "start": "Start here",
  "play": "Play introduction",
  "open": "Open topic",
  "next": "Your next stop",
  "soon": "Coming soon",
  "route": "Suggested route",
  "any": "Suggested paths, not locked steps. Open any topic at any time.",
  "whole": "Whole route",
  "want": "I want to",
  "stops": "{n} stops",
  "go": "Start this route",
  "on": "Continue this route",
  "again": "Watch again",
  "watched": "Watched",
  "of": "{n} of {of} watched",
  "yours": "Your route",
  "film1": "1 film",
  "films": "{n} films",
  "series": "{n} series",
  "more1": "1 more series coming",
  "more": "{n} more series coming",
  "map": "The learning route: {n} topics. Select a topic to see its films and series."
 },
 "groups": [
  {
   "id": "start",
   "line": "main",
   "name": "Start"
  },
  {
   "id": "foundations",
   "line": "main",
   "name": "Foundations"
  },
  {
   "id": "build",
   "line": "main",
   "name": "Build and monitor"
  },
  {
   "id": "share",
   "line": "share",
   "name": "Share and protect"
  },
  {
   "id": "agents",
   "line": "agents",
   "name": "Agents"
  },
  {
   "id": "lead",
   "line": "main",
   "name": "Lead"
  }
 ],
 "topics": [
  {
   "id": "data-platforms",
   "group": "start",
   "name": "Data platforms",
   "who": "Start here: for everyone",
   "line": "How data moves through a modern data platform, from a tap on a phone to a decision.",
   "items": [
    {
     "id": "intro",
     "kind": "film",
     "title": "The Inner Life of Data",
     "href": "",
     "poster": "poster.jpg",
     "kicker": "One film",
     "len": "7½ min",
     "min": 7.5,
     "films": [
      "ld"
     ]
    }
   ]
  },
  {
   "id": "enterprise-architecture",
   "group": "foundations",
   "name": "Enterprise architecture",
   "who": "For architects, and anyone new to an organisation",
   "line": "How an organisation works, in layers, before you ask what its data should answer.",
   "items": [
    {
     "id": "enterprise-architecture",
     "kind": "series",
     "title": "The map before the data",
     "href": "enterprise-architecture/",
     "poster": "day-one-poster.jpg",
     "kicker": "Series · 11 films",
     "len": "67 min",
     "min": 67.0,
     "films": [
      "ld-day-one",
      "ld-who-it-serves",
      "ld-why-it-moves",
      "ld-what-it-must-do",
      "ld-how-value-reaches-people",
      "ld-who-does-it",
      "ld-today-and-where-its-going",
      "ld-now-the-questions-appear",
      "ld-rules-with-a-home",
      "ld-when-strategy-moves",
      "ld-a-map-people-and-agents-can-read"
     ]
    },
    {
     "id": "business-architecture-for-data",
     "kind": "series",
     "title": "Business architecture for data",
     "href": "business-architecture-for-data/",
     "poster": "what-the-business-owns-poster.jpg",
     "kicker": "Series · 4 of 5 films",
     "len": "28 min",
     "min": 28.0,
     "films": [
      "ld-what-the-business-owns",
      "ld-what-the-business-needs-to-know",
      "ld-who-creates-it-who-owns-it",
      "ld-processes-as-deep-as-data-needs"
     ]
    },
    {
     "id": "data-architecture",
     "kind": "series",
     "title": "Data architecture",
     "href": "data-architecture/",
     "poster": "between-the-business-and-the-systems-poster.jpg",
     "kicker": "Series · 4 of 6 films",
     "len": "27 min",
     "min": 27.0,
     "films": [
      "ld-between-the-business-and-the-systems",
      "ld-the-pyramid-taken-apart",
      "ld-where-each-fact-is-born",
      "ld-how-it-travels"
     ]
    },
    {
     "id": "platform-and-solution-architecture",
     "kind": "series",
     "title": "Platform and solution architecture",
     "href": "platform-and-solution-architecture/",
     "poster": "an-application-or-a-platform-poster.jpg",
     "kicker": "Series · 4 of 8 films",
     "len": "32 min",
     "min": 32.0,
     "films": [
      "ld-an-application-or-a-platform",
      "ld-inside-the-platform",
      "ld-one-platform-or-many",
      "ld-where-it-meets-the-applications"
     ]
    },
    {
     "id": "ai-and-continuous-architecture",
     "kind": "series",
     "title": "AI and continuous architecture",
     "href": "ai-and-continuous-architecture/",
     "poster": "agents-on-the-map-poster.jpg",
     "kicker": "Series · 4 of 6 films",
     "len": "32 min",
     "min": 32.0,
     "films": [
      "ld-agents-on-the-map",
      "ld-the-ai-platform",
      "ld-what-an-agent-may-read",
      "ld-a-first-draft-not-a-blank-page"
     ]
    }
   ]
  },
  {
   "id": "data-governance",
   "group": "foundations",
   "name": "Data governance",
   "who": "For governance teams and data owners, and anyone asked to make the rules work",
   "line": "Who decides what, and how each decision reaches the work: policies that run as checks, owners and tests, not on a shelf.",
   "items": [
    {
     "id": "data-governance",
     "kind": "series",
     "title": "Governance principles",
     "href": "data-governance/",
     "poster": "the-same-problem-everywhere-poster.jpg",
     "kicker": "Series · 10 films and a prologue",
     "len": "66 min",
     "min": 66.0,
     "films": [
      "ld-the-same-problem-everywhere",
      "ld-off-the-shelf",
      "ld-who-decides",
      "ld-one-word-one-home",
      "ld-who-may-see-it",
      "ld-rules-that-run",
      "ld-fixed-where-it-starts",
      "ld-change-without-surprises",
      "ld-a-product-with-an-owner",
      "ld-an-agent-that-checks",
      "ld-teachers-of-data"
     ]
    },
    {
     "id": "governance-on-the-map",
     "kind": "series",
     "title": "Governance on the map",
     "href": "governance-on-the-map/",
     "poster": "a-capability-not-a-project-poster.jpg",
     "kicker": "Series · 3 films",
     "len": "19 min",
     "min": 19.0,
     "films": [
      "ld-a-capability-not-a-project",
      "ld-who-does-what-end-to-end",
      "ld-where-each-piece-lives"
     ]
    },
    {
     "id": "governance-in-practice",
     "kind": "series",
     "title": "Governance you can use",
     "href": "governance-in-practice/",
     "poster": "governed-in-dbt-poster.jpg",
     "kicker": "Series · 6 films",
     "len": "38 min",
     "min": 38.0,
     "films": [
      "ld-governed-in-dbt",
      "ld-governed-in-unity-catalog",
      "ld-meaning-on-the-platform",
      "ld-quality-on-the-platform",
      "ld-products-in-open-formats",
      "ld-the-marketplace"
     ]
    }
   ]
  },
  {
   "id": "data-modelling",
   "group": "build",
   "name": "Data modelling",
   "who": "For anyone who designs models, definitions or reports",
   "line": "What the numbers mean, and the shapes that hold them: words and definitions first, then models, before any system.",
   "items": [
    {
     "id": "sketch",
     "kind": "film",
     "title": "A Sharper Sketch",
     "href": "sketch/",
     "poster": "sketch-poster.jpg",
     "kicker": "One film",
     "len": "5½ min",
     "min": 5.5,
     "films": [
      "ld3"
     ]
    },
    {
     "id": "from-words-to-data",
     "kind": "series",
     "title": "From words to data",
     "href": "from-words-to-data/",
     "poster": "whats-in-a-word-poster.jpg",
     "kicker": "Series · 7 films",
     "len": "35 min",
     "min": 35.0,
     "films": [
      "ld-whats-in-a-word",
      "ld-older-than-the-systems",
      "ld-built-to-write-built-to-read",
      "ld-many-ways-to-read",
      "ld-both-at-once",
      "ld-meaning-machines-can-read",
      "ld-keeping-it-true"
     ]
    }
   ]
  },
  {
   "id": "modern-data-basics",
   "group": "build",
   "name": "Modern data basics",
   "who": "For anyone who moves, runs or serves data, and anyone choosing the tools",
   "line": "What today's tools make easier: moving data, running it as software, serving it to people and agents, and reading documents. The architecture only: the official docs go deeper.",
   "items": [
    {
     "id": "data-that-moves",
     "kind": "series",
     "title": "Data that moves",
     "href": "data-that-moves/",
     "poster": "moving-is-easy-poster.jpg",
     "kicker": "Series · 4 films",
     "len": "27 min",
     "min": 27.0,
     "films": [
      "ld-moving-is-easy",
      "ld-hot-warm-cold",
      "ld-one-copy-one-platform",
      "ld-read-often-kept-close"
     ]
    },
    {
     "id": "data-as-software",
     "kind": "series",
     "title": "Data as software",
     "href": "data-as-software/",
     "poster": "scripts-became-software-poster.jpg",
     "kicker": "Series · 2 films",
     "len": "12 min",
     "min": 12.0,
     "films": [
      "ld-scripts-became-software",
      "ld-a-platform-that-watches-itself"
     ]
    },
    {
     "id": "from-tables-to-decisions",
     "kind": "series",
     "title": "From tables to decisions",
     "href": "from-tables-to-decisions/",
     "poster": "reports-on-demand-poster.jpg",
     "kicker": "Series · 3 films",
     "len": "23 min",
     "min": 23.0,
     "films": [
      "ld-reports-on-demand",
      "ld-define-it-once",
      "ld-more-readers-than-people"
     ]
    },
    {
     "id": "documents-as-data",
     "kind": "series",
     "title": "Documents and closing remarks",
     "href": "documents-as-data/",
     "poster": "files-as-data-and-context-poster.jpg",
     "kicker": "Series · 2 films",
     "len": "14 min",
     "min": 14.0,
     "films": [
      "ld-files-as-data-and-context",
      "ld-ideas-that-last"
     ]
    }
   ]
  },
  {
   "id": "analytics-engineering",
   "group": "build",
   "name": "Analytics engineering",
   "who": "For analytics engineers",
   "line": "How an agreed data model becomes tested, documented tables, with dbt.",
   "items": [
    {
     "id": "in-the-weeds",
     "kind": "series",
     "title": "In the weeds of data crafting",
     "href": "in-the-weeds/",
     "poster": "declare-it-then-build-it-poster.jpg",
     "kicker": "Series · 10 films",
     "len": "55 min",
     "min": 55.0,
     "films": [
      "ld-declare-it-then-build-it",
      "ld-start-from-a-question",
      "ld-what-makes-it-the-same-one",
      "ld-one-row-of-what-and-when",
      "ld-promises-and-proofs",
      "ld-built-in-layers",
      "ld-who-owns-what",
      "ld-an-agent-on-the-team",
      "ld-written-once",
      "ld-end-to-end"
     ]
    }
   ]
  },
  {
   "id": "data-quality",
   "group": "build",
   "name": "Data quality",
   "who": "For anyone who builds pipelines, owns a source system or a data product, or depends on data being right",
   "line": "What good enough means for data, what goes wrong, and what catches it: changes, contracts, checks, and errors fixed where they start.",
   "items": [
    {
     "id": "when-things-go-wrong",
     "kind": "series",
     "title": "When things go wrong",
     "href": "when-things-go-wrong/",
     "poster": "silent-change-poster.jpg",
     "kicker": "Series · 2 films",
     "len": "12 min",
     "min": 12.0,
     "films": [
      "ld-silent-change",
      "ld-too-good-to-be-true"
     ]
    },
    {
     "id": "fit-for-use",
     "kind": "series",
     "title": "Fit for use",
     "href": "fit-for-use/",
     "poster": "good-enough-for-what-poster.jpg",
     "kicker": "Series · 4 films",
     "len": "33 min",
     "min": 33.0,
     "films": [
      "ld-good-enough-for-what",
      "ld-a-hundred-records",
      "ld-valid-isnt-true",
      "ld-late-is-wrong-too"
     ]
    },
    {
     "id": "quality-as-a-habit",
     "kind": "series",
     "title": "Quality as a habit",
     "href": "quality-as-a-habit/",
     "poster": "the-hidden-factory-poster.jpg",
     "kicker": "Series · 4 films",
     "len": "35 min",
     "min": 35.0,
     "films": [
      "ld-the-hidden-factory",
      "ld-report-fix-tell",
      "ld-read-by-an-agent",
      "ld-small-every-week"
     ]
    }
   ]
  },
  {
   "id": "master-data",
   "group": "share",
   "name": "Master and reference data",
   "who": "For data stewards and architects, and anyone whose data lives in many systems",
   "line": "The people and things a business is about, kept once and shared across its systems, and the lists that sort them.",
   "items": [
    {
     "id": "master-and-reference-data",
     "kind": "series",
     "title": "The same one, everywhere",
     "href": "master-and-reference-data/",
     "poster": "one-person-many-roles-poster.jpg",
     "kicker": "Series · 9 films",
     "len": "47 min",
     "min": 47.0,
     "films": [
      "ld-one-person-many-roles",
      "ld-who-is-it",
      "ld-which-value-wins",
      "ld-roles-come-and-go",
      "ld-lists-everyone-uses",
      "ld-for-this-purpose-only",
      "ld-one-person-many-systems",
      "ld-a-hub-at-work",
      "ld-kept-not-cleaned"
     ]
    }
   ]
  },
  {
   "id": "data-protection",
   "group": "share",
   "name": "Data protection and privacy",
   "who": "For platform teams, data owners and anyone who gives or gets access to data",
   "line": "Who and what may reach the data, what each person may see, and how long personal data is kept: each lock built from a role, a boundary or a rule already decided.",
   "items": [
    {
     "id": "locks-before-the-data",
     "kind": "series",
     "title": "Locks before the data",
     "href": "locks-before-the-data/",
     "poster": "who-is-it-really-poster.jpg",
     "kicker": "Series · 9 films",
     "len": "79 min",
     "min": 79.0,
     "films": [
      "ld-who-is-it-really",
      "ld-no-secret-to-lose",
      "ld-walls-doors-and-keys",
      "ld-power-you-switch-on",
      "ld-people-and-groups",
      "ld-workloads-without-secrets",
      "ld-network-storage-and-keys",
      "ld-from-a-branch-to-production",
      "ld-who-did-what"
     ]
    },
    {
     "id": "only-what-you-may-see",
     "kind": "series",
     "title": "Only what you may see",
     "href": "only-what-you-may-see/",
     "poster": "an-agreement-first-poster.jpg",
     "kicker": "Series · 8 films",
     "len": "65 min",
     "min": 65.0,
     "films": [
      "ld-an-agreement-first",
      "ld-know-what-you-hold",
      "ld-show-the-least",
      "ld-grants-by-design",
      "ld-tags-that-travel",
      "ld-one-policy-for-many-tables",
      "ld-copies-that-keep-the-rules",
      "ld-proof-it-held"
     ]
    },
    {
     "id": "kept-for-a-reason",
     "kind": "series",
     "title": "Kept for a reason",
     "href": "kept-for-a-reason/",
     "poster": "a-reason-to-keep-it-poster.jpg",
     "kicker": "Series · 5 films",
     "len": "43 min",
     "min": 43.0,
     "films": [
      "ld-a-reason-to-keep-it",
      "ld-how-long-and-then-what",
      "ld-forgetting-a-person",
      "ld-deleted-means-deleted",
      "ld-a-person-asks"
     ]
    }
   ]
  },
  {
   "id": "ai-agents",
   "group": "agents",
   "name": "AI agents in data work",
   "who": "For everyone who works with data, and will work beside an AI agent",
   "line": "Agentic data engineering from the ground up: what an AI agent is and how we got here, what agents are like to work with, and why that means governing them.",
   "items": [
    {
     "id": "what-an-agent-is",
     "kind": "series",
     "title": "What an agent is",
     "href": "what-an-agent-is/",
     "poster": "decades-in-the-making-poster.jpg",
     "kicker": "Series · 10 films",
     "len": "81 min",
     "min": 81.0,
     "films": [
      "ld-decades-in-the-making",
      "ld-borrowed-from-the-brain",
      "ld-a-model-reasoning-hands-and-a-loop",
      "ld-it-feels-like-understanding",
      "ld-more-than-a-junior",
      "ld-minds-that-change",
      "ld-ethics-and-accountability",
      "ld-why-we-govern-them",
      "ld-what-they-tell-us-about-ourselves",
      "ld-many-agents"
     ]
    },
    {
     "id": "agents-at-work-on-data",
     "kind": "series",
     "title": "Agents at work on data",
     "href": "agents-at-work-on-data/",
     "poster": "context-engineering-poster.jpg",
     "kicker": "Series · 9 films",
     "len": "69 min",
     "min": 69.0,
     "films": [
      "ld-context-engineering",
      "ld-skills-and-workflows",
      "ld-tools-are-hands",
      "ld-memory-for-the-team",
      "ld-plan-check-do-check",
      "ld-how-it-goes-wrong",
      "ld-agents-on-databricks",
      "ld-unity-catalog-and-ai-gateway",
      "ld-context-and-memory-governed"
     ]
    },
    {
     "id": "from-helper-to-colleague",
     "kind": "series",
     "title": "From helper to colleague",
     "href": "from-helper-to-colleague/",
     "poster": "five-stages-poster.jpg",
     "kicker": "Series · 7 films",
     "len": "60 min",
     "min": 60.0,
     "films": [
      "ld-five-stages",
      "ld-borrowed-rights",
      "ld-a-place-on-the-map",
      "ld-rights-follow-the-role",
      "ld-the-map-enforced",
      "ld-every-change-through-review",
      "ld-a-written-mandate"
     ]
    }
   ]
  },
  {
   "id": "data-management",
   "group": "lead",
   "name": "Data management",
   "who": "For data managers, and anyone who leads data work across an organisation",
   "line": "A data manager's whole job: every area in one picture, a plan in stages, a case and its risks, everyone at the table, and small steps, measured.",
   "items": [
    {
     "id": "a-plan-in-ninety-days",
     "kind": "series",
     "title": "A plan in ninety days",
     "href": "a-plan-in-ninety-days/",
     "poster": "every-area-one-job-poster.jpg",
     "kicker": "Series · 4 films",
     "len": "36 min",
     "min": 36.0,
     "films": [
      "ld-every-area-one-job",
      "ld-listen-first",
      "ld-design-it-simple",
      "ld-from-gaps-to-a-roadmap"
     ]
    },
    {
     "id": "making-the-case",
     "kind": "series",
     "title": "Making the case",
     "href": "making-the-case/",
     "poster": "a-case-worth-funding-poster.jpg",
     "kicker": "Series · 4 films",
     "len": "32 min",
     "min": 32.0,
     "films": [
      "ld-a-case-worth-funding",
      "ld-risks-said-out-loud",
      "ld-everyone-at-the-table",
      "ld-one-list-not-twenty"
     ]
    },
    {
     "id": "architecture-that-keeps-up",
     "kind": "series",
     "title": "Architecture that keeps up",
     "href": "architecture-that-keeps-up/",
     "poster": "services-with-customers-poster.jpg",
     "kicker": "Series · 3 films",
     "len": "23 min",
     "min": 23.0,
     "films": [
      "ld-services-with-customers",
      "ld-one-map",
      "ld-a-path-for-every-provider"
     ]
    },
    {
     "id": "small-steps-measured",
     "kind": "series",
     "title": "Small steps, measured",
     "href": "small-steps-measured/",
     "poster": "prototype-first-poster.jpg",
     "kicker": "Series · 4 films",
     "len": "31 min",
     "min": 31.0,
     "films": [
      "ld-prototype-first",
      "ld-measures-that-matter",
      "ld-better-every-week",
      "ld-strategy-is-a-habit"
     ]
    }
   ]
  },
  {
   "id": "leading-data-people",
   "group": "lead",
   "name": "Leading data people",
   "who": "For anyone who works in data, and anyone who leads the people who do",
   "line": "The skills data work needs now, and leading the people who do it: seeing the whole, working beside agents, listening, explaining, saying no well, leading a team, owning an outcome, and growing people.",
   "items": [
    {
     "id": "the-new-skills",
     "kind": "series",
     "title": "The new skills",
     "href": "the-new-skills/",
     "poster": "many-hats-poster.jpg",
     "kicker": "Series · 3 films",
     "len": "27 min",
     "min": 27.0,
     "films": [
      "ld-many-hats",
      "ld-draft-and-decision",
      "ld-learning-while-doing"
     ]
    },
    {
     "id": "working-with-people",
     "kind": "series",
     "title": "Working with people",
     "href": "working-with-people/",
     "poster": "the-question-behind-poster.jpg",
     "kicker": "Series · 3 films",
     "len": "26 min",
     "min": 26.0,
     "films": [
      "ld-the-question-behind",
      "ld-explaining-to-decide",
      "ld-saying-no"
     ]
    },
    {
     "id": "leading-a-data-team",
     "kind": "series",
     "title": "Leading a data team",
     "href": "leading-a-data-team/",
     "poster": "less-on-purpose-poster.jpg",
     "kicker": "Series · 4 films",
     "len": "37 min",
     "min": 37.0,
     "films": [
      "ld-less-on-purpose",
      "ld-one-small-change",
      "ld-the-team-first",
      "ld-rules-to-decide"
     ]
    },
    {
     "id": "ownership-and-performance",
     "kind": "series",
     "title": "Ownership and performance",
     "href": "ownership-and-performance/",
     "poster": "owning-the-outcome-poster.jpg",
     "kicker": "Series · 4 films",
     "len": "32 min",
     "min": 32.0,
     "films": [
      "ld-owning-the-outcome",
      "ld-measure-the-work",
      "ld-when-someone-falls-behind",
      "ld-growing-people"
     ]
    }
   ]
  }
 ],
 "goals": [
  {
   "id": "start-with-data",
   "name": "start with data",
   "line": "New to data work. The short way through how it fits together.",
   "stops": [
    "intro",
    "sketch",
    "data-that-moves",
    "when-things-go-wrong"
   ]
  },
  {
   "id": "trusted-report",
   "name": "build a report people trust",
   "line": "From what a number means to a tested table, and the checks that keep it right.",
   "stops": [
    "intro",
    "from-words-to-data",
    "in-the-weeds",
    "when-things-go-wrong",
    "fit-for-use"
   ]
  },
  {
   "id": "governance-that-works",
   "name": "make governance work",
   "line": "Who decides what, how it reaches the work, and the data everyone shares.",
   "stops": [
    "data-governance",
    "governance-on-the-map",
    "governance-in-practice",
    "master-and-reference-data",
    "only-what-you-may-see"
   ]
  },
  {
   "id": "beside-agents",
   "name": "work beside AI agents",
   "line": "What an agent is, what it is like to work with, and the skills that go with it.",
   "stops": [
    "intro",
    "what-an-agent-is",
    "agents-at-work-on-data",
    "from-helper-to-colleague",
    "the-new-skills"
   ]
  },
  {
   "id": "lead-a-team",
   "name": "lead a data team",
   "line": "The organisation first, then the team, the plan and the case for it.",
   "stops": [
    "enterprise-architecture",
    "data-governance",
    "leading-a-data-team",
    "a-plan-in-ninety-days",
    "making-the-case"
   ]
  }
 ]
};
