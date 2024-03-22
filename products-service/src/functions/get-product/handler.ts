import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyHandler } from 'aws-lambda';
import productsData from 'src/data/products.json';
import { Product } from 'src/types/product';

const getProduct: APIGatewayProxyHandler = async (event) => {
  console.info(`getProduct. Incoming event: ${JSON.stringify(event)}`);

  try {
    const { productId = '' } = event.pathParameters;
    const product = (productsData as Product[]).find(product => product.id === productId);

    if (product) {
      return formatJSONResponse({
        product: product,
      });
    }

    return formatJSONResponse({ message: `Product '${productId}' not found` }, 404);
  }
  catch (e) {
    return formatJSONResponse({
      error: e.stack
    });
  }
};

export const main = middyfy(getProduct);
export const getProductHandler = getProduct;
