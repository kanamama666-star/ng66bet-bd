import { useState, type FormEvent } from 'react';
import { Phone, Lock, Eye, EyeOff, ChevronDown, UserRound } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { Dialog,DialogContent,DialogTitle,DialogDescription } from '@/components/ui/dialog';
import { playerLogin, playerRegister } from '@/lib/player-auth.functions';
import { loginSchema, registerSchema } from '@/lib/player-auth-rules';
const HINT='দয়া করে 6 - 13 বর্ণমালা এবং সংখ্যাসহ বিশেষ চিহ্ন ছাড়া একটি অক্ষর লিখুন';
function errorText(e:unknown){if(e && typeof e==='object' && 'issues' in e){const i=(e as {issues:{message:string}[]}).issues;if(i?.[0])return i[0].message;}return e instanceof Error?e.message:'আবার চেষ্টা করুন';}
export function AuthDialog({open,onOpenChange}:{open:boolean;onOpenChange:(v:boolean)=>void}){
 const [signup,setSignup]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[show,setShow]=useState(false),[remember,setRemember]=useState(true),[typed,setTyped]=useState(false);
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();setMessage('');
  const f=new FormData(e.currentTarget);const get=(k:string)=>String(f.get(k)??'');
  try{
   const tokens=signup?(()=>{const d=registerSchema.parse({username:get('username'),phone:get('phone'),password:get('password'),deviceId:deviceId(),ref:get('ref')||storedRef()});setBusy(true);return playerRegister({data:d});})():(()=>{const d=loginSchema.parse({identifier:get('identifier'),password:get('password'),deviceId:deviceId()});setBusy(true);return playerLogin({data:d});})();
   const {error}=await supabase.auth.setSession(await tokens);if(error)throw error;
   onOpenChange(false);
  }catch(err){setMessage(errorText(err));}finally{setBusy(false);}
 }
 async function google(){
  setBusy(true);setMessage('');
  try{const r=await lovable.auth.signInWithOAuth('google',{redirect_uri:window.location.origin});if(r.error)throw r.error;if(!r.redirected)onOpenChange(false);}catch(e){setMessage(errorText(e));}finally{setBusy(false);}
 }
 function toggle(){setSignup(!signup);setMessage('');setTyped(false);}
 const title=signup?'নিবন্ধন':'লগইন';
 return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="portal-dialog login-sheet">
  <div className="login-brand">NG66 <span>Bet</span></div>
  <DialogTitle className="login-title">{title}</DialogTitle>
  <DialogDescription className="sr-only">NG66 Bet {title}</DialogDescription>
  <form key={title} onSubmit={submit} className="login-form">
   {signup?<>
    <label className="login-field"><UserRound/><input name="username" placeholder="ইউজার নেম" aria-label="ইউজার নেম" required maxLength={13} autoComplete="username" onChange={e=>setTyped(e.target.value.length>0)}/></label>
    {!typed&&<p className="login-hint">{HINT}</p>}
    <label className="login-field"><Phone/><input name="phone" type="tel" inputMode="numeric" placeholder="মোবাইল নম্বর" aria-label="মোবাইল নম্বর" required maxLength={11} autoComplete="tel"/></label>
    <label className="login-field"><Gift/><input name="ref" placeholder="আমন্ত্রণ কোড (ঐচ্ছিক)" aria-label="আমন্ত্রণ কোড" maxLength={8} autoCapitalize="characters"/></label>
   </>:<>
    <label className="login-field"><UserRound/><input name="identifier" placeholder="ইউজার নেম অথবা মোবাইল নম্বর" aria-label="ইউজার নেম অথবা মোবাইল নম্বর" required maxLength={20} autoComplete="username" onChange={e=>setTyped(e.target.value.length>0)}/></label>
    {!typed&&<p className="login-hint">{HINT}</p>}
   </>}
   <label className="login-field login-field-dark"><Lock/><input name="password" type={show?'text':'password'} placeholder="পাসওয়ার্ড" aria-label="পাসওয়ার্ড" required minLength={8} maxLength={128} autoComplete={signup?'new-password':'current-password'}/><button type="button" className="login-eye" aria-label={show?'পাসওয়ার্ড লুকান':'পাসওয়ার্ড দেখুন'} onClick={()=>setShow(!show)}>{show?<EyeOff/>:<Eye/>}</button></label>
   {!signup&&<div className="login-options"><label className="login-remember"><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/>মনে রাখুন</label><Link to="/reset-password" onClick={()=>onOpenChange(false)}>পাসওয়ার্ড ভুলে গেছেন?</Link></div>}
   <button disabled={busy} className="login-submit" type="submit">{busy?'অপেক্ষা করুন…':title}</button>
  </form>
  {message&&<p role="status" className="login-message">{message}</p>}
  <button type="button" className="login-google" disabled={busy} onClick={google}><svg viewBox="0 0 24 24" aria-hidden width="20" height="20"><path fill="currentColor" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3ZM12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Zm-5.6-8a6 6 0 0 1 0-3.9V7.5H3.1a10 10 0 0 0 0 9L6.4 14ZM12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.5l3.3 2.6C7.2 7.8 9.4 6 12 6Z"/></svg>Google দিয়ে চালিয়ে যান</button>
  <p className="login-switch">{signup?'ইতিমধ্যে অ্যাকাউন্ট আছে?':'একটি অ্যাকাউন্ট নেই?'} <button type="button" onClick={toggle}>{signup?'লগইন':'নিবন্ধন'}</button></p>
  <label className="login-lang"><span className="bd-flag" aria-hidden/><select aria-label="ভাষা" defaultValue="bn"><option value="bn">বাংলা</option></select><ChevronDown size={16}/></label>
 </DialogContent></Dialog>;
}

function deviceId(){try{let v=localStorage.getItem('ng66-device');if(!v){v=crypto.randomUUID();localStorage.setItem('ng66-device',v);}return v;}catch{return undefined;}}
function storedRef(){try{const q=new URLSearchParams(location.search).get('ref');if(q)localStorage.setItem('ng66-ref',q);return (q||localStorage.getItem('ng66-ref')||undefined)?.toUpperCase();}catch{return undefined;}}
