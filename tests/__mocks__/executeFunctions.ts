import type {
  IExecuteFunctions, INode, INodeExecutionData, Workflow, ICredentialDataDecryptedObject,
} from 'n8n-workflow';

type MockOptions = {
  nodeParameters?: Record<string, any>;
  input?: INodeExecutionData[];
};

export function createExecuteMock(opts: MockOptions = {}): IExecuteFunctions {
  const params = opts.nodeParameters ?? {};
  const input = opts.input ?? [{ json: {} }];

  const self: Partial<IExecuteFunctions> = {
    // ----- mínimas que usas en el test/nodo -----
    getNode(): INode {
      return {
        name: 'TestNode',
        type: 'test.type',
        typeVersion: 1,
        position: [0, 0],
        parameters: params,
      } as unknown as INode;
    },
    getNodeParameter(name: string, _itemIndex: number, fallback?: any) {
      if (params[name] !== undefined) return params[name];
      if (fallback !== undefined) return fallback;
      throw new Error(`Missing required parameter: ${name}`);
    },
    getInputData() {
      return input;
    },
    helpers: {
      returnJsonArray(data: any[]) {
        return data.map((d) => ({ json: d }));
      },
    } as any,

    // ----- stubs para FunctionsBase (evitan TS2322) -----
    getWorkflowStaticData: () => ({} as any),
    getTimezone: () => 'UTC',
    getRestApiUrl: () => '',
    getInstanceBaseUrl: () => '',
    getMode: () => 'manual' as any,
    getExecutionId: () => 'test-execution-id',
    getWorkflow: () =>
      ({
        id: 'test-workflow-id',
        name: 'Test Workflow',
        active: false,
      } as unknown as Workflow),
    continueOnFail: () => false,

    // credenciales (si tu nodo las pide)
    getCredentials: async <T extends object = ICredentialDataDecryptedObject>() => ({} as T),
    getCredentialsProperties: () => [],
    logger: {
      debug: () => {},
      info: () => {},
      warn: () => {},
      error: () => {},
    },
  };

  return self as IExecuteFunctions;
}
