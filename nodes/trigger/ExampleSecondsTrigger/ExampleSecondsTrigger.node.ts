import {
    ITriggerFunctions,
    ITriggerResponse,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';

import { NodeConnectionType } from 'n8n-workflow';

import { setInterval, clearInterval } from 'timers';


export class ExampleSecondsTrigger implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Example Seconds Trigger',
        name: 'exampleSecondsTrigger',
        group: ['trigger'],
        version: 1,
        description: 'Dispara el workflow cada X segundos',
        defaults: { name: 'My Seconds Trigger' },
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
