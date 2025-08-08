import {
    ITriggerFunctions,
    ITriggerResponse,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';

import { NodeConnectionType } from 'n8n-workflow';

import { setInterval, clearInterval } from 'timers';


export class N8nHackersSecondsTrigger implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'N8nHackers Seconds Trigger',
        name: 'n8nHackersSecondsTrigger',
        group: ['trigger'],
				icon: { light: 'file:n8nhackers.svg', dark: 'file:n8nhackers.svg' },
        version: 1,
        description: 'Dispara el workflow cada X segundos',
        defaults: { name: 'N8nHackers Seconds Trigger' },
        inputs: [],
				outputs: [NodeConnectionType.Main],
        properties: [
            {
                displayName: 'Intervalo (Segundos)',
                name: 'interval',
                type: 'number',
                default: 60,
                required: true,
                description: 'Tiempo entre emisiones en segundos',
            },
        ],
    };

    async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
        const interval = this.getNodeParameter('interval', 0) as number;

        const intervalRef = setInterval(() => {
            this.emit([this.helpers.returnJsonArray([{
                message: 'Ejecutado trigger',
                time: new Date().toISOString(),
            }])]);
        }, interval * 1000);

        return {
            closeFunction: async () => {
                clearInterval(intervalRef);
            },
        };
    }
}
