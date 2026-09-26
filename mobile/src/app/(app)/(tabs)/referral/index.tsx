import { useQuery } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Card } from '@/components/Card';
import { Icon } from '@/components/Icon';
import { IconTile } from '@/components/IconTile';
import { ScreenScrollView } from '@/components/ScreenScrollView';
import { StatCard } from '@/components/StatCard';
import { Text } from '@/components/Text';
import { radii, useTheme, withAlpha } from '@/constants/theme';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import { getReferral } from '@/lib/api/referral';
import { formatCurrency } from '@/lib/format';
import { qk } from '@/lib/query/keys';

const STEPS = [
  {
    title: '1. Share Your Referral Link',
    description: 'Share your referral link with your friends to earn rewards when they subscribe.',
  },
  {
    title: '2. Your Friend Subscribes',
    description: 'Your friend creates an account, and purchases a subscription.',
  },
  {
    title: '3. Earn Rewards',
    description: "You get 5% of each friend's subscription amount for as long as they are subscribed.",
  },
];

/** Port of ReferralView. */
export default function ReferralScreen() {
  const { colors } = useTheme();
  const { data: referral, refetch } = useQuery({ queryKey: qk.referral, queryFn: ({ signal }) => getReferral(signal) });
  useRefreshOnFocus(refetch);

  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = async () => {
    if (!referral) return;
    await Clipboard.setStringAsync(referral.referralCode);
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1500);
  };

  // One consistent currency format (Swift mixed "$0.00" and "%.2f", rewrite plan §6 #16).
  const usd = (v: number | undefined) => formatCurrency(v ?? 0, 'USD');

  return (
    <ScreenScrollView onRefresh={refetch}>
      <View style={{ padding: 16, gap: 20 }}>
        <View style={{ gap: 16 }}>
          <StatCard
            title="Total Referrals"
            value={String(referral?.totalReferrals ?? 0)}
            icon="person.2.fill"
            color={colors.blue}
          />
          <StatCard
            title="Active Referrals"
            value={String(referral?.activeReferrals ?? 0)}
            icon="person.fill.checkmark"
            color={colors.green}
          />
          <StatCard
            title="Total Earnings"
            value={usd(referral?.totalEarnings)}
            icon="dollarsign.circle.fill"
            color={colors.orange}
          />

          <Card style={{ gap: 12 }}>
            <IconTile sf="creditcard.fill" color={colors.purple} />
            <View style={{ gap: 4 }}>
              <Text variant="title2" weight="700" numberOfLines={1}>
                Payout
              </Text>
              <Text variant="subheadline" secondary numberOfLines={1}>
                Manage your earnings
              </Text>
            </View>
            {referral ? (
              <Text variant="title3" weight="600" testID="referral-payout">
                {usd(referral.payout)}
              </Text>
            ) : null}
            <View style={{ gap: 8 }}>
              {/* TODO: wire Claim and Setup Payment Method once the backend supports payouts. */}
              <Pressable
                accessibilityRole="button"
                onPress={() => {}}
                style={{ backgroundColor: colors.blue, borderRadius: radii.input, paddingVertical: 8, alignItems: 'center' }}
              >
                <Text variant="subheadline" weight="600" color="#FFFFFF">
                  Claim
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => {}}
                style={{
                  backgroundColor: colors.tertiaryBackground,
                  borderRadius: radii.input,
                  paddingVertical: 8,
                  alignItems: 'center',
                }}
              >
                <Text variant="subheadline" weight="600">
                  Setup Payment Method
                </Text>
              </Pressable>
            </View>
          </Card>
        </View>

        <Card style={{ gap: 16 }}>
          <Text variant="title3" weight="600">
            Your Referral Code
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Text
              testID="referral-code"
              weight="700"
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{ flex: 1, fontSize: 32, lineHeight: 38, fontFamily: 'ui-rounded' }}
            >
              {referral?.referralCode ?? '—'}
            </Text>
            <Pressable
              testID="referral-copy"
              accessibilityRole="button"
              accessibilityState={{ disabled: !referral }}
              disabled={!referral}
              onPress={copy}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: radii.input,
                backgroundColor: withAlpha(colors.blue, 0.15),
                opacity: referral ? 1 : 0.5,
              }}
            >
              <Icon sf={copied ? 'checkmark' : 'doc.on.doc'} size={14} color={colors.blue} weight="semibold" />
              <Text variant="subheadline" weight="600" color={colors.blue}>
                {copied ? 'Copied' : 'Copy'}
              </Text>
            </Pressable>
          </View>
          <Text variant="subheadline" secondary>
            Users that sign up with the referral code get one extra month free trial.
          </Text>
        </Card>

        <Card style={{ gap: 16 }}>
          <Text variant="title3" weight="600">
            How It Works
          </Text>
          <View style={{ gap: 16 }}>
            {STEPS.map((step, i) => (
              <Fragment key={step.title}>
                {i > 0 ? <View style={{ height: 0.5, backgroundColor: colors.separator }} /> : null}
                <View style={{ gap: 4 }}>
                  <Text variant="subheadline" weight="600">
                    {step.title}
                  </Text>
                  <Text variant="subheadline" secondary>
                    {step.description}
                  </Text>
                </View>
              </Fragment>
            ))}
          </View>
        </Card>
      </View>
    </ScreenScrollView>
  );
}
