import { handlerPath } from '@libs/handler-resolver'

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: '${self:provider.environment.BUCKET_NAME}',
        event: "s3:ObjectCreated:*",
        rules: [{
          prefix: '${self:provider.environment.UPLOADED_FOLDER}'
        }, {
          suffix: '.csv'
        }],
        existing: true,
        forceDeploy: true
      }
    },
  ],
};
