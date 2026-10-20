import { useEffect,useRef,useState } from 'react';
import { Plane,RotateCw,Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription } from '@/components/ui/dialog';
import { DEMO_START_CREDITS,DEMO_STAKE,slotPayout,crashPoint,demoRandom } from '@/lib/demo-games';
import type { Game } from '@/lib/portal-data';
export function GameDialog({game,onClose}:{game:Game|null;onClose:()=>void}){
 const [credits,setCredits]=useState(DEMO_START_CREDITS),[reels,setReels]=useState([0,1,2]),[message,setMessage]=useState('Ready to play'),[flying,setFlying]=useState(false),[multiplier,setMultiplier]=useState(1);
 const flight=useRef({start:0,crash:1});
 const currentMultiplier=useRef(1);
 useEffect(()=>{
  if(!flying)return;
  const timer=setInterval(()=>{const next=Math.floor(Math.exp((Date.now()-flight.current.start)/6000)*100)/100;if(next>=flight.current.crash){setMultiplier(flight.current.crash);setFlying(false);setMessage(`Flew away at ${flight.current.crash.toFixed(2)}×`);}else{currentMultiplier.current=next;setMultiplier(next);}},50);
  return()=>clearInterval(timer);
 },[flying]);
 function play(){
  if(credits<DEMO_STAKE){setMessage('Not enough demo credits');return;}
  const random=demoRandom();setCredits(c=>c-DEMO_STAKE);
  if(game?.id==='aviator'){flight.current={start:Date.now(),crash:crashPoint(random.real(0,1,false))};currentMultiplier.current=1;setMultiplier(1);setFlying(true);setMessage('In flight…');}
  else {const next=[random.integer(0,5),random.integer(0,5),random.integer(0,5)];setReels(next);const win=slotPayout(next);setCredits(c=>c+win);setMessage(win?`You won ${win} demo credits!`:'No match. Try another spin.');}
 }
 function cashOut(){if(!flying)return;const actual=Math.floor(Math.exp((Date.now()-flight.current.start)/6000)*100)/100;if(actual>=flight.current.crash){setFlying(false);setMultiplier(flight.current.crash);setMessage('Flew away before cash out');return;}const win=Math.floor(DEMO_STAKE*actual);setCredits(c=>c+win);setFlying(false);setMessage(`Cashed out ${win} demo credits`);}
 const symbols=['♠','♥','♦','♣','★','7'];
 return <Dialog open={!!game} onOpenChange={v=>{if(!v){setFlying(false);onClose();}}}><DialogContent className="portal-dialog"><DialogHeader><DialogTitle>{game?.title}</DialogTitle><DialogDescription>Demo play · No cash value · No real-money wagering</DialogDescription></DialogHeader>{!game?.playable?<div className="space-y-4 py-4"><img src={game?.image} alt={game?.title} className="w-full h-48 object-cover rounded-lg"/><p className="text-muted-foreground">This game is unavailable until an authorized game provider is connected.</p><Button className="w-full" onClick={onClose}>Back to games</Button></div>:<><div className="flex justify-between text-sm"><span className="flex items-center gap-2 text-primary"><Coins/> {credits.toLocaleString()} demo credits</span><span className="text-muted-foreground">Stake: {DEMO_STAKE}</span></div>{game.id==='aviator'?<div className={`flight-stage ${flying?'in-flight':''}`}><Plane size={56}/><strong>{multiplier.toFixed(2)}×</strong><span>{flying?'IN FLIGHT':'AVIATOR DEMO'}</span></div>:<div className="slot-reels">{reels.map((r,i)=><div key={i}>{symbols[r]}</div>)}</div>}<p role="status" className="text-center text-primary">{message}</p><Button size="lg" onClick={flying?cashOut:play}>{flying?'Cash out demo credits':game.id==='aviator'?<><Plane/>Start flight</>:<><RotateCw/>Spin · 10 credits</>}</Button><p className="text-xs leading-relaxed text-muted-foreground">{game.id==='aviator'?'Crash point is sampled before takeoff and never changed mid-flight. P(crash ≥ x) = 1/x for 1–20×; capped at 20×.':'Six equally likely symbols per reel. Three matching symbols pay 200 credits; all other results pay zero. Match chance: 1/36.'} Demo credits are separate from your wallet.</p></>}</DialogContent></Dialog>;
}
