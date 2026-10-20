import {createFileRoute,Outlet} from '@tanstack/react-router';
import {AdminProvider,AdminGate} from '@/components/admin/admin-context';
import {AdminShell} from '@/components/admin/admin-shell';
export const Route=createFileRoute('/admin')({ssr:false,component:AdminLayout});
function AdminLayout(){return <AdminProvider><AdminShell><AdminGate><Outlet/></AdminGate></AdminShell></AdminProvider>;}
