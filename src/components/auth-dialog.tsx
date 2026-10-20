import { useState, type FormEvent } from 'react';
import { Phone, Lock, Eye, EyeOff, ChevronDown, Mail, UserRound } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import { lovable } from '@/integrations/lovable';
import { Button } from '@/components/ui/button';
import { Dialog,DialogContent,DialogTitle,DialogDescription } from '@/components/ui/dialog';
import '@lovable.dev/cloud-auth-js/styles.css';
export function AuthDialog({open,onOpenChange}:{open:boolean;onOpenChange:(v:boolean)=>void}){
 const [signup,setSignup]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[show,setShow]=useState(false),[remember,setRemember]=useState(true);
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();setMessage('');
  const form=new FormData(e.currentTarget);const email=String(form.get('login')).trim();const password=String(form.get('password'));
  if(!email.includes('@')){setMessage('মোবাইল নম্বর দিয়ে লগইন এখনো চালু হয়নি — অনুগ্রহ করে আপনার ইমেইল ব্যবহার করুন।');return;}
  setBusy(true);
  try {
   const result=signup?await supabase.auth.signUp({email,password,options:{emailRedirectTo:window.location.origin,data:{display_name:String(form.get('display_name')).trim()}}}):await supabase.auth.signInWithPassword({email,password});
   if(result.error) throw result.error;
   if(signup && !result.data.session)setMessage('অ্যাকাউন্ট নিশ্চিত করতে আপনার ইমেইল চেক করুন।');
   else onOpenChange(false);
  }catch(error){setMessage(error instanceof Error?error.message:'লগইন ব্যর্থ হয়েছে');}finally{setBusy(false);}
 }
 async function social(provider:'google'|'lovable'){
  setBusy(true);setMessage('');
  try{const result=await lovable.auth.signInWithOAuth(provider,{redirect_uri:window.location.origin});if(result.error)throw result.error;if(!result.redirected)onOpenChange(false);}catch(e){setMessage(e instanceof Error?e.message:'Sign-in failed');}finally{setBusy(false);}
 }
 const title=signup?'নিবন্ধন':'লগইন';
 return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="portal-dialog login-sheet">
  <div className="login-brand">NG66 <span>Bet</span></div>
  <DialogTitle className="login-title">{title}</DialogTitle>
  <DialogDescription className="sr-only">NG66 Bet {title}</DialogDescription>
  <form onSubmit={submit} className="login-form">
   {signup&&<label className="login-field"><UserRound/><input name="display_name" placeholder="ইউজারনেম" maxLength={60} required autoComplete="nickname"/></label>}
   <label className="login-field"><Phone/><input name="login" placeholder="মোবাইল নম্বর" aria-label="মোবাইল নম্বর" required maxLength={255} autoComplete="username"/></label>
   <p className="login-hint">দয়া করে 6 - 13 বর্ণমালা এবং সংখ্যাসহ বিশেষ চিহ্ন ছাড়া একটি অক্ষর লিখুন</p>
   <label className="login-field login-field-dark"><Lock/><input name="password" type={show?'text':'password'} placeholder="পাসওয়ার্ড" aria-label="পাসওয়ার্ড" required minLength={8} maxLength={128} autoComplete={signup?'new-password':'current-password'}/><button type="button" className="login-eye" aria-label={show?'পাসওয়ার্ড লুকান':'পাসওয়ার্ড দেখুন'} onClick={()=>setShow(!show)}>{show?<EyeOff/>:<Eye/>}</button></label>
   {!signup&&<div className="login-options"><label className="login-remember"><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/>মনে রাখুন</label><Link to="/reset-password" onClick={()=>onOpenChange(false)}>পাসওয়ার্ড ভুলে গেছেন?</Link></div>}
   <button disabled={busy} className="login-submit" type="submit">{busy?'অপেক্ষা করুন…':title}</button>
  </form>
  {message&&<p role="status" className="login-message">{message}</p>}
  <p className="login-switch">{signup?'ইতিমধ্যে অ্যাকাউন্ট আছে?':'একটি অ্যাকাউন্ট নেই?'} <button type="button" onClick={()=>{setSignup(!signup);setMessage('');}}>{signup?'লগইন':'নিবন্ধন'}</button></p>
  <div className="login-social"><Button variant="outline" size="sm" disabled={busy} onClick={()=>social('google')}><Mail/>Google</Button><Button variant="outline" size="sm" disabled={busy} onClick={()=>social('lovable')}>Lovable</Button></div>
  <label className="login-lang"><span className="bd-flag" aria-hidden/><select aria-label="ভাষা" defaultValue="bn"><option value="bn">বাংলা</option></select><ChevronDown size={16}/></label>
 </DialogContent></Dialog>;
}
