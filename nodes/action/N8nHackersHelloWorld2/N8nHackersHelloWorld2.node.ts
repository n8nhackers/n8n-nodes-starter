import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType, NodeOperationError } from 'n8n-workflow';

export class N8nHackersHelloWorld2 implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'N8nHackers Hello World 2',
		name: 'n8nHackersHelloWorld2',
		icon: { light: 'file:n8nhackers.svg', dark: 'file:n8nhackers.svg' },
		group: ['transform'],
		version: 1,
		description: 'Outputs a greeting message',
		defaults: {
			name: 'N8nHackers Hello World 2',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Hello Resource',
						value: 'helloWorld',
					},
				],
				default: 'helloWorld',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'helloWorld',
						],
					},
				},
				options: [
					{
						name: 'Good Morning',
						value: 'goodMorning',
						action: 'Output a good morning message',
					},
					{
						name: 'Good Afternoon',
						value: 'goodAfternoon',
						action: 'Output a good afternoon message',
					},
					{
						name: 'Good Night',
						value: 'goodNight',
						action: 'Output a good night message',
					},
				],
				default: 'goodMorning',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: 'Miquel',
				required: true,
				description: 'Name to greet',
				displayOptions: {
					show: {
						resource: ['helloWorld'],
						operation: ['goodMorning', 'goodAfternoon', 'goodNight'],
					},
				},
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
				displayOptions: {
					show: {
						resource: ['helloWorld'],
						operation: ['goodMorning', 'goodAfternoon', 'goodNight'],
					},
				},
			},
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
					case 'goodMorning':
					default:
						greeting = language === 'es'
							? `Buenos días, ${nameParam}`
							: `Good morning, ${nameParam}`;
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
