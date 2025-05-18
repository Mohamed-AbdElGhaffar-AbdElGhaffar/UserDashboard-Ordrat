import { ShopInfo } from "@/types";

export async function getFakeData({ lang, shopId }: { lang?: string; shopId: string }): Promise<ShopInfo | null> {
  try {
    const response = await fetch(
      `https://testapi.ordrat.com/api/FakeData/GetFakeDataByShopId/${shopId}`,
      {
        headers: {
          'Accept-Language': lang!,
        },
      }
    );

    const data: any = await response.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch shopId:", err);
    return null;
  }
}
