import { useEffect, useState } from "react";

export default function useCurrencyAbbreviation({ lang }: { lang: string }) {
  const [abbreviation, setAbbreviation] = useState<string>(''); // default

  useEffect(() => {
    const currencyId = localStorage.getItem("currencyId");
    if (!currencyId) return;

    const fetchAbbreviation = async () => {
      try {
        const res = await fetch(
          `https://testapi.ordrat.com/api/Currency/GetCurrencyById/${currencyId}`,
          {
            headers: {
              'Accept-Language': lang,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch abbreviation");

        const data = await res.json();
        setAbbreviation(data.abbreviation); // فقط خزّن في الستور
      } catch (err) {
        console.error("Fetch currency abbreviation failed:", err);
      }
    };

    fetchAbbreviation();
  }, [lang]);

  return abbreviation;
}

export function toCurrency(
  number: number | string,
  lang: string = 'en', // default to English
  disableDecimal = false,
  decimalPlaces = 2
) {
  const currencyDisplay = lang === 'ar' ? 'ج.م' : 'EGP';

  const formatter = new Intl.NumberFormat(lang, {
    style: 'currency',
    currency: 'EGP',
    currencyDisplay: 'code',
    minimumFractionDigits: disableDecimal ? 0 : decimalPlaces,
    maximumFractionDigits: disableDecimal ? 0 : decimalPlaces,
  });

  return formatter.format(+number).replace('EGP', currencyDisplay);
}
