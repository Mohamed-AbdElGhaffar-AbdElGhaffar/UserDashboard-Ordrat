import { pagesOptions } from "@/app/api/auth/[...nextauth]/pages-options";
import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";
import acceptLanguage from "accept-language";
import { fallbackLng, languages } from "./app/i18n/settings";

acceptLanguage.languages(languages);

export default withAuth({
  pages: {
    ...pagesOptions,
  },
});

export const config = {
  // restricted routes
  matcher: [
    "/",
    "/analytics",
    "/logistics/:path*",
    "/ecommerce/:path*",
    "/support/:path*",
    "/file/:path*",
    "/file-manager",
    "/invoice/:path*",
    "/manifest.json",
    "/forms/profile-settings/:path*",
    "/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)",
  ],
};

const cookieName = "i18next";



export const routeRoles: Record<string, string[]> = {
  "/affiliate": [ "/sellerDashboard/affiliate", "sellerDashboard-affiliate", "لوحة-تحكم-التاجر-الشركاء", ],
  "/printer": [ "/sellerDashboard/printer", "sellerDashboard-printer", "لوحة-تحكم-التاجر-الطابعة", ],
  "/storeSetting/branches": [ "/sellerDashboard/branches", "sellerDashboard-branches", "لوحة-تحكم-التاجر-الفروع", ],
  "/marketingtools/coupon": [ "/sellerDashboard/coupon", "sellerDashboard-coupon", "لوحة-تحكم-التاجر-قسيمة", ],
  "/delivery": [ "/sellerDashboard/delivery", "sellerDashboard-delivery", "لوحة-تحكم-التاجر-التوصيل", ],
  "/delivery/create": [ "/sellerDashboard/delivery/create", "sellerDashboard-delivery-create", "لوحة-تحكم-التاجر-التوصيل-إنشاء", ],
  "/delivery/chat": [ "/sellerDashboard/delivery/chat", "sellerDashboard-delivery-chat", "لوحة-تحكم-التاجر-التوصيل-محادثة", ],
  "/term/faq": [ "/sellerDashboard/faq", "sellerDashboard-faq", "لوحة-تحكم-التاجر-الأسئلة-الشائعة", ],
  "/groups-permissions": [ "/sellerDashboard/groups-permissions", "sellerDashboard-groups-permissions", "لوحة-تحكم-التاجر-الجروبات-والصلاحيات", ],
  "/marketingtools/banner": [ "/sellerDashboard/marketingtools/banner", "sellerDashboard-marketingtools-banner", "لوحة-تحكم-التاجر-ادوات-التسويق-البانر", ],
  "/marketingtools/whatsapp": [ "/sellerDashboard/marketingtools/whatsapp", "sellerDashboard-marketingtools-whatsapp", "لوحة-تحكم-التاجر-ادوات-التسويق-الواتساب", ],
  "/orders": [ "/sellerDashboard/orders", "sellerDashboard-orders", "لوحة-تحكم-التاجر-الطلبات", ],
  "/plans/allPlans": [ "/sellerDashboard/plans/allPlans", "sellerDashboard-plans-allPlans", "لوحة-تحكم-التاجر-الخطط-كل-الخطط", ],
  "/plans/myPlan": [ "/sellerDashboard/plans/myPlan", "sellerDashboard-plans-myPlan", "لوحة-تحكم-التاجر-الخطط-خطتي", ],
  "/point-of-sale": [ "/sellerDashboard/point-of-sale", "sellerDashboard-point-of-sale", "لوحة-تحكم-التاجر-الكاشير", ],
  "/storeSetting/tables": [ "/sellerDashboard/tables", "sellerDashboard-tables", "لوحة-تحكم-الطاولات", ],
  "/statistics": [ "/sellerDashboard/statistics", "sellerDashboard-statistics", "لوحة-تحكم-التاجر-الإحصائيات", ],
  "/storeProducts/categories": [ "/sellerDashboard/storeProducts/categories", "sellerDashboard-storeProducts-categories", "لوحة-تحكم-التاجر-منتجات-المتجر-الأقسام", ],
  "/storeProducts/products": [ "/sellerDashboard/storeProducts/products", "sellerDashboard-storeProducts-products", "لوحة-تحكم-التاجر-منتجات-المتجر-المنتجات", ],
  "/storeProducts/products/create": [ "/sellerDashboard/storeProducts/products/create", "sellerDashboard-storeProducts-products-create", "لوحة-تحكم-التاجر-منتجات-المتجر-المنتجات-إضافة", ],
  "/storeSetting/basicData": [ "/sellerDashboard/storeSetting/basicData", "sellerDashboard-storeSetting-basicData", "لوحة-تحكم-التاجر-إعدادت-المتجر-البيانات-الأساسية", ],
  "/storeSetting/contactInfo": [ "/sellerDashboard/storeSetting/contactInfo", "sellerDashboard-storeSetting-contactInfo", "لوحة-تحكم-التاجر-إعدادات-المتجر-معلومات-الاتصال", ],
  "/marketingtools/additional-settings": [ "/sellerDashboard/storeSetting/additional-settings", "sellerDashboard-storeSetting-additional-settings", "لوحة-تحكم-التاجر-إعدادات-المتجر-إعدادات-إضافية", ],
  "/storeSetting/delivery-shipping": [ "/sellerDashboard/storeSetting/delivery-shipping", "sellerDashboard-storeSetting-delivery-shipping", "لوحة-تحكم-التاجر-إعدادات-المتجر-التوصيل-والشحن", ],
  "/marketingtools/platforms": [ "/sellerDashboard/storeSetting/platforms", "sellerDashboard-storeSetting-platforms", "لوحة-تحكم-التاجر-إعدادات-المتجر-المنصات", ],
  "/storeSetting/qr-code": [ "/sellerDashboard/storeSetting/qr-code", "sellerDashboard-storeSetting-qr-code", "لوحة-تحكم-التاجر-إعدادات-المتجر-الباركود", ],
  "/marketingtools/seo": [ "/sellerDashboard/storeSetting/seo", "sellerDashboard-storeSetting-seo", "لوحة-تحكم-التاجر-إعدادات-المتجر-تحسين-محركات-البحث", ],
  "/storeSetting/contact-info": [ "/sellerDashboard/storeSetting/contact-info", "sellerDashboard-storeSetting-contact-info", "لوحة-تحكم-التاجر-إعدادات-المتجر-معلومات-الاتصال", ],
  "/term/privacy": [ "/sellerDashboard/term/privacy", "sellerDashboard-term-privacy", "لوحة-تحكم-التاجر-الشروط-والاحكام-سياسة-الخصوصية", ],
  "/term/refund": [ "/sellerDashboard/term/refund", "sellerDashboard-term-refund", "لوحة-تحكم-التاجر-الشروط-والاحكام-سياسة-الاسترداد", ],
  "/abandonedOrders": [ "/sellerDashboard/abandonedOrders", "sellerDashboard-abandonedOrders", "لوحة-تحكم-التاجر-الطلبات المتروكة", ],
  "/manifest.json": [ "/manifest.json", "manifest.json" ],
};
export const routeRolesInCludes: Record<string, string[]> = {
  "/delivery/details": [ "GetDeliverById" ],
  "/orders/": [ "OrderDetails" ],
  "/orders/assignToDelivery/": [ "AssignOrderToDelivery" ],
  "/storeProducts/products/update": [ "/sellerDashboard/storeProducts/products/update", "sellerDashboard-storeProducts-products-update", "لوحة-تحكم-التاجر-منتجات-المتجر-المنتجات-تعديل", ],
};

