import { handlerPath } from '@libs/handler-resolver'

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        arn: { 'Fn::GetAtt': ['${self:custom.sqsLogicalResource}', 'Arn'] },
        batchSize: 5,
      }
    },
  ],
};
