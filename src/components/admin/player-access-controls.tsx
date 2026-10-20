import {useState} from 'react';
import {useQueryClient} from '@tanstack/react-query';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Switch} from '@/components/ui/switch';
import {managePlayerAccess} from '@/lib/admin.functions';
import {toast} from 'sonner';
export function PlayerAccessControls({id,level,frozen}:{id:string;level:number;frozen:boolean}){
 const [vipLevel,setLevel]=useState(level),[freeze,setFreeze]=useState(frozen),[reason,setReason]=useState(''),[busy,setBusy]=useState(false);const qc=useQueryClient();
 return <form className="space-y-4 border-t pt-5" onSubmit={async e=>{e.preventDefault();setBusy(true);try{await managePlayerAccess({data:{id,vipLevel,frozen:freeze,reason}});await qc.invalidateQueries({queryKey:['admin-data']});setReason('');toast.success('VIP level and freeze settings updated.');}catch(e){toast.error(e instanceof Error?e.message:'Unable to save settings.');}finally{setBusy(false);}}}><h3 className="font-semibold">VIP & frozen-account review</h3><label className="block">VIP level<Input type="number" min={0} max={41} step={1} required value={vipLevel} onChange={e=>setLevel(Number(e.target.value))}/></label><label className="flex items-center justify-between">Frozen account<Switch aria-label="Frozen account" checked={freeze} onCheckedChange={setFreeze}/></label><label className="block">Review reason<Input required minLength={3} maxLength={500} value={reason} onChange={e=>setReason(e.target.value)}/></label><Button disabled={busy||reason.trim().length<3} type="submit">Save access settings</Button></form>;
}