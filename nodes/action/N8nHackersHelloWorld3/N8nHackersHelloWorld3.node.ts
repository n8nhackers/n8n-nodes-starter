import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

import { helloWorldResources, helloWorldOperations, helloWorldProperties } from './HelloWorld3Description';

export class N8nHackersHelloWorld3 implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'N8nHackers Hello World 3',
		name: 'n8nHackersHelloWorld3',
		icon: { light: 'file:n8nhackers.svg', dark: 'file:n8nhackers.svg' },

		group: ['transform'],
		version: 1,
		description: 'Outputs a greeting message',
		defaults: {
			name: 'N8nHackers Hello World 3',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		properties: [
			...helloWorldResources,
			...helloWorldOperations,
			...helloWorldProperties,
		],
	};


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				const operation = this.getNodeParameter('operation', itemIndex) as string;
				const nameParam = this.getNodeParameter('name', itemIndex) as string;

				let greeting: string;

				const language = this.getNodeParameter('language', itemIndex) as string;
				switch (operation) {
					case 'goodMorning':
						greeting = language === 'es'
							? `Buenos días, ${nameParam}`
							: `Good morning, ${nameParam}`;
						break;
					case 'goodAfternoon':
						greeting = language === 'es'
							? `Buenas tardes, ${nameParam}`
							: `Good afternoon, ${nameParam}`;
						break;
					case 'goodNight':
						greeting = language === 'es'
							? `Buenas noches, ${nameParam}`
							: `Good night, ${nameParam}`;
						break;
					default:
						greeting = language === 'es'
							? `Hola, ${nameParam}`
							: `Hello, ${nameParam}`;
						break;
				}

				items[itemIndex].json.greeting = greeting;
			} catch (error) {
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					if (error.context) {
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return [items];
	}
}
