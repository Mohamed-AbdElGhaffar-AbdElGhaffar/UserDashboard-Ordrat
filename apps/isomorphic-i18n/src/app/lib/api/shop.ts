import { ShopInfo } from "@/types";

export async function getShop({ lang, shopId }: { lang?: string; shopId: string }): Promise<ShopInfo | null> {
  try {
    const response = await fetch(
      `https://testapi.ordrat.com/api/Shop/GetById/${shopId}`,
      {
        headers: {
          'Accept-Language': lang!,
        },
      }
    );

    const data: ShopInfo = await response.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch shopId:", err);
    return null;
  }
}
