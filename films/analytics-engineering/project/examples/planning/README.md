# Planning's project: a cross-project sketch

**dbt Cloud only. It doesn't run on DuckDB, and CI doesn't build it.**

Today one project holds everything, and groups say who owns what (see `docs/decisions.md`,
12 October). When Planning owns its own domain, its models move to a project of their own,
like this one, and build on the credential project's public core:

- `dependencies.yml` names the project it depends on: `credentials`.
- `{{ ref('credentials', 'core_learner', v=1) }}` refs a public model in that project, pinned
  to a version.
- Only `public` models can be refed from another project. The credential project's marts are
  `protected`: this project can't ref them, so Planning builds on the core, never on the
  wallet's marts.

The point-in-time filter is written out here because macros don't cross projects. Shared
macros, such as the key and time macros, would move to a package both projects install.
