import { GetCommandInput, GetCommandOutput, ScanCommandInput, ScanCommandOutput} from '@aws-sdk/lib-dynamodb';
import { DynamoDbService } from './dynamo-db-service-base';
import { IProduct, ProductsList } from 'src/types/product';
import { IStock } from 'src/types/stock';

const PRODUCTS_TABLE_NAME: string = process.env.PRODUCTS_TABLE_NAME;
const STOCKS_TABLE_NAME: string = process.env.STOCKS_TABLE_NAME;

export class ProductsDbService extends DynamoDbService {
    public async getProductsList(): Promise<ProductsList> {
        const productsParams: ScanCommandInput = {
            TableName: PRODUCTS_TABLE_NAME,
        };
        const stocksParams: ScanCommandInput = {
            TableName: STOCKS_TABLE_NAME,
        };

        const productsOutput: ScanCommandOutput = await this.scan(productsParams);
        const stocksOutput: ScanCommandOutput = await this.scan(stocksParams);

        const products: ProductsList = productsOutput?.Items as ProductsList;
        const stocks: IStock[] = stocksOutput?.Items as IStock[];

        return this.mergeProductsWithStocksByCount(products, stocks);
    }

    public async getProductById(id: string): Promise<IProduct> {
        const productParams: GetCommandInput = {
            TableName: PRODUCTS_TABLE_NAME,
            Key: {
                id,
            },
        };

        const stocksParams: GetCommandInput = {
            TableName: STOCKS_TABLE_NAME,
            Key: {
                product_id: id,
            },
        };
        const productsOutput: GetCommandOutput = await this.get(productParams);
        const stocksOutput: GetCommandOutput = await this.get(stocksParams);

        const product: IProduct = productsOutput?.Item as IProduct;
        const stock: IStock = stocksOutput?.Item as IStock;

        return product && this.mergeProductWithStockCount(product, stock);
    }

    private mergeProductsWithStocksByCount(products: ProductsList = [], stocks: IStock[] = []): ProductsList {
        return products.map((product: IProduct) => {
            const stock: IStock = stocks.find(({ product_id }: IStock): boolean => product.id == product_id);
            return this.mergeProductWithStockCount(product, stock);
        });
    }

	private mergeProductWithStockCount(product: IProduct, stock: IStock): IProduct {
        return {
            ...product,
            count: stock?.count || 0,
        };
    }
}