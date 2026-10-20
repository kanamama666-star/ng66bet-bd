<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the lobby at `/`, reusable portal views in components, and shared content reads in server functions so public SSR never depends on a player session.
- Use the generated Cloud client and owner-scoped policies for profile and wallet records; only username/phone are player-editable, never balances or VIP status.
- Keep demo game state and credits separate from persisted wallet balances; game sampling uses random-js browserCrypto before each round.
- Run the imported Admin Panel locally under `/admin` and use this project's generated Cloud clients for all records; do not imply synchronization with the separate source project.
- Authorize admin reads and actions server-side through the protected user_roles table; bootstrap access only for an explicitly authorized existing account, never the first signup or editable metadata.
- Review payments atomically with profile-first row locks and a durable ledger; pending unreserved withdrawals commit available funds without changing the displayed balance until approval.
- Store banner images privately with anonymous reads only for active banner records; public CMS reads return browser-reachable signed image URLs.
- Players register with username + mobile + password and log in with either; accounts get an internal non-deliverable email, so email password reset does not apply to them.
