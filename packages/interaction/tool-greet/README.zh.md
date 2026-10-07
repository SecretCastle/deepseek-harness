---
description: "DeepSeek Harness 的最小生产 greet 工具，包含默认休眠的 dsh-base 挂载与面向模型的 schema。"
kind: "package-reference"
---

# @deepseek-ai/dsh-tool-greet

[English](README.md) | 中文

## 概述

`dsh-tool-greet` 提供最小的面向模型 `greet` 工具。启用后，模型可提交一个必填 `name`，并收到字面结果 `Hello, <name>!`。该工具不执行 I/O、不保存状态、没有配置项。它是紧凑的第一方生产工具包示例；因此 `dsh-base` 随包提供但默认禁用该行，默认 profile 不会增加问候 schema 或 token。

## 目录

- [使用本包](#use-this-package)
- [理解实现](#understand-the-implementation)
- [进一步探索](#further-exploration)
- [模型体验](#model-experience)
- [已知限制与延期工作](#known-limitations-and-deferred-work)
- [开发备注](#dev-note)

-----

<a id="use-this-package"></a>
## 使用本包

部署需要这个教学工具时，启用 `dsh-base` 中休眠的行。

### 最小配置

把以下覆盖项加入当前 profile patch 或启动 overlay：

```yaml
- id: tool-greet
  disabled: false
```

本插件没有配置字段。不使用 `dsh-base` 的组合必须挂载 `@deepseek-ai/dsh-system-prompt`、`@deepseek-ai/dsh-tools` 与本包。

-----

<a id="understand-the-implementation"></a>
## 理解实现

<details>
<summary>实现细节——点击展开</summary>

### 源码映射

| 文件 | 角色 |
| --- | --- |
| [`src/index.ts`](src/index.ts) | 工具 schema、参数校验包装、执行体与结果渲染器 |
| — | 不发布运行时不变式伴生入口；注册与执行关系由 `ctx.tools` 拥有。 |

</details>

-----

<a id="further-exploration"></a>
## 进一步探索

- [工具编写参考](../../../docs/cookbook/adding-a-tool.zh.md)——执行、输出与呈现契约。
- [dsh-tools](../../core/tools/README.zh.md)——注册表与受守卫保护的执行流水线。
- [生成的工具目录](../../../docs/tool-catalog.zh.md#deepseek-aidsh-tool-greet)——确切的面向模型 schema。
- [Interaction 组](../README.zh.md)——相邻的人机交互包。

-----

<a id="model-experience"></a>
## 模型体验

### 工具 schema

#### 模型看到什么

生成的 [`greet` schema](../../../docs/tool-catalog.zh.md#deepseek-aidsh-tool-greet)，只有一个名为 `name` 的必填字符串字段。`dsh-base` 行默认禁用，因此随产品发布的默认 profile 不暴露本包 schema。

#### Token 影响

工具可见时产生固定 schema 成本；行禁用时直接 schema 成本为零。

#### KV Cache 影响

工具保持启用时前缀稳定。启用或禁用该行会改变请求工具列表，可能使提供方前缀缓存失效。

### 工具结果

#### 模型看到什么

调用后，Session 日志记录模型参数与一条包含 `Hello, <name>!` 的文本结果。

#### Token 影响

结果贡献随提交名称变化的依赖数据 token。

#### KV Cache 影响

追加式：已提交结果跟随既有请求历史，不重写先前的模型可见内容。

## 已知限制与延期工作

<a id="known-limitations-and-deferred-work"></a>

- **问候是字面文本**——工具始终返回英文文本，不提供格式化或本地化选项。

<a id="dev-note"></a>
### 开发备注

<details>
<summary>维护者的工作上下文——点击展开</summary>

无。

</details>
