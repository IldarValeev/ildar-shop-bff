import middy from '@middy/core';
import { SQSHandler } from "aws-lambda";

const SOURCE = `Lambda [catalogBatchProcess] -`

const catalogBatchProcess: SQSHandler  = async (event) => {
  console.log(`${SOURCE} started`);
  console.log(`${SOURCE} event: ${JSON.stringify(event)}`);

  try {
    console.log(JSON.stringify(event.Records));

    
  }
  catch (e) {
    console.error(e);

  }
  finally {
    //s3Client.destroy();
  }
};

export const main = middy(catalogBatchProcess);