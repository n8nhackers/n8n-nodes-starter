import { INodeProperties } from 'n8n-workflow';

export const helloWorldResources: INodeProperties[] = [
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
];

export const helloWorldOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['helloWorld'],
			},
		},
		options: [
			{
				name: 'Good Morning',
				value: 'goodMorning',
				description: 'Output a good morning message',
				action: 'Output a good morning message',
			},
			{
				name: 'Good Afternoon',
				value: 'goodAfternoon',
				description: 'Output a good afternoon message',
				action: 'Output a good afternoon message',
			},
			{
				name: 'Good Night',
				value: 'goodNight',
				description: 'Output a good night message',
				action: 'Output a good night message',
			},
		],
		default: 'goodMorning',
	},
];

export const helloWorldProperties: INodeProperties[] = [
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
			{
				name: 'Spanish',
				value: 'es',
			},
			{
				name: 'English',
				value: 'en',
			},
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
];