export async function middleware(req: any) {
  if (
    // req.nextUrl.pathname.indexOf('icon') > -1 ||
    req.nextUrl.pathname.indexOf("chrome") > -1
  )
    return NextResponse.next();
  
  const { pathname } = req.nextUrl;
  let lang;

  const langSignin = languages.find((l) => pathname === `/${l}/signin`);
  
  // 🔐 Access Token check
  // const refreshToken = req.cookies.get("refreshToken")?.value;

  // if (accessToken) {
  //   const res = NextResponse.next();
  //   res.headers.set('Cache-Control', 'no-store');
  //   return res;
  // }  
  // console.log("refreshToken: ",refreshToken);
  // if (!refreshToken && pathname != '/en/signin' && pathname != '/ar/signin') {
  //   console.log("refreshToken: ",refreshToken);
  //   // console.log("pathname: ",pathname);
  //   // console.log("lang: ",lang);
  //   const loginUrl = new URL(`/ar/signin`, req.url);
  //   return NextResponse.redirect(loginUrl);
  // }

  if (req.cookies.has(cookieName)) lang = acceptLanguage.get(req.cookies.get(cookieName).value);
  if (!lang) lang = acceptLanguage.get(req.headers.get("Accept-Language"));
  if (!lang) lang = fallbackLng;

  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!refreshToken && !pathname.includes("/signin") && !pathname.includes("/auth/forgot-password")&& !pathname.includes("/auth/otp")&& !pathname.includes("/auth/restart-password") && !pathname.includes("/manifest.json")) {
    return NextResponse.redirect(new URL(`/${lang}/signin`, req.url));
  }

  // 🧠 Check if path requires specific roles
  console.log("pathname: ",pathname);

  // ✅ Remove lang prefix (e.g., /en/delivery → /delivery)
  const normalizedPathname = languages.some((l) => pathname.startsWith(`/${l}/`))
    ? pathname.split('/').slice(2).join('/')
      ? `/${pathname.split('/').slice(2).join('/')}`
      : '/'
    : pathname;

  console.log("normalizedPathname:", normalizedPathname);

  const matchedPath = Object.keys(routeRoles).find((route) => normalizedPathname === route);
  try {
    if (matchedPath) {
      // 🔐 Call refresh token API
      const res = await fetch("https://testapi.ordrat.com/api/Auth/RefreshAccessToken", {
        method: "POST",
        headers: {
          "Accept-Language": lang,
          "refreshToken": refreshToken!,
        },
      });

      if (!res.ok) {
        const res = NextResponse.redirect(new URL(`/${lang}/signin`, req.url));
        res.cookies.delete("refreshToken");
        res.cookies.delete("roles");
        return res;
      }

      const data = await res.json();
      const userRoles: string[] = data.roles || [];
      // const userRoles: string[] = ["Marketing", "Admin", "Seller"];
      console.log("data: ",data);
      
      const requiredRoles = routeRoles[matchedPath];
      const hasRole = requiredRoles.some((role) => userRoles.includes(role));

      if (!hasRole) {
        return NextResponse.redirect(new URL(`/${lang}/unauthorized`, req.url));
      }

      // ✅ Update cookies
      const response = NextResponse.next();

      response.cookies.set("shopId", data.shopId, {
        path: "/",
        // httpOnly: true,
      });
      response.cookies.set("accessToken", data.accessToken, {
        path: "/",
        // httpOnly: true,
      });
      response.cookies.set("refreshToken", data.refreshToken, {
        path: "/",
        // httpOnly: true,
      });
      response.cookies.set("roles", JSON.stringify(data.roles), {
        path: "/",
        // httpOnly: true,
      });
      response.cookies.set("name", `${data.firstName} ${data.lastName}`, {
        path: "/",
        // httpOnly: true,
      });
      response.cookies.set("email", data.email, {
        path: "/",
        // httpOnly: true,
      });

      return response;
    }
  } catch (error) {
    console.error("Error during token refresh or role validation:", error);
    const redirectRes = NextResponse.redirect(new URL(`/${lang}/signin`, req.url));
    redirectRes.cookies.delete("refreshToken");
    redirectRes.cookies.delete("roles");
    return redirectRes;
  }
  const matchedPathIncludes = Object.keys(routeRolesInCludes).find((route) => pathname.includes(route));
  try {
    if (matchedPathIncludes) {
      // 🔐 Call refresh token API
      const res = await fetch("https://testapi.ordrat.com/api/Auth/RefreshAccessToken", {
        method: "POST",
        headers: {
          "Accept-Language": lang,
          "refreshToken": refreshToken!,
        },
      });

      if (!res.ok) {
        const res = NextResponse.redirect(new URL(`/${lang}/signin`, req.url));
        res.cookies.delete("refreshToken");
        res.cookies.delete("roles");
        return res;
      }

      const data = await res.json();
      const userRoles: string[] = data.roles || [];
      // const userRoles: string[] = ["Marketing", "Admin", "Seller"];
      console.log("data: ",data);
      
      const requiredRoles = routeRolesInCludes[matchedPathIncludes];
      const hasRole = requiredRoles.some((role) => userRoles.includes(role));

      if (!hasRole) {
        return NextResponse.redirect(new URL(`/${lang}/unauthorized`, req.url));
      }

      // ✅ Update cookies
      const response = NextResponse.next();

      response.cookies.set("shopId", data.shopId, {
        path: "/",
        // httpOnly: true,
      });
      response.cookies.set("accessToken", data.accessToken, {
        path: "/",
        // httpOnly: true,
      });
      response.cookies.set("refreshToken", data.refreshToken, {
        path: "/",
        // httpOnly: true,
      });
      response.cookies.set("roles", JSON.stringify(data.roles), {
        path: "/",
        // httpOnly: true,
      });
      response.cookies.set("name", `${data.firstName} ${data.lastName}`, {
        path: "/",
        // httpOnly: true,
      });
      response.cookies.set("email", data.email, {
        path: "/",
        // httpOnly: true,
      });

      return response;
    }
  } catch (error) {
    console.error("Error during token refresh or role validation:", error);
    const redirectRes = NextResponse.redirect(new URL(`/${lang}/signin`, req.url));
    redirectRes.cookies.delete("refreshToken");
    redirectRes.cookies.delete("roles");
    return redirectRes;
  }

  // Redirect '/' → '/{lang}/storeSetting/basicData'
  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${lang}/statistics`, req.url));
  }

  // Redirect '/en' or '/ar' → '/en/storeSetting/basicData'
  const langMatch = languages.find((l) => pathname === `/${l}`);
  const storeSetting = languages.find((l) => pathname === `/${l}/storeSetting`);
  const marketingtools = languages.find((l) => pathname === `/${l}/marketingtools`);
  const storeProducts = languages.find((l) => pathname === `/${l}/storeProducts`);
  const plans = languages.find((l) => pathname === `/${l}/plans`);
  const term = languages.find((l) => pathname === `/${l}/term`);
  if (langMatch) {
    return NextResponse.redirect(new URL(`/${langMatch}/statistics`, req.url));
  }
  if (storeSetting) {
    return NextResponse.redirect(new URL(`/${storeSetting}/storeSetting/basicData`, req.url));
  }
  if (marketingtools) {
    return NextResponse.redirect(new URL(`/${marketingtools}/marketingtools/banner`, req.url));
  }
  if (storeProducts) {
    return NextResponse.redirect(new URL(`/${storeProducts}/storeProducts/categories`, req.url));
  }
  if (plans) {
    return NextResponse.redirect(new URL(`/${plans}/plans/allPlans`, req.url));
  }
  if (term) {
    return NextResponse.redirect(new URL(`/${term}/term/privacy`, req.url));
  }

  // Redirect if lng in path is not supported
  if (
    !languages.some((local) => req.nextUrl.pathname.startsWith(`/${local}`)) &&
    !req.nextUrl.pathname.startsWith("/_next")
  ) {
    return NextResponse.redirect(new URL(`/${lang}${req.nextUrl.pathname}`, req.url));
  }

  if (req.headers.has("referer")) {
    const refererUrl = new URL(req.headers.get("referer"));
    const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`));
    const response = NextResponse.next();
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer);
    return response;
  }

  return NextResponse.next();
}
