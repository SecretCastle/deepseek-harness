/**
 * Minimal model-facing `greet` tool.
 * @module @deepseek-ai/dsh-tool-greet
 */

import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'

export const name = 'tool-greet'
export const inject = ['tools']

/**
 * Register the `greet` tool for the lifetime of the plugin context.
 * @param ctx - context carrying the `ctx.tools` registry.
 */
export function apply(ctx: Context): void {
  ctx.tools.register(defineTool({
    name: 'greet',
    description: 'Return a friendly greeting for one named person. Use it only when the user asks for a greeting.',
    parameters: {
      name: {
        type: 'string',
        required: true,
        description: 'The exact name to include in the greeting.',
      },
    },
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: value }],
    },
    async execute(args) {
      return `Hello, ${args.name}!`
    },
  }))
}
