import {createFileRoute,Outlet} from '@tanstack/react-router';
import {AdminProvider,AdminGate} from '@/components/admin/admin-context';
import {AdminShell} from '@/components/admin/admin-shell';
import {adminHead} from '@/lib/admin-head';
export const Route=createFileRoute('/admin')({head:()=>adminHead('Administrator access','Secure email sign-in and account management for NG66 Bet administrators.'),ssr:false,component:AdminLayout});
function AdminLayout(){return <AdminProvider><AdminShell><AdminGate><Outlet/></AdminGate></AdminShell></AdminProvider>;}
