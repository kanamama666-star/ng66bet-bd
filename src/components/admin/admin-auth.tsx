import {useState,type FormEvent} from 'react';
import {Link} from '@tanstack/react-router';
import {Eye,EyeOff,ShieldCheck} from 'lucide-react';
import {supabase} from '@/integrations/supabase/client';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {adminLoginSchema,adminRegistrationSchema} from '@/lib/admin-auth-rules';
export function AdminAuth(){
 const [register,setRegister]=useState(false),[visible,setVisible]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[error,setError]=useState('');
 async function submit(event:FormEvent<HTMLFormElement>){event.preventDefault();setMessage('');setError('');setBusy(true);const form=new FormData(event.currentTarget);try{
  const credentials=(register?adminRegistrationSchema:adminLoginSchema).parse({email:form.get('email'),password:form.get('password')});
  const result=register?await supabase.auth.signUp({...credentials,options:{emailRedirectTo:`${window.location.origin}/admin`}}):await supabase.auth.signInWithPassword(credentials);
  if(result.error)throw result.error;
  if(register&&!result.data.session)setMessage('Check your email and confirm your account, then sign in here. Administrator access requires an authorized, verified email.');
 }catch(e){setError(e instanceof Error?e.message:'Unable to sign in. Please try again.');}finally{setBusy(false);}}
 return <section className="mx-auto max-w-md py-10"><ShieldCheck size={40} className="mb-5 text-primary"/><p className="mb-2 font-display text-xl font-extrabold">NG66 Bet</p><h1 className="mb-7 text-2xl font-bold">{register?'Create administrator account':'Administrator sign in'}</h1><form onSubmit={submit} className="space-y-5"><div><Label htmlFor="admin-email">Email address</Label><Input className="mt-2" id="admin-email" name="email" type="email" autoComplete="email" required maxLength={255} placeholder="Email address"/></div><div><Label htmlFor="admin-password">Password</Label><div className="relative mt-2"><Input className="pr-12" id="admin-password" name="password" type={visible?'text':'password'} autoComplete={register?'new-password':'current-password'} required minLength={register?12:1} maxLength={128}/><Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0" aria-label={visible?'Hide password':'Show password'} onClick={()=>setVisible(!visible)}>{visible?<EyeOff size={18}/>:<Eye size={18}/>}</Button></div></div>{error&&<p role="alert" className="text-sm text-danger">{error}</p>}{message&&<p role="status" className="text-sm text-primary">{message}</p>}<Button type="submit" className="w-full" disabled={busy}>{busy?'Please wait…':register?'Create account':'Sign in'}</Button></form><div className="mt-5 flex flex-wrap justify-between gap-3"><Button variant="link" className="h-auto p-0" disabled={busy} onClick={()=>{setRegister(!register);setMessage('');setError('');}}>{register?'Already registered? Sign in':'Create account'}</Button><Button asChild variant="link" className="h-auto p-0"><Link to="/reset-password">Forgot password?</Link></Button></div></section>;
}