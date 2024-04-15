import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import middy from '@middy/core';
import { SQSHandler } from "aws-lambda";
import { ProductsDbService } from 'src/data/db/db-service/products-dynamo-db-service';

const SOURCE = `Lambda [catalogBatchProcess] -`

const catalogBatchProcess: SQSHandler = async (event) => {
  console.log(`${SOURCE} started`);
  console.log(`${SOURCE} event: ${JSON.stringify(event)}`);

  const productsDbService = new ProductsDbService();
  const clientSns = new SNSClient({ region: "eu-west-1" });

  try {
    await Promise.all(event.Records.map(async record => {
      const createProductObj = JSON.parse(record.body);
      const newProduct = await productsDbService.createProduct(createProductObj);

      console.log(JSON.stringify(newProduct));
      await clientSns.send(new PublishCommand({
        TopicArn: process.env.SNS_ARN,
        Subject: "New Product Added",
        Message: JSON.stringify(newProduct),
      }));
    }));

    console.log("sending to SNS");

    await clientSns.send(new PublishCommand({
      TopicArn: process.env.SNS_ARN,
      Subject: "New Products Added",
      Message: "Please check app",
    }));
  }
  catch (e) {
    console.error(e);
  }
  finally {
    productsDbService.destroy();
    clientSns.destroy();
  }
}

export const main = middy(catalogBatchProcess);