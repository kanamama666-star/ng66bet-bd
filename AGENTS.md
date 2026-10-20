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
- Mirror the inspected AdminPanel field contract in local tables, but do not claim cross-project sync until an authorized shared connection is verified; snapshots cannot update the other app.
- Keep `/admin` as an external redirect to the existing Admin Panel, not an embedded or duplicated dashboard; the destination retains its own authentication and data connection.
