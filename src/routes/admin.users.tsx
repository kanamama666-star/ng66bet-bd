import {createFileRoute} from '@tanstack/react-router';
import {UserManagement} from '@/components/admin/user-management';
import {adminHead} from '@/lib/admin-head';
export const Route=createFileRoute('/admin/users')({head:()=>adminHead('User Management','Manage NG66 user management securely in your local Admin Panel.'),component:Page});
function Page(){return <UserManagement/>;}
