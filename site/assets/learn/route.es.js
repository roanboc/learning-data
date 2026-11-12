/* Learning Data: the learning route's topics, films and series, in one language. Made by site-tools/build_series.py from
   modules/route.json and the topics: never edit it by hand. Drawn by route.js. */
window.LD_ROUTE = {
 "lang": "es",
 "text": {
  "start": "Empieza aquí",
  "play": "Ver la introducción",
  "open": "Abrir el tema",
  "next": "Tu próxima parada",
  "soon": "Próximamente",
  "route": "Ruta sugerida",
  "any": "Rutas sugeridas, no pasos obligatorios. Abre cualquier tema cuando quieras.",
  "whole": "Toda la ruta",
  "want": "Quiero",
  "stops": "{n} paradas",
  "go": "Empezar esta ruta",
  "on": "Seguir esta ruta",
  "again": "Ver de nuevo",
  "watched": "Vista",
  "of": "{n} de {of} vistas",
  "yours": "Tu ruta",
  "film1": "1 película",
  "films": "{n} películas",
  "series": "{n} series",
  "more1": "1 serie más en camino",
  "more": "{n} series más en camino",
  "map": "La ruta de aprendizaje: {n} temas. Elige un tema para ver sus películas y series."
 },
 "groups": [
  {
   "id": "start",
   "line": "main",
   "name": "Inicio"
  },
  {
   "id": "foundations",
   "line": "main",
   "name": "Fundamentos"
  },
  {
   "id": "build",
   "line": "main",
   "name": "Construir y monitorear"
  },
  {
   "id": "share",
   "line": "share",
   "name": "Compartir y proteger"
  },
  {
   "id": "agents",
   "line": "agents",
   "name": "Agentes"
  },
  {
   "id": "lead",
   "line": "main",
   "name": "Liderar"
  }
 ],
 "topics": [
  {
   "id": "data-platforms",
   "group": "start",
   "name": "Plataformas de datos",
   "who": "Empieza aquí: para todos",
   "line": "Cómo se mueven los datos en una plataforma de datos moderna, desde un toque en el teléfono hasta una decisión.",
   "items": [
    {
     "id": "intro",
     "kind": "film",
     "title": "La vida interior de los datos",
     "href": "",
     "poster": "poster.es.jpg",
     "kicker": "Una película",
     "len": "8 min",
     "min": 8.0,
     "films": [
      "ld"
     ]
    },
    {
     "id": "more-than-a-platform",
     "kind": "film",
     "title": "Más que una plataforma",
     "href": "more-than-a-platform/",
     "poster": "more-than-a-platform-poster.jpg",
     "kicker": "Una película",
     "len": "3½ min",
     "min": 3.5,
     "films": [
      "ld-more-than-a-platform"
     ]
    }
   ]
  },
  {
   "id": "enterprise-architecture",
   "group": "foundations",
   "name": "Arquitectura empresarial",
   "who": "Para arquitectos, y para quien llega nuevo a una organización",
   "line": "Cómo funciona una organización, por capas, antes de preguntar qué deberían responder sus datos.",
   "items": [
    {
     "id": "enterprise-architecture",
     "kind": "series",
     "title": "El mapa antes de los datos",
     "href": "enterprise-architecture/",
     "poster": "day-one-poster.jpg",
     "kicker": "Serie · 11 películas",
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
     "title": "Arquitectura de negocio para datos",
     "href": "business-architecture-for-data/",
     "poster": "what-the-business-owns-poster.jpg",
     "kicker": "Serie · 5 películas",
     "len": "35 min",
     "min": 35.0,
     "films": [
      "ld-what-the-business-owns",
      "ld-what-the-business-needs-to-know",
      "ld-who-creates-it-who-owns-it",
      "ld-processes-as-deep-as-data-needs",
      "ld-rules-and-expectations-the-business-owns"
     ]
    },
    {
     "id": "data-architecture",
     "kind": "series",
     "title": "Arquitectura de datos",
     "href": "data-architecture/",
     "poster": "between-the-business-and-the-systems-poster.jpg",
     "kicker": "Serie · 6 películas",
     "len": "43 min",
     "min": 43.0,
     "films": [
      "ld-between-the-business-and-the-systems",
      "ld-the-pyramid-taken-apart",
      "ld-where-each-fact-is-born",
      "ld-how-it-travels",
      "ld-who-owns-which-data",
      "ld-one-language-kept"
     ]
    },
    {
     "id": "platform-and-solution-architecture",
     "kind": "series",
     "title": "Arquitectura de plataforma y de soluciones",
     "href": "platform-and-solution-architecture/",
     "poster": "an-application-or-a-platform-poster.jpg",
     "kicker": "Serie · 4 de 8 películas",
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
     "title": "IA y arquitectura continua",
     "href": "ai-and-continuous-architecture/",
     "poster": "agents-on-the-map-poster.jpg",
     "kicker": "Serie · 4 de 6 películas",
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
   "name": "Gobernanza de datos",
   "who": "Para equipos de gobernanza y dueños de datos, y para quien debe hacer que las reglas funcionen",
   "line": "Quién decide qué, y cómo cada decisión llega al trabajo: políticas que se ejecutan como controles, dueños y pruebas, no en un estante.",
   "items": [
    {
     "id": "data-governance",
     "kind": "series",
     "title": "Principios de gobernanza",
     "href": "data-governance/",
     "poster": "the-same-problem-everywhere-poster.jpg",
     "kicker": "Serie · 10 películas y un prólogo",
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
     "title": "La gobernanza en el mapa",
     "href": "governance-on-the-map/",
     "poster": "a-capability-not-a-project-poster.jpg",
     "kicker": "Serie · 3 películas",
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
     "title": "Gobernanza que puedes usar",
     "href": "governance-in-practice/",
     "poster": "governed-in-dbt-poster.jpg",
     "kicker": "Serie · 6 películas",
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
   "name": "Modelado de datos",
   "who": "Para quien diseña modelos, definiciones o reportes",
   "line": "Lo que significan las cifras, y las formas que las contienen: primero las palabras y las definiciones, luego los modelos, antes que cualquier sistema.",
   "items": [
    {
     "id": "sketch",
     "kind": "film",
     "title": "A Sharper Sketch",
     "href": "sketch/",
     "poster": "sketch-poster.jpg",
     "kicker": "Una película",
     "len": "5½ min",
     "min": 5.5,
     "films": [
      "ld3"
     ],
     "lang": "en"
    },
    {
     "id": "from-words-to-data",
     "kind": "series",
     "title": "De las palabras a los datos",
     "href": "from-words-to-data/",
     "poster": "whats-in-a-word-poster.jpg",
     "kicker": "Serie · 7 películas",
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
   "name": "Lo básico de los datos modernos",
   "who": "Para quien mueve, opera o sirve datos, y para quien elige las herramientas",
   "line": "Lo que las herramientas de hoy facilitan: mover datos, operarlos como software, servirlos a personas y agentes, y leer documentos. Solo la arquitectura: la documentación oficial va más allá.",
   "items": [
    {
     "id": "data-that-moves",
     "kind": "series",
     "title": "Datos que se mueven",
     "href": "data-that-moves/",
     "poster": "moving-is-easy-poster.jpg",
     "kicker": "Serie · 4 películas",
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
     "title": "Datos como software",
     "href": "data-as-software/",
     "poster": "scripts-became-software-poster.jpg",
     "kicker": "Serie · 2 películas",
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
     "title": "De las tablas a las decisiones",
     "href": "from-tables-to-decisions/",
     "poster": "reports-on-demand-poster.jpg",
     "kicker": "Serie · 3 películas",
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
     "title": "Documentos y comentarios finales",
     "href": "documents-as-data/",
     "poster": "files-as-data-and-context-poster.jpg",
     "kicker": "Serie · 2 películas",
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
   "name": "Ingeniería analítica",
   "who": "Para analytics engineers",
   "line": "Cómo un modelo de datos acordado se convierte en tablas probadas y documentadas, con dbt.",
   "items": [
    {
     "id": "in-the-weeds",
     "kind": "series",
     "title": "En las entrañas del oficio de datos",
     "href": "in-the-weeds/",
     "poster": "declare-it-then-build-it-poster.jpg",
     "kicker": "Serie · 10 películas",
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
   "name": "Calidad de datos",
   "who": "Para quien construye pipelines, es responsable de un sistema de origen o de un producto de datos, o depende de que los datos estén bien",
   "line": "Qué es lo bastante bueno para los datos, qué sale mal y qué lo detecta: cambios, contratos, controles, y errores arreglados donde empiezan.",
   "items": [
    {
     "id": "when-things-go-wrong",
     "kind": "series",
     "title": "Cuando algo sale mal",
     "href": "when-things-go-wrong/",
     "poster": "silent-change-poster.jpg",
     "kicker": "Serie · 2 películas",
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
     "title": "Apto para su uso",
     "href": "fit-for-use/",
     "poster": "good-enough-for-what-poster.jpg",
     "kicker": "Serie · 4 películas",
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
     "title": "La calidad como hábito",
     "href": "quality-as-a-habit/",
     "poster": "the-hidden-factory-poster.jpg",
     "kicker": "Serie · 4 películas",
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
   "name": "Datos maestros y de referencia",
   "who": "Para custodios y arquitectos de datos, y para quien tiene sus datos en muchos sistemas",
   "line": "Las personas y las cosas de las que trata un negocio, guardadas una vez y compartidas entre sus sistemas, y las listas que las clasifican.",
   "items": [
    {
     "id": "master-and-reference-data",
     "kind": "series",
     "title": "El mismo, en todas partes",
     "href": "master-and-reference-data/",
     "poster": "one-person-many-roles-poster.jpg",
     "kicker": "Serie · 9 películas",
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
   "name": "Protección de datos y privacidad",
   "who": "Para equipos de plataforma, dueños de datos y quien da o recibe acceso a datos",
   "line": "Quién y qué puede llegar a los datos, qué puede ver cada persona, y cuánto se guardan los datos personales: cada cerradura hecha a partir de un rol, una frontera o una regla ya decididos.",
   "items": [
    {
     "id": "locks-before-the-data",
     "kind": "series",
     "title": "Cerraduras antes que los datos",
     "href": "locks-before-the-data/",
     "poster": "who-is-it-really-poster.jpg",
     "kicker": "Serie · 9 películas",
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
     "title": "Solo lo que puedes ver",
     "href": "only-what-you-may-see/",
     "poster": "an-agreement-first-poster.jpg",
     "kicker": "Serie · 8 películas",
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
     "title": "Guardado por una razón",
     "href": "kept-for-a-reason/",
     "poster": "a-reason-to-keep-it-poster.jpg",
     "kicker": "Serie · 5 películas",
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
   "name": "Agentes de IA en el trabajo con datos",
   "who": "Para quien trabaja con datos, y trabajará junto a un agente de IA",
   "line": "La ingeniería de datos con agentes desde la base: qué es un agente de IA y cómo llegamos aquí, cómo es trabajar con agentes, y por qué eso significa gobernarlos.",
   "items": [
    {
     "id": "what-an-agent-is",
     "kind": "series",
     "title": "Qué es un agente",
     "href": "what-an-agent-is/",
     "poster": "decades-in-the-making-poster.jpg",
     "kicker": "Serie · 10 películas",
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
     "title": "Agentes trabajando con datos",
     "href": "agents-at-work-on-data/",
     "poster": "context-engineering-poster.jpg",
     "kicker": "Serie · 9 películas",
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
     "title": "De ayudante a colega",
     "href": "from-helper-to-colleague/",
     "poster": "five-stages-poster.jpg",
     "kicker": "Serie · 7 películas",
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
   "name": "Gestión de datos",
   "who": "Para gestores de datos, y para quien lidera el trabajo con datos en toda una organización",
   "line": "Todo el trabajo de una gestora de datos: todas las áreas en una imagen, un plan por etapas, un caso y sus riesgos, todos en la mesa, y pasos pequeños, medidos.",
   "items": [
    {
     "id": "a-plan-in-ninety-days",
     "kind": "series",
     "title": "Un plan en noventa días",
     "href": "a-plan-in-ninety-days/",
     "poster": "every-area-one-job-poster.jpg",
     "kicker": "Serie · 4 películas",
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
     "title": "Construir el caso",
     "href": "making-the-case/",
     "poster": "a-case-worth-funding-poster.jpg",
     "kicker": "Serie · 4 películas",
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
     "title": "Una arquitectura al día",
     "href": "architecture-that-keeps-up/",
     "poster": "services-with-customers-poster.jpg",
     "kicker": "Serie · 3 películas",
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
     "title": "Pasos pequeños, medidos",
     "href": "small-steps-measured/",
     "poster": "prototype-first-poster.jpg",
     "kicker": "Serie · 4 películas",
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
   "name": "Liderar equipos de datos",
   "who": "Para quien trabaja con datos, y para quien lidera a las personas que lo hacen",
   "line": "Las personas antes que el trabajo, las habilidades que hoy pide el trabajo con datos, y cómo liderar a quienes lo hacen: conocer a tu equipo, ver el conjunto, trabajar junto a agentes, escuchar, explicar, decir que no bien, liderar un equipo, hacerse cargo de un resultado, y ayudar a crecer a las personas.",
   "items": [
    {
     "id": "people-first",
     "kind": "series",
     "title": "Las personas primero",
     "href": "people-first/",
     "poster": "people-before-roles-poster.jpg",
     "kicker": "Serie · 1 de 4 películas",
     "len": "8 min",
     "min": 8.0,
     "films": [
      "ld-people-before-roles"
     ]
    },
    {
     "id": "the-new-skills",
     "kind": "series",
     "title": "Las nuevas habilidades",
     "href": "the-new-skills/",
     "poster": "many-hats-poster.jpg",
     "kicker": "Serie · 3 películas",
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
     "title": "Trabajar con personas",
     "href": "working-with-people/",
     "poster": "the-question-behind-poster.jpg",
     "kicker": "Serie · 3 películas",
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
     "title": "Liderar un equipo de datos",
     "href": "leading-a-data-team/",
     "poster": "less-on-purpose-poster.jpg",
     "kicker": "Serie · 4 películas",
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
     "title": "Responsabilidad y desempeño",
     "href": "ownership-and-performance/",
     "poster": "owning-the-outcome-poster.jpg",
     "kicker": "Serie · 4 películas",
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
   "name": "empezar con datos",
   "line": "Para quien empieza. El camino corto para ver cómo encaja todo.",
   "stops": [
    "intro",
    "more-than-a-platform",
    "sketch",
    "data-that-moves",
    "when-things-go-wrong"
   ]
  },
  {
   "id": "trusted-report",
   "name": "hacer un reporte confiable",
   "line": "De lo que significa una cifra a una tabla probada, y los controles que la mantienen bien.",
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
   "name": "hacer que la gobernanza funcione",
   "line": "Quién decide qué, cómo llega al trabajo, y los datos que todos comparten.",
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
   "name": "trabajar junto a agentes de IA",
   "line": "Qué es un agente, cómo es trabajar con él, y las habilidades que pide.",
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
   "name": "liderar un equipo de datos",
   "line": "Primero la organización, luego las personas, el equipo, el plan y su justificación.",
   "stops": [
    "enterprise-architecture",
    "data-governance",
    "people-first",
    "leading-a-data-team",
    "a-plan-in-ninety-days",
    "making-the-case"
   ]
  }
 ]
};
