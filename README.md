# Toggl Focus shell

Clone visual do Toggl Focus 2.0 (Calendar / 5 Days / split Logged–Planned). Sem backend. Sem a feature do assessment — só a casca para sexta.

## Links para o assessment

- Prototype (GitHub Pages, público e permanente): **https://matmeirelles.github.io/toggl-focus-shell/**
- Repo: **https://github.com/matmeirelles/toggl-focus-shell**

Não use URLs `temporary-*.vercel.app` — expiram em 60 min sem login na Vercel.

## Local

```bash
npm install
npm run dev
```

## Atualizar o link público

```bash
git add -A && git commit -m "update prototype" && git push
```

O GitHub Actions publica sozinho em ~1 min.

## Playbook de sexta

1. Leia o brief duas vezes. Entregue exatamente o que pedem.
2. Confira no app real (focus.toggl.com) antes de construir em cima de qualquer hipótese.
3. Não aceite o primeiro fluxo genérico de “review today / categorize time”. O diferencial é um insight que eles não veriam em todo candidato.
4. A feature entra em [`src/feature/Slot.tsx`](src/feature/Slot.tsx) e monta nos `FEATURE_SLOT`:
   - TopBar: [`src/components/shell/TopBar.tsx`](src/components/shell/TopBar.tsx)
   - Calendar: [`src/components/calendar/CalendarGrid.tsx`](src/components/calendar/CalendarGrid.tsx)
5. No calendário, o slot está sob `pointer-events-none`. A UI da feature precisa de `pointer-events-auto` na raiz.
6. Botões **dentro da feature** precisam funcionar. O resto do app pode continuar morto.
7. Push para republicar o GitHub Pages.

Tokens e medidas reais: [`docs/toggl-design-spec.md`](docs/toggl-design-spec.md).
