import { getProductsHandlerTest } from '@functions/get-products';

describe("[getProductsHandler not crashed]", () => {
    it("should not crash", async () => {
        await getProductsHandlerTest(null, null, null);
    });
});
