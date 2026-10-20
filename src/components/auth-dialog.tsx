import { useState, type FormEvent } from 'react';
import { LogIn, Mail } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { Button } from '@/components/ui/button';
import { Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import '@lovable.dev/cloud-auth-js/styles.css';
export function AuthDialog({open,onOpenChange}:{open:boolean;onOpenChange:(v:boolean)=>void}){
 const [signup,setSignup]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();setBusy(true);setMessage('');
  const form=new FormData(e.currentTarget);const email=String(form.get('email')).trim();const password=String(form.get('password'));
  try {
   const result=signup?await supabase.auth.signUp({email,password,options:{emailRedirectTo:window.location.origin,data:{display_name:String(form.get('display_name')).trim()}}}):await supabase.auth.signInWithPassword({email,password});
   if(result.error) throw result.error;
   if(signup && !result.data.session)setMessage('Check your email to confirm your account before signing in.');
   else onOpenChange(false);
  }catch(error){setMessage(error instanceof Error?error.message:'Unable to sign in');}finally{setBusy(false);}
 }
 async function social(provider:'google'|'lovable'){
  setBusy(true);setMessage('');
  try{const result=await lovable.auth.signInWithOAuth(provider,{redirect_uri:window.location.origin});if(result.error)throw result.error;if(!result.redirected)onOpenChange(false);}catch(e){setMessage(e instanceof Error?e.message:'Sign-in failed');}finally{setBusy(false);}
 }
 return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="portal-dialog"><DialogHeader><div className="text-primary mb-2"><LogIn size={28}/></div><DialogTitle>{signup?'Join Velvet Vault':'Welcome back'}</DialogTitle><DialogDescription>{signup?'Create your NG66 player account.':'Sign in to your NG66 account.'}</DialogDescription></DialogHeader>
 <form onSubmit={submit} className="space-y-4">{signup&&<div className="space-y-2"><Label htmlFor="display-name">Display name</Label><Input id="display-name" name="display_name" maxLength={60} required autoComplete="nickname"/></div>}<div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required autoComplete="email" maxLength={255}/></div><div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" required minLength={8} maxLength={128} autoComplete={signup?'new-password':'current-password'}/></div><Button disabled={busy} className="w-full" type="submit"><Mail/>{busy?'Please wait…':signup?'Create account':'Sign in'}</Button></form>
 {message&&<p role="status" className="text-sm text-primary">{message}</p>}<div className="auth-separator">or continue with</div><Button variant="outline" disabled={busy} onClick={()=>social('google')}>Continue with Google</Button><Button className="lovable-auth-button" disabled={busy} onClick={()=>social('lovable')}>Continue with Lovable</Button>
 <div className="flex justify-between gap-3 text-sm"><Button variant="link" className="p-0 h-auto" onClick={()=>{setSignup(!signup);setMessage('');}}>{signup?'Already have an account?':'Create an account'}</Button><Link to="/reset-password" className="text-muted-foreground" onClick={()=>onOpenChange(false)}>Forgot password?</Link></div></DialogContent></Dialog>;
}
