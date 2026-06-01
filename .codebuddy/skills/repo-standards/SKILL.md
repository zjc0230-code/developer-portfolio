---
name: repo-standards
description: >
  This skill manages the repository governance standards for the developer-portfolio project.
  It should be used when the user refers to "仓库规范", "repo standards", "规范管理", "项目规范",
  or when making structural changes to the docs/ directory, modifying sync scripts, or updating
  maintenance guides. This skill provides the canonical rules for directory structure, content
  standards, naming conventions, and the docs-to-web sync pipeline.
---

# Repository Governance Standards

## Purpose

This skill maintains the canonical governance rules for the `developer-portfolio` repository.
It serves as the single source of truth for all conventions, structure rules, and operational
procedures. When CodeBuddy interacts with this repository, it must reference and respect these
standards, and update them when conventions evolve.

## When to Use

Trigger this skill when:
- User mentions "规范", "standards", "仓库规范", "repo rules", "convention"
- Creating, moving, or deleting files in `docs/`
- Modifying `scripts/sync-site.mjs` or `scripts/render-html.mjs`
- Adding new industry categories or content layers
- Updating `docs/维护指南.md` or `docs/技术展示标准.md`
- The user asks about project structure rules

## How to Use

### 1. Load the Standards Reference

Before making any structural changes, read `references/standards.md` to understand the current
rules. This file mirrors the canonical rules from `docs/维护指南.md` and `docs/技术展示标准.md`
in a machine-friendly format.

### 2. Validate Changes Against Standards

When the user proposes a change, check it against all applicable rules in the standards reference.
If the change would violate a rule, flag it and explain why.

### 3. Update Standards When Conventions Change

When the user explicitly changes a convention (e.g., adding a new directory, changing naming rules,
modifying the sync pipeline), update both:
- The source-of-truth docs (e.g., `docs/维护指南.md`)
- The `references/standards.md` file in this skill

Keep both in sync. The docs are human-facing; the references file is machine-facing.

### 4. Respect the SSOT Principle

`docs/` is the single source of truth. Never manually edit `web/index.html` or `web/data/site.json`
directly. All content changes go through `docs/` → `npm run sync:site` → web output.

## Bundled Resources

- `references/standards.md` — Complete repository governance rules in structured format.
  Load this file when making any structural or content changes to the repository.
