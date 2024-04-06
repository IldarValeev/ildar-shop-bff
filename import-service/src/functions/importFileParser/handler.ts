import { ValidatedEventAPIGatewayProxyEvent, formatJSONErrorResponse, formatJSONResponse } from '@libs/api-gateway';
import { CopyObjectCommand, GetObjectCommand, DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import schema from './schema';
import { S3Event } from 'aws-lambda';
import neatCsv from 'neat-csv';
import middy from '@middy/core';

const SOURCE = `Lambda [importFileParser] -`

const importFileParser: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log(`${SOURCE} started`);
  console.log(`${SOURCE} event: ${JSON.stringify(event)}`);

  const s3Client = new S3Client({ region: 'eu-west-1' });

  try {
    await Promise.all((event as any as S3Event).Records.map(async record => {
      console.info(`Reading '${record.s3.object.key}'...`);

      const bucketName = record.s3.bucket.name;
      const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

      const getCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: key
      });

      const result = await s3Client.send(getCommand);
      const records = await neatCsv(result.Body);

      console.info(`Reading '${key}' finished`);
      console.info(`Parsing '${key}'...`);

      records.forEach(record => console.log(record));

      console.info(`Parsing '${key}' finished`);

      const copyToPath = key.replace(`${process.env.UPLOADED_FOLDER}`, `${process.env.PARSED_FOLDER}`);

      console.info(`Copying '${key}' to '${copyToPath}'...`);

      const copyCommand = new CopyObjectCommand({
        Bucket: bucketName,
        CopySource: `${bucketName}/${key}`,   // bucket name should be presented
        Key: copyToPath
      });

      await s3Client.send(copyCommand);

      console.info(`Copying '${key}' to '${copyToPath}' finished`);

      console.info(`Deleting '${key}'...`);

      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: key
      });

      await s3Client.send(deleteCommand);

      console.info(`Deleting '${key}' finished`);
    })
    );

    return formatJSONResponse('Parsing is done');
  }
  catch (e) {
    console.error(e);

    return formatJSONErrorResponse(e, SOURCE);
  }
  finally {
    s3Client.destroy();
  }
};

export const main = middy(importFileParser);