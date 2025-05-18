import { ShopInfo } from "@/types";

export async function AddContact({lang}: {lang?: string}): Promise<ShopInfo | null> {
  try {
    const response = await fetch(
      `https://testapi.ordrat.com/api/Shop/GetById/84911639-cb0c-4cfe-bdd2-ef5807f7f49c`,
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
