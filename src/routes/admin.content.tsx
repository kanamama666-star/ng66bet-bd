import {createFileRoute} from '@tanstack/react-router';
import {ContentManagement} from '@/components/admin/content-management';
import {adminHead} from '@/lib/admin-head';
export const Route=createFileRoute('/admin/content')({head:()=>adminHead('Banners & Notices','Manage NG66 banners & notices securely in your local Admin Panel.'),component:Page});
function Page(){return <ContentManagement/>;}
