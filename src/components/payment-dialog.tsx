import { useState,type FormEvent } from 'react';
import { Upload,ArrowDownLeft,ArrowUpRight,CheckCircle2,AlertCircle } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { usePlayer } from '@/hooks/use-player';
import { paymentSchema,validateReceipt } from '@/lib/payment-rules';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription } from '@/components/ui/dialog';
export function PaymentDialog({kind,onClose}:{kind:'deposit'|'withdrawal'|null;onClose:()=>void}){
 const {user,profile}=usePlayer();const queryClient=useQueryClient();
 const [method,setMethod]=useState<'bKash'|'Nagad'>('bKash'),[file,setFile]=useState<File|null>(null),[error,setError]=useState(''),[busy,setBusy]=useState(false),[done,setDone]=useState(false);
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();if(!user||!kind)return;
  const form=new FormData(e.currentTarget);
  const parsed=paymentSchema.safeParse({kind,method,amount:form.get('amount'),account_number:form.get('account'),transaction_id:String(form.get('txid')??'')});
  if(!parsed.success){setError(parsed.error.issues[0]?.message??'Check your details');return;}
  if(kind==='withdrawal'&&parsed.data.amount>Number(profile?.balance??0)){setError('Insufficient wallet balance');return;}
  if(kind==='deposit'&&!file){setError('Upload your payment screenshot');return;}
  if(file){const invalid=validateReceipt(file);if(invalid){setError(invalid);return;}}
  setBusy(true);setError('');
  try{
   let proof_path:string|null=null;
   if(kind==='deposit'&&file){const ext=file.type==='image/jpeg'?'jpg':file.type==='image/png'?'png':'webp';proof_path=`${user.id}/${crypto.randomUUID()}.${ext}`;const upload=await supabase.storage.from('payment-receipts').upload(proof_path,file,{contentType:file.type});if(upload.error)throw upload.error;}
   const {error:requestError}=await supabase.from('payment_requests').insert({...parsed.data,user_id:user.id,transaction_id:kind==='deposit'?(parsed.data.transaction_id??null):null,proof_path});
   if(requestError)throw requestError;
   queryClient.invalidateQueries({queryKey:['transactions']});setDone(true);
  }catch(e){setError(e instanceof Error?e.message:'Unable to submit request');}finally{setBusy(false);}
 }
 return <Dialog open={!!kind} onOpenChange={v=>{if(!v&&!busy)onClose();}}><DialogContent className="portal-dialog"><DialogHeader><DialogTitle className="flex items-center gap-2">{kind==='deposit'?<ArrowDownLeft/>:<ArrowUpRight/>}{kind==='deposit'?'Deposit request':'Withdraw funds'}</DialogTitle><DialogDescription>{kind==='deposit'?'Submit an existing payment for review.':'Request a payout to your mobile wallet.'}</DialogDescription></DialogHeader>
 {done?<div className="py-6 text-center space-y-4"><CheckCircle2 className="mx-auto text-success" size={48}/><h3 className="text-xl font-semibold">Request saved</h3><p className="text-sm text-muted-foreground">Status: Pending. Saved in this portal only; Live Admin Panel delivery is not connected yet.</p><Button onClick={onClose}>Back to wallet</Button></div>:!user?<p className="text-muted-foreground">Please sign in from the header to submit a request.</p>:<form onSubmit={submit} className="space-y-4"><div className="payment-warning"><AlertCircle size={18}/><span>Live Admin Panel not connected. Do not send new funds. Requests remain pending until integration is completed.</span></div><div className="grid grid-cols-2 gap-3">{(['bKash','Nagad'] as const).map(m=><Button key={m} type="button" variant={method===m?'default':'outline'} onClick={()=>setMethod(m)}>{m}</Button>)}</div><div className="space-y-2"><Label htmlFor="amount">Amount (BDT)</Label><Input id="amount" name="amount" type="number" min="0.01" step="0.01" placeholder="৳ 0.00" required/></div><div className="space-y-2"><Label htmlFor="account">{kind==='deposit'?'Sender':'Recipient'} mobile number</Label><Input id="account" name="account" inputMode="tel" placeholder="01XXXXXXXXX" required maxLength={11}/></div>{kind==='deposit'&&<><div className="space-y-2"><Label htmlFor="txid">Transaction ID</Label><Input id="txid" name="txid" placeholder="Enter payment TxID" required maxLength={80}/></div><Label htmlFor="receipt" className="upload-box"><Upload size={24}/><span>{file?file.name:'Upload payment screenshot'}</span><span className="text-xs text-muted-foreground">JPG, PNG or WebP · Up to 5 MB</span><input id="receipt" type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={e=>setFile(e.target.files?.[0]??null)}/></Label></>}{error&&<p role="alert" className="text-destructive text-sm">{error}</p>}<Button type="submit" className="w-full" disabled={busy}>{busy?'Submitting…':'Submit request'}</Button></form>}</DialogContent></Dialog>;
}
