import type {
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	ITriggerFunctions,
} from 'n8n-workflow';

import { NodeConnectionType } from 'n8n-workflow';

export class N8nHackersWebhookTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'N8nHackers Webhook Trigger',
		name: 'n8nHackersWebhookTrigger',
		icon: { light: 'file:n8nhackers.svg', dark: 'file:n8nhackers.svg' },
		group: ['trigger'],
		version: 1,
		description: 'Dispara el workflow mediante un webhook',
		defaults: {
			name: 'My Webhook Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		properties: [
			{
				displayName: 'Mensaje',
				name: 'message',
				type: 'string',
				default: 'Webhook recibido',
				description: 'Mensaje que se incluirá en la salida',
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				path: 'webhook',
			},
		],
	};

	async activate(this: ITriggerFunctions): Promise<void> {
		// Esta función se llama cuando el workflow se activa.
		// Puedes realizar cualquier inicialización necesaria aquí.
		return;
	}

	async deactivate(this: ITriggerFunctions): Promise<void> {
		// Esta función se llama cuando se desactiva el workflow.
		// Limpia aquí cualquier recurso o suscripción que hayas creado.
		return;
	}

	async create(this: ITriggerFunctions): Promise<{ webhookId: string }> {
		// Retorna el identificador del webhook creado.
		// El identificador debe coincidir con el configurado en la sección 'webhooks' de la descripción.
		return { webhookId: 'default' };
	}

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData();

		// Check if the webhook is only the ping from service that confirms the subscrip
		if (bodyData.hook_id !== undefined && bodyData.action === undefined) {
			// Is only the ping and not an actual webhook call. So return 'OK'
			// but do not start the workflow.

			return {
				webhookResponse: 'OK',
			};
		}

		// Is a regular webhook call

		// TODO: Add headers & requestPath
		const returnData: IDataObject[] = [];

		returnData.push({
			body: bodyData,
			headers: this.getHeaderData(),
			query: this.getQueryData(),
		});

		return {
			workflowData: [this.helpers.returnJsonArray(returnData)],
		};
	}
}
