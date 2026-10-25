import {createFileRoute,Link} from '@tanstack/react-router';
import {useEffect,useState,type FormEvent} from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ng66Logo from '@/assets/ng66-logo.jpg.asset.json';
export const Route=createFileRoute('/reset-password')({head:()=>({meta:[{title:'Reset password | NG66 Velvet Vault'},{name:'description',content:'Securely recover your Velvet Vault player account.'},{property:'og:title',content:'Reset password | NG66 Velvet Vault'},{property:'og:description',content:'Recover your Velvet Vault account securely.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]}),component:ResetPassword});
function ResetPassword(){const [recovery,setRecovery]=useState(false),[message,setMessage]=useState(''),[busy,setBusy]=useState(false);
 useEffect(()=>{const hash=new URLSearchParams(window.location.hash.slice(1));setRecovery(hash.get('type')==='recovery');},[]);
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);const form=new FormData(e.currentTarget);try{const {error}=recovery?await supabase.auth.updateUser({password:String(form.get('password'))}):await supabase.auth.resetPasswordForEmail(String(form.get('email')).trim(),{redirectTo:window.location.origin+'/reset-password'});if(error)throw error;setMessage(recovery?'Password updated. You can return to the lobby.':'Check your email for a password reset link.');}catch(e){setMessage(e instanceof Error?e.message:'Please try again');}finally{setBusy(false);}}
 return <main className="reset-page"><Link to="/" className="brand" aria-label="NG66 Bet — Velvet Vault"><img src={ng66Logo.url} alt="NG66 Bet" width={68} height={68}/><small>VELVET VAULT</small></Link><h1 className="text-3xl font-semibold mt-10 mb-6">{recovery?'Set a new password':'Reset your password'}</h1><form className="space-y-4" onSubmit={submit}><Label htmlFor="reset-value">{recovery?'New password':'Email address'}</Label><Input id="reset-value" name="reset-value" type={recovery?'password':'email'} required minLength={recovery?8:undefined} maxLength={recovery?128:255}/><Button type="submit" disabled={busy} className="w-full">{busy?'Please wait…':recovery?'Update password':'Send reset link'}</Button></form>{message&&<p role="status" className="mt-4 text-primary">{message}</p>}<Link to="/" className="block mt-6 text-muted-foreground">← Back to lobby</Link></main>;
}
