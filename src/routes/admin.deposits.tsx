import {createFileRoute} from '@tanstack/react-router';
import {FinanceManagement} from '@/components/admin/finance-management';
import {adminHead} from '@/lib/admin-head';
export const Route=createFileRoute('/admin/deposits')({head:()=>adminHead('Deposit Reviews','Manage NG66 deposit reviews securely in your local Admin Panel.'),component:Page});
function Page(){return <FinanceManagement kind="deposit"/>;}
