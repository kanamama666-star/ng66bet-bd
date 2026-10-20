import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useRouter } from '@tanstack/react-router';
const PlayerContext = createContext<{ user: User | null; ready: boolean }>({user:null,ready:false});
export function PlayerProvider({children}: {children:ReactNode}) {
 const [user,setUser]=useState<User|null>(null);
 const [ready,setReady]=useState(false);
 const queryClient=useQueryClient();
 const router=useRouter();
 useEffect(()=>{
  let active=true;
  const refresh=()=>{supabase.auth.getUser().then(({data})=>{if(active){setUser(data.user);setReady(true);}});};
  const {data:{subscription}}=supabase.auth.onAuthStateChange(event=>{
   if(event!=='SIGNED_IN' && event!=='SIGNED_OUT' && event!=='USER_UPDATED') return;
   if(event==='SIGNED_OUT'){setUser(null);queryClient.removeQueries({queryKey:['player']});queryClient.removeQueries({queryKey:['transactions']});}
   else {queueMicrotask(refresh);queryClient.invalidateQueries({queryKey:['player']});}
   router.invalidate();
  });
  refresh();
  return ()=>{active=false;subscription.unsubscribe();};
 },[queryClient,router]);
 useEffect(()=>{
  const channel=supabase.channel('portal-live').on('postgres_changes',{event:'*',schema:'public',table:'site_notices'},()=>queryClient.invalidateQueries({queryKey:['cms']})).on('postgres_changes',{event:'*',schema:'public',table:'content_banners'},()=>queryClient.invalidateQueries({queryKey:['cms']}));
  if(user) {
   channel.on('postgres_changes',{event:'*',schema:'public',table:'profiles',filter:`id=eq.${user.id}`},()=>queryClient.invalidateQueries({queryKey:['player']}));
   channel.on('postgres_changes',{event:'*',schema:'public',table:'payment_requests',filter:`user_id=eq.${user.id}`},()=>{queryClient.invalidateQueries({queryKey:['transactions']});queryClient.invalidateQueries({queryKey:['player']});});
  }
  channel.subscribe();
  return ()=>{void supabase.removeChannel(channel);};
 },[user,queryClient]);
 return <PlayerContext.Provider value={{user,ready}}>{children}</PlayerContext.Provider>;
}
export function usePlayer(){
 const {user,ready}=useContext(PlayerContext);
 const profile=useQuery({queryKey:['player',user?.id],enabled:!!user,queryFn:async()=>{
  if(!user) return null;
  const {data,error}=await supabase.from('profiles').select('*').eq('id',user.id).single();
  if(error) throw error;
  return data;
 }});
 return {user,ready,profile:profile.data,profileError:profile.error};
}
