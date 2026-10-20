# Portal rebuild
- [ ] Add `/admin` as a direct redirect to the existing Admin Panel and verify its destination.
- [x] Rebuild mobile-first lobby, categories, banners, and account/wallet views.
- [x] Set up Cloud profiles, authentication, transaction requests and private screenshots.
- [x] Implement transparent play-only games with isolated demo credits.
- [ ] Connect sign-up, wallet balances, deposit/withdrawal requests and notice marquee directly to the existing Live Admin Panel database; verify new accounts and requests appear there instantly — blocked: rechecked the published Admin Panel project's snapshot; its role-protected Cloud reads/writes exist, but no authorized shared connection/API is available here. Changes to that project must be made from its own chat; importing the portal there can keep both experiences on its existing Cloud connection.
- [x] Verify demo flows, eight tests, and phone/desktop layouts.
- [ ] Verify signed-in deposit submission, screenshot readback and withdrawal flow — blocked on a confirmed player account; no auth users exist yet.