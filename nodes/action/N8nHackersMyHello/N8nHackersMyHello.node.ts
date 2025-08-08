// src/MyHello.node.ts
import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

export class N8nHackersMyHello implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'N8nHackers My Hello',
		name: 'n8nHackersMyHello',
		icon: { light: 'file:n8nhackers.svg', dark: 'file:n8nhackers.svg' },
    group: ['transform'],
    version: 1,
    description: 'Returns a greeting',
    defaults: { name: 'N8nHackers My Hello' },
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
    properties: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: 'World',
        description: 'Name to greet',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnItems: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      const name = this.getNodeParameter('name', i) as string;
      returnItems.push({ json: { greeting: `Hello, ${name}` } });
    }

    return [returnItems];
  }
}
