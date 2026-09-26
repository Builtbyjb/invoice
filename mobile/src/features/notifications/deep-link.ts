import { router } from 'expo-router';

import { useAuthStore } from '@/stores/auth-store';
import { useCoordinatorStore, type DeepLink } from '@/stores/coordinator-store';

let navigatorReady = false;

/** Called by the (app) layout once it has mounted. */
export function setNavigatorReady(ready: boolean) {
  navigatorReady = ready;
}

/**
 * Replaces AppCoordinator.handle: close anything pushed over the tabs, then push the detail
 * onto the right tab's stack. Detail screens fetch by id and show their own error state.
 */
export function openDeepLink(link: DeepLink) {
  if (!navigatorReady || useAuthStore.getState().state !== 'authenticated') {
    useCoordinatorStore.getState().setPendingDeepLink(link);
    return;
  }
  if (router.canDismiss()) router.dismissAll();
  if (link.type === 'client') {
    router.push({ pathname: '/clients/[id]', params: { id: link.id } });
  } else {
    router.push({ pathname: '/invoices/[id]', params: { id: link.id } });
  }
}

export function consumePendingDeepLink() {
  const link = useCoordinatorStore.getState().consumePendingDeepLink();
  if (link) openDeepLink(link);
}
