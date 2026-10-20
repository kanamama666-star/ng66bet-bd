import {createFileRoute} from '@tanstack/react-router';
import {GatewayManagement} from '@/components/admin/gateway-management';
import {adminHead} from '@/lib/admin-head';
export const Route=createFileRoute('/admin/gateways')({head:()=>adminHead('Payment Gateways','Manage NG66 payment gateways securely in your local Admin Panel.'),component:Page});
function Page(){return <GatewayManagement/>;}
