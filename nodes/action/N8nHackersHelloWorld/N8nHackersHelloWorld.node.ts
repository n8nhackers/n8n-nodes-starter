import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

import { LoggerProxy as Logger } from 'n8n-workflow';

export class N8nHackersHelloWorld implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'N8nHackers Hello World',
		name: 'n8nHackersHelloWorld',
		icon: { light: 'file:n8nhackers.svg', dark: 'file:n8nhackers.svg' },
		group: ['transform'],
		version: 1,
		description: 'Outputs a greeting message',
		defaults: {
			name: 'N8nHackers Hello World',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		properties: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: 'Miquel',
				required: true,
				description: 'Name to greet',
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'options',
				options: [
					{ name: 'Spanish', value: 'es' },
					{ name: 'English', value: 'en' },
				],
				default: 'es',
				description: 'Greeting language',
			},
			{
				displayName: 'Language (2)',
				name: 'language2',
				type: 'options',
				options: [
					{ name: 'Spanish', value: 'es' },
					{ name: 'English', value: 'en' },
				],
				default: 'es',
				description: 'Greeting language',
			},
			{
				displayName: 'Language (3)',
				name: 'language3',
				type: 'options',
				options: [
					{ name: 'Spanish', value: 'es' },
					{ name: 'English', value: 'en' },
				],
				default: 'es',
				description: 'Greeting language',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		let item: INodeExecutionData;
		let greeting: string;

		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				// Get the name and language from the parameters
				const name = this.getNodeParameter('name', itemIndex, '') as string;
				const language = this.getNodeParameter('language', itemIndex, 'es') as string;

				// Create the greeting based on the selected language
				if (language === 'es') {
					greeting = `¡Hola, ${name}!`;
				} else if (language === 'en') {
					greeting = `Hello, ${name}!`;
				} else {
					throw new NodeOperationError(this.getNode(), `Unsupported language: ${language}`, {
						itemIndex,
					});
				}
				item = items[itemIndex];

				// Dentro de tu método execute()
				Logger.debug('Executing MyCommunityNode', { itemIndex, greeting });

				item.json.greeting = greeting;
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
