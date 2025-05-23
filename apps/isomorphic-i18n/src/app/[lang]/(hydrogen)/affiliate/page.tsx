import PageHeader from '@/app/shared/page-header';
import { metaObject } from '@/config/site.config';
import { GetCookiesServer } from '@/app/components/ui/getCookiesServer/GetCookiesServer';
import AffiliateComponent from '@/app/components/affiliate/affiliateComponent/AffiliateComponent';
import { API_BASE_URL } from '@/config/base-url';

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const lang = params.lang;
  return {
    ...metaObject(
      lang === 'ar'
        ? 'نظام الشركاء | اربح من خلال الترويج لأوردات'
        : 'Affiliate Program | Earn by Promoting Ordrat',
      lang,
      undefined,
      lang === 'ar'
        ? 'انضم إلى نظام الشركاء وابدأ في تحقيق الأرباح من خلال دعوة المستخدمين والمتاجر إلى منصة أوردات.'
        : 'Join the affiliate program and start earning by inviting users and shops to the Ordrat platform.'
    ),
  };
}

async function getValidAccessToken(accessToken: string | null, refreshToken: string | null): Promise<string | null> {
  if (!accessToken && refreshToken) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/Auth/RefreshAccessToken`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) throw new Error('Token refresh failed');
      const data = await res.json();
      return data.accessToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  }

  return accessToken;
}

async function fetchAffiliateLink(accessToken: string | null, refreshToken: string | null) {
  const token = await getValidAccessToken(accessToken, refreshToken);
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/api/Affiliate/link`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch affiliate link');
    const data = await res.json();
    return data.affiliateLink || null;
  } catch (error) {
    console.error('Error fetching affiliate link:', error);
    return null;
  }
}

async function fetchAffiliateStats(accessToken: string | null, refreshToken: string | null) {
  const token = await getValidAccessToken(accessToken, refreshToken);
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/api/Affiliate/stats`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch affiliate stats');
    return await res.json();
  } catch (error) {
    console.error('Error fetching affiliate stats:', error);
    return null;
  }
}

async function fetchAffiliateWallet(accessToken: string | null, refreshToken: string | null) {
  const token = await getValidAccessToken(accessToken, refreshToken);
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/api/Affiliate/wallet`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch affiliate wallet');
    return await res.json();
  } catch (error) {
    console.error('Error fetching affiliate wallet:', error);
    return null;
  }
}

export default async function AffiliatePage({
  params: { lang },
}: {
  params: {
    lang: string;
  };
}) {
  const accessToken = GetCookiesServer('accessToken');
  const refreshToken = GetCookiesServer('refreshToken');

  const [affiliateLink, affiliateStats, affiliateWallet] = await Promise.all([
    fetchAffiliateLink(accessToken, refreshToken),
    fetchAffiliateStats(accessToken, refreshToken),
    fetchAffiliateWallet(accessToken, refreshToken),
  ]);

  const pageHeader = {
    title: lang === 'ar' ? 'الشركاء' : 'Affiliate',
    breadcrumb: [
      {
        href: `/${lang}/storeSetting/basicData`,
        name: lang === 'ar' ? 'المتجر' : 'Store',
      },
      {
        name: lang === 'ar' ? 'الشركاء' : 'Affiliate',
      },
    ],
  };

  return (
    <div>
      <PageHeader title={pageHeader.title} breadcrumb={pageHeader.breadcrumb} />
      <AffiliateComponent
        lang={lang}
        affiliateLink={affiliateLink}
        affiliateStats={affiliateStats}
        affiliateWallet={affiliateWallet}
      />
    </div>
  );
}
