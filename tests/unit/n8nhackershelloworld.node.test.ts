// tests/myhello.node.test.ts
import { N8nHackersHelloWorld } from '../../nodes/action/N8nHackersHelloWorld/N8nHackersHelloWorld.node';
import { createExecuteMock } from '../__mocks__/executeFunctions';

describe('N8nHackersHelloWorld node', () => {
  it('returns default greeting when name not provided', async () => {
    const mock = createExecuteMock({
      nodeParameters: { name: 'World' }, // como en default
      input: [{ json: {} }],
    });
    const node = new N8nHackersHelloWorld();
    const result = await (node as any).execute.call(mock);
    expect(result).toHaveLength(1);
    expect(result[0][0].json).toEqual({ greeting: '¡Hola, World!' });
  });

  it('returns greeting with custom name', async () => {
    const mock = createExecuteMock({
      nodeParameters: { name: 'Miquel' },
      input: [{ json: {} }],
    });
    const node = new N8nHackersHelloWorld();
    const result = await (node as any).execute.call(mock);
    expect(result[0][0].json).toEqual({ greeting: '¡Hola, Miquel!' });
  });

  // it('handles multiple input items', async () => {
  //   const mock = createExecuteMock({
  //     nodeParameters: { name: 'Team' },
  //     input: [{ json: { a: 1 } }, { json: { b: 2 } }],
  //   });
  //   const node = new N8nHackersHelloWorld();
  //   const result = await (node as any).execute.call(mock);
	// 	console.log(result);
  //   expect(result[0]).toHaveLength(2);
  //   expect(result[0][1].json).toEqual({ greeting: '¡Hola, Team!' });
  // });
});
