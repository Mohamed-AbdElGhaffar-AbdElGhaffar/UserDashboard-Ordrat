import { API_BASE_URL } from "@/config/base-url";
import axios from "axios";

export async function fetchShopData(lang: string, shopId: string) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/Shop/GetById/${shopId}`,
      {
        headers: {
          "Accept-Language": lang,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching shop data:", error);
    return null;
  }
}