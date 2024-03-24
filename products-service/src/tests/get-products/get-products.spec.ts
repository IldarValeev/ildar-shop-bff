import { getProductsHandlerTest } from '@functions/getProductsList';

describe("[getProductsHandler not crashed]", () => {
    it("should not crash", async () => {
        await getProductsHandlerTest(null, null, null);
    });
});
