import { useEffect, useState } from 'react';

import { tokenStore } from '@/lib/auth/token-store';

/** The JWT `preferredCurrency` claim, falling back to USD. `undefined` while loading. */
export function usePreferredCurrency(): string | undefined {
  const [currency, setCurrency] = useState<string>();
  useEffect(() => {
    let active = true;
    tokenStore
      .preferredCurrency()
      .then((c) => active && setCurrency(c ?? 'USD'))
      .catch(() => active && setCurrency('USD'));
    return () => {
      active = false;
    };
  }, []);
  return currency;
}
