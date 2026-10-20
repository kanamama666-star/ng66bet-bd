import {createFileRoute} from '@tanstack/react-router';
import {RoleManagement} from '@/components/admin/role-management';
import {adminHead} from '@/lib/admin-head';
export const Route=createFileRoute('/admin/settings')({head:()=>adminHead('Admin Roles & Settings','Manage NG66 admin roles & settings securely in your local Admin Panel.'),component:Page});
function Page(){return <RoleManagement/>;}
