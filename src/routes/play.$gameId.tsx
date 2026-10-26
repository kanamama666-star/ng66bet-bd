import { createFileRoute, Link, notFound } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useEffect, useState } from 'react';
import { ArrowLeft, Maximize2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthDialog } from '@/components/auth-dialog';
import { usePlayer } from '@/hooks/use-player';
import { launchScorpioGame } from '@/lib/scorpio.functions';
import { SCORPIO_GAMES } from '@/lib/scorpio-games';

export const Route = createFileRoute('/play/$gameId')({
  loader: ({ params }) => { const g = SCORPIO_GAMES[params.gameId]; if (!g) throw notFound(); return { title: g.title, bn: g.bn }; },
  head: ({ loaderData }) => ({ meta: [
    { title: loaderData ? `${loaderData.title} | NG66 Bet` : 'Game | NG66 Bet' },
    { name: 'description', content: `Play ${loaderData?.title ?? 'games'} on NG66 Bet.` },
    { property: 'og:title', content: `${loaderData?.title ?? 'Game'} | NG66 Bet` },
    { property: 'og:description', content: 'Launch your game on NG66 Bet.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
  ] }),
  component: PlayPage,
});

function PlayPage() {
  const { gameId } = Route.useParams();
  const meta = Route.useLoaderData();
  const { user, ready } = usePlayer();
  const launch = useServerFn(launchScorpioGame);
  const [url, setUrl] = useState<string | null>(null), [error, setError] = useState(''), [auth, setAuth] = useState(false);
  useEffect(() => {
    if (!ready || !user) return;
    let live = true;
    setError(''); setUrl(null);
    launch({ data: { slug: gameId } }).then((r) => { if (!live) return; if ('url' in r && r.url) setUrl(r.url); else setError(('error' in r && r.error) || 'গেম চালু করা যায়নি।'); }).catch(() => live && setError('গেম চালু করা যায়নি।'));
    return () => { live = false; };
  }, [ready, user, gameId, launch]);
  return <div className="play-shell">
    <header className="play-bar"><Button asChild variant="ghost" size="sm"><Link to="/"><ArrowLeft />লবি</Link></Button><strong>{meta.bn} · {meta.title}</strong><Button variant="ghost" size="icon" aria-label="Full screen" disabled={!url} onClick={() => void document.getElementById('game-frame')?.requestFullscreen?.()}><Maximize2 /></Button></header>
    {url ? <iframe id="game-frame" title={meta.title} src={url} className="play-frame" allow="autoplay; fullscreen" allowFullScreen referrerPolicy="no-referrer" /> :
      <div className="play-status">{!ready ? <Loader2 className="animate-spin" /> : !user ? <><p>গেম খেলতে লগইন করুন।</p><Button onClick={() => setAuth(true)}>লগইন</Button></> : error ? <><p>{error}</p><Button asChild variant="outline"><Link to="/">লবিতে ফিরুন</Link></Button></> : <><Loader2 className="animate-spin" /><p>গেম লোড হচ্ছে…</p></>}</div>}
    <AuthDialog open={auth} onOpenChange={setAuth} />
  </div>;
}
