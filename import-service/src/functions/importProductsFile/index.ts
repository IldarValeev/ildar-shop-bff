import { handlerPath } from '@libs/handler-resolver'

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        cors: true,
        path: 'import',
        request: {
          parameters: {
            querystrings: {
              name: true
            }
          }
        },
        responses: {
					default: {},
					200: {
						description: 'Returns signed URL',
						bodyType: 'string',
					},
					404: 'File name not provided',
					500: 'Backend Error',
				},
        authorizer: {
					name: 'importFunctionServiceAuthorizer',
				},
      },
    },
  ],
};
