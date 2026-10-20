import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import {useQuery,useQueryClient} from '@tanstack/react-query';
import {supabase} from '@/integrations/supabase/client';
import {getAdminAccess,getAdminData} from '@/lib/admin.functions';
import {usePlayer} from '@/hooks/use-player';
import {AuthDialog} from '@/components/auth-dialog';
import {Button} from '@/components/ui/button';
import {ShieldCheck} from 'lucide-react';
type Value={language:'en'|'bn';setLanguage:(l:'en'|'bn')=>void;session:boolean;ready:boolean;allowed:boolean;accessLoading:boolean;error:Error|null};
const Context=createContext<Value|null>(null);
export function AdminProvider({children}:{children:ReactNode}){
 const {user,ready}=usePlayer();const [language,setLanguage]=useState<'en'|'bn'>('en');const qc=useQueryClient();
 const access=useQuery({queryKey:['admin-access',user?.id],queryFn:()=>getAdminAccess(),enabled:ready&&!!user,retry:false});
 const allowed=access.data?.allowed===true;
 useEffect(()=>{if(!allowed)return;const channel=supabase.channel('admin-local-live');for(const table of ['profiles','payment_requests','payment_gateways','site_notices','content_banners','account_activity','financial_ledger','user_roles'])channel.on('postgres_changes',{event:'*',schema:'public',table},()=>{qc.invalidateQueries({queryKey:['admin-data']});qc.invalidateQueries({queryKey:['admin-access']});});channel.subscribe();return()=>{void supabase.removeChannel(channel);};},[allowed,qc]);
 return <Context.Provider value={{language,setLanguage,session:!!user,ready,allowed,accessLoading:access.isFetching,error:access.error}}>{children}</Context.Provider>;
}
export function useAdmin(){const c=useContext(Context);if(!c)throw new Error('Admin provider required');return {...c,t:(en:string,bn:string)=>c.language==='en'?en:bn,format:(n:number)=>new Intl.NumberFormat(c.language==='en'?'en-US':'bn-BD',{maximumFractionDigits:2}).format(n)};}
export function useAdminData(){const {allowed}=useAdmin();const {user}=usePlayer();return useQuery({queryKey:['admin-data',user?.id],queryFn:()=>getAdminData(),enabled:allowed,retry:false,refetchInterval:15000});}
export function AdminGate({children}:{children:ReactNode}){const {ready,session,allowed,accessLoading,error}=useAdmin();const [open,setOpen]=useState(false);if(!ready||accessLoading)return <p className="py-16 text-center text-muted-foreground">Checking administrator access…</p>;if(allowed)return <>{children}</>;return <section className="mx-auto max-w-lg py-12"><ShieldCheck className="mb-5 text-primary" size={40}/><h1 className="text-2xl font-bold">{session?'Administrator access required':'NG66 Admin Panel'}</h1><p className="my-5 text-muted-foreground">{error?'Unable to verify access. Please try again.':session?'Your account has not been authorized as an administrator. Contact the platform owner.':'Sign in with an authorized administrator account.'}</p><Button onClick={()=>session?supabase.auth.signOut():setOpen(true)}>{session?'Sign out':'Sign in'}</Button><AuthDialog open={open} onOpenChange={setOpen}/></section>;}
export function DataState({loading,error}:{loading:boolean;error:Error|null}){if(loading)return <p className="py-10 text-center text-muted-foreground">Loading records…</p>;if(error)return <p role="alert" className="py-10 text-danger">{error.message}</p>;return null;}
