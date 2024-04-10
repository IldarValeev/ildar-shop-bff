import { ValidatedEventAPIGatewayProxyEvent, formatJSONErrorResponse, formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import schema from './schema';

const SOURCE = `Lambda [importProductFile] -`

const importProductFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log(`${SOURCE} started`);
  console.log(`${SOURCE} event: ${JSON.stringify(event)}`);

  const s3Client = new S3Client({region: 'eu-west-1'});

  try {
    const fileName = event.queryStringParameters?.name;
    console.log(`Get signed url for file ${fileName}`); 

    const catalogPath = `${process.env.UPLOADED_FOLDER}/${fileName}`;
    const command = new PutObjectCommand({ Bucket: process.env.BUCKET_NAME, Key: catalogPath });
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });

    console.log(`${SOURCE} signedUrl created: ${signedUrl}`);

    return formatJSONResponse(signedUrl);
  }
  catch (e) {
    console.error(e);
    
    return formatJSONErrorResponse(e, SOURCE);
  }
  finally {
    s3Client.destroy();
  }
};

export const main = middyfy(importProductFile);