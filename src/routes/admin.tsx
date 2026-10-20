import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/admin')({
  head: () => ({
    meta: [
      { title: 'Admin Panel | NG66 Velvet Vault' },
      { name: 'description', content: 'Open the NG66 administration dashboard.' },
      { property: 'og:title', content: 'Admin Panel | NG66 Velvet Vault' },
      { property: 'og:description', content: 'Open the NG66 administration dashboard.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
    ],
  }),
  beforeLoad: () => {
    throw redirect({ href: 'https://seamless-spark-studio.lovable.app', statusCode: 302 });
  },
});