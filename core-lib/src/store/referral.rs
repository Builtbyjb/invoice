use crate::utill::types::referral::ReferralData;

pub fn get_referral_data() -> ReferralData {
    ReferralData {
        total_referrals: 12,
        active_referrals: 8,
        total_earnings: 120.00,
        payout: 120.00,
        referral_code: "ACME125FT".to_string(),
    }
}
