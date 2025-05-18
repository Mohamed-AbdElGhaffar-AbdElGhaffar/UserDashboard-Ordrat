// app/lib/fetchTotalProducts.ts
import axios from 'axios';

export async function fetchTotalProducts(shopId: string) {
    try {
        const url = `https://testapi.ordrat.com/api/SellerStatistics/GetTotalProducts/${shopId}`;
        const { data } = await axios.get(url, {
            headers: {
                'accept': '*/*',
            }
        });

        console.log("📌 Server Response:", data); 
        return data;
    } catch (error) {
        console.error('❌ Error fetching total products:', error);
        return null; 
    }
}
export async function GetTotalCategories(shopId: string) {
    try {
        const url = `https://testapi.ordrat.com/api/SellerStatistics/GetTotalCategories/${shopId}`;
        const { data } = await axios.get(url, {
            headers: {
                'accept': '*/*',
            }
        });

        console.log("📌 Server Response:", data); 
        return data;
    } catch (error) {
        console.error('❌ Error fetching total products:', error);
        return null; 
    }
}
export async function GetTotalProductsVariations(shopId: string) {
    try {
        const url = `https://testapi.ordrat.com/api/SellerStatistics/GetTotalProductsVariations/${shopId}`;
        const { data } = await axios.get(url, {
            headers: {
                'accept': '*/*',
            }
        });

        console.log("📌 Server Response:", data); 
        return data;
    } catch (error) {
        console.error('❌ Error fetching total products:', error);
        return null; 
    }
}
export async function GetTotalOrders(shopId: string) {
    try {
        const url = `https://testapi.ordrat.com/api/SellerStatistics/GetTotalOrders/${shopId}`;
        const { data } = await axios.get(url, {
            headers: {
                'accept': '*/*',
            }
        });

        console.log("📌 Server Response555:", data); 
        return data;
    } catch (error) {
        console.error('❌ Error fetching total products:', error);
        return null; 
    }
}
export async function GetTotalCustomers(shopId: string) {
    try {
        const url = `https://testapi.ordrat.com/api/SellerStatistics/GetTotalCustomers/${shopId}`;
        const { data } = await axios.get(url, {
            headers: {
                'accept': '*/*',
            }
        });

        console.log("📌 Server Response222:", data); 
        return data;
    } catch (error) {
        console.error('❌ Error fetching total products:', error);
        return null; 
    }
}
export async function GetTotalDeliveries(shopId: string) {
    try {
        const url = `https://testapi.ordrat.com/api/SellerStatistics/GetTotalDeliveries/${shopId}`;
        const { data } = await axios.get(url, {
            headers: {
                'accept': '*/*',
            }
        });

        console.log("📌 Server Response222:", data); 
        return data;
    } catch (error) {
        console.error('❌ Error fetching total products:', error);
        return null; 
    }
}
export async function GetCancelledOrdersCount(shopId: string) {
    try {
        const url = `https://testapi.ordrat.com/api/SellerStatistics/GetCancelledOrdersCount/${shopId}`;
        const { data } = await axios.get(url, {
            headers: {
                'accept': '*/*',
            }
        });

        console.log("📌 Server Response222:", data); 
        return data;
    } catch (error) {
        console.error('❌ Error fetching total products:', error);
        return null; 
    }
}
export async function GetCancelledOrdersPercentage(shopId: string) {
    try {
        const url = `https://testapi.ordrat.com/api/SellerStatistics/GetCancelledOrdersPercentage/${shopId}`;
        const { data } = await axios.get(url, {
            headers: {
                'accept': '*/*',
            }
        });

        console.log("📌 Server Response2225:", data); 
        return data;
    } catch (error) {
        console.error('❌ Error fetching total products:', error);
        return null; 
    }
}
export async function GetTotalProfit(shopId: string) {
    try {
        const url = `https://testapi.ordrat.com/api/SellerStatistics/GetTotalProfit/${shopId}`;
        const { data } = await axios.get(url, {
            headers: {
                'accept': '*/*',
            }
        });

        console.log("📌 Server Response2225:", data); 
        return data;
    } catch (error) {
        console.error('❌ Error fetching total products:', error);
        return null; 
    }
}
export async function GetTopSellingProduct({lang}:{lang:string},shopId: string) {
    try {
        const url = `https://testapi.ordrat.com/api/SellerStatistics/GetTopSellingProduct/${shopId}`;
        const { data } = await axios.get(url, {
            headers: {
                'accept': '*/*',
                'Accept-Language':lang

            }
        });

        console.log("📌 Server Response2225:", data); 
        return data;
    } catch (error) {
        console.error('❌ Error fetching total products:', error);
        return null; 
    }
}
export async function GetTopRatedProducts({lang}:{lang:string},shopId: string) {
    try {
        const url = `https://testapi.ordrat.com/api/SellerStatistics/GetTopRatedProducts/${shopId}`;
        const { data } = await axios.get(url, {
            headers: {
                'accept': '*/*',
                'Accept-Language':lang

            }
        });

        console.log("📌 Server Response2225:", data); 
        return data;
    } catch (error) {
        console.error('❌ Error fetching total products:', error);
        return null; 
    }
}
export async function GetBestCustomers(shopId: string) {
    try {
        const url = `https://testapi.ordrat.com/api/SellerStatistics/GetBestCustomers/${shopId}`;
        const { data } = await axios.get(url, {
            headers: {
                'accept': '*/*',
            }
        });

        console.log("📌 Server Response2225:", data); 
        return data;
    } catch (error) {
        console.error('❌ Error fetching total products:', error);
        return null; 
    }
}
export async function GetTopSellingCategories({lang}:{lang:string},shopId: string) {
    try {
        const url = `https://testapi.ordrat.com/api/SellerStatistics/GetTopSellingCategories/${shopId}`;
        const { data } = await axios.get(url, {
            headers: {
                'accept': '*/*',
                'Accept-Language':lang

            }
        });

        console.log("📌 Server Response2225:", data); 
        return data;
    } catch (error) {
        console.error('❌ Error fetching total products:', error);
        return null; 
    }
}
