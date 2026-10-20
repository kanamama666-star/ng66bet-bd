import {createFileRoute} from '@tanstack/react-router';
import {AdminDashboard} from '@/components/admin/dashboard';
import {adminHead} from '@/lib/admin-head';
export const Route=createFileRoute('/admin/')({head:()=>adminHead('Dashboard','Manage NG66 dashboard securely in your local Admin Panel.'),component:Page});
function Page(){return <AdminDashboard/>;}
