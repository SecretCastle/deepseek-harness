---
description: "Minimal production greet tool for DeepSeek Harness, including its dormant dsh-base mount and model-visible schema."
kind: "package-reference"
---

# @deepseek-ai/dsh-tool-greet

English | [中文](README.zh.md)

## Summary

`dsh-tool-greet` provides the minimal model-facing `greet` tool. When enabled, the model can submit one required `name` and receive the literal result `Hello, <name>!`. The tool performs no I/O, keeps no state, and has no configuration. It is a compact first-party example of a production tool package; `dsh-base` therefore ships its row disabled so default profiles gain no greeting schema or tokens.

## Table of Contents

- [Use this package](#use-this-package)
- [Understand the implementation](#understand-the-implementation)
- [Further Exploration](#further-exploration)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

-----

<a id="use-this-package"></a>
## Use this package

Enable the dormant `dsh-base` row when a deployment wants the teaching tool.

### Minimal configuration

Add this override to the active profile patch or a launch overlay:

```yaml
- id: tool-greet
  disabled: false
```

The plugin has no configuration fields. A composition that does not use `dsh-base` must mount `@deepseek-ai/dsh-system-prompt`, `@deepseek-ai/dsh-tools`, and this package.

-----

<a id="understand-the-implementation"></a>
## Understand the implementation

<details>
<summary>Implementation internals — click to expand</summary>

### Source map

| File | Role |
| --- | --- |
| [`src/index.ts`](src/index.ts) | Tool schema, argument validation wrapper, execution body, and result renderer |
| — | No runtime invariant companion is published; registration and execution relations are owned by `ctx.tools`. |

</details>

-----

<a id="further-exploration"></a>
## Further Exploration

- [Tool authoring reference](../../../docs/cookbook/adding-a-tool.md) — the execute, output, and presentation contracts.
- [dsh-tools](../../core/tools/README.md) — the registry and guarded execution pipeline.
- [Generated tool catalog](../../../docs/tool-catalog.md#deepseek-aidsh-tool-greet) — the exact model-facing schema.
- [Interaction group](../README.md) — adjacent human-interaction packages.

-----

<a id="model-experience"></a>
## Model Experience

### Tool schema

#### What the model sees

The generated [`greet` schema](../../../docs/tool-catalog.md#deepseek-aidsh-tool-greet), with one required string field named `name`. The `dsh-base` row is disabled by default, so shipped default profiles expose no schema from this package.

#### Token effect

Conditional fixed schema cost while the tool is visible; zero direct schema cost while its row is disabled.

#### KV Cache effect

Prefix-stable while the tool remains enabled. Enabling or disabling the row changes the request tool list and can invalidate provider prefix reuse.

### Tool results

#### What the model sees

After a call, the Session log records the model arguments and one text result containing `Hello, <name>!`.

#### Token effect

The result contributes data-dependent tokens derived from the submitted name.

#### KV Cache effect

Append-only: a committed result follows the existing request history and does not rewrite earlier model-visible content.

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

- **The greeting is literal** — the tool always returns English text and provides no formatting or localization options.

<a id="dev-note"></a>
### Dev Note

<details>
<summary>Working context for maintainers — click to expand</summary>

None.

</details>
