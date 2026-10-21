import {createFileRoute} from '@tanstack/react-router';
import {MemberDashboard} from '@/components/member-dashboard';
export const Route=createFileRoute('/member')({
 head:()=>({meta:[{title:'সদস্য — NG66 Bet'},{name:'description',content:'NG66 Bet member account, wallet, VIP rewards, referrals and inbox.'},{property:'og:title',content:'সদস্য — NG66 Bet'},{property:'og:description',content:'Your NG66 Bet member wallet, rewards and private account records.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),
 component:MemberDashboard,
});
