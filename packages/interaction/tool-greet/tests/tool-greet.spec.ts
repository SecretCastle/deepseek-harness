import { describe, expect, it } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import { ToolCallId } from '@deepseek-ai/dsh-llm'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import ToolRuntime from '@deepseek-ai/dsh-tools'
import * as toolGreet from '@deepseek-ai/dsh-tool-greet'

async function setup(): Promise<Context> {
  const ctx = new Context()
  await ctx.plugin(SystemPrompt)
  await ctx.plugin(ToolRuntime)
  await ctx.plugin(toolGreet)
  return ctx
}

describe('greet tool', () => {
  it('registers a model-facing schema', async () => {
    const ctx = await setup()

    expect(ctx.tools.schemas().find(tool => tool.name === 'greet')).toMatchObject({
      description: 'Return a friendly greeting for one named person. Use it only when the user asks for a greeting.',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'The exact name to include in the greeting.' },
        },
        required: ['name'],
      },
    })
    await ctx.fiber.dispose()
  })

  it('returns one greeting through the tool pipeline', async () => {
    const ctx = await setup()

    const result = await ctx.tools.execute({
      callId: ToolCallId('greet-success'),
      name: 'greet',
      arguments: { name: 'DeepSeek Harness' },
      signal: new AbortController().signal,
    })

    expect(result).toMatchObject({
      isError: false,
      content: [{ type: 'text', text: 'Hello, DeepSeek Harness!' }],
    })
    await ctx.fiber.dispose()
  })

  it('rejects model arguments with the wrong type', async () => {
    const ctx = await setup()

    const result = await ctx.tools.execute({
      callId: ToolCallId('greet-invalid-args'),
      name: 'greet',
      arguments: { name: 42 },
      signal: new AbortController().signal,
    })

    expect(result.isError).toBe(true)
    expect(result.error?.message).toContain('invalid arguments')
    await ctx.fiber.dispose()
  })

  it('unregisters the tool when its plugin fiber unloads', async () => {
    const ctx = new Context()
    await ctx.plugin(SystemPrompt)
    await ctx.plugin(ToolRuntime)
    const fiber = ctx.plugin(toolGreet)
    await fiber

    expect(ctx.tools.schemas().some(tool => tool.name === 'greet')).toBe(true)
    await fiber.dispose()
    expect(ctx.tools.schemas().some(tool => tool.name === 'greet')).toBe(false)
    await ctx.fiber.dispose()
  })
})
