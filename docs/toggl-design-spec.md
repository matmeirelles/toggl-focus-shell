# Toggl Focus 2.0 - Timer / Calendar shell design spec

Fonte: inspeção read-only do DOM e de `getComputedStyle` na tela autenticada do Toggl Focus 2.0 em 19/08/2026.

URL inspecionada: `https://focus.toggl.com/21612282/workspaces/21611512/calendar?v=sce%3Dtrue%26sct%3Dfalse%26slt%3Dtrue%26swv%3Dtrue%26m%3Dcalendar%26ly%3Dsplit`

Condições da captura:

- viewport: `1608 x 907 px`, `devicePixelRatio: 1`;
- tema: dark;
- sidebar expandida;
- modo: calendar, 5 days, split Logged / Planned;
- a grade estava rolada para a faixa visível de aproximadamente 12:00 PM a 11:00 PM;
- a aplicação usa `1 px por minuto` na escala observada, logo cada hora mede exatamente `60 px`;
- valores em `rgb()`, `rgba()` e `oklab()` abaixo são os valores literais retornados pelo browser. Hex é apenas a mesma cor convertida quando não há perda de informação.

## 1. Tokens de cor

### Tokens práticos para o shell

```css
:root {
  /* Core surfaces */
  --toggl-app-bg: #1c1a1c;                 /* rgb(28 26 28) */
  --toggl-sidebar-bg: #000000;             /* rgb(0 0 0) */
  --toggl-surface-secondary: #131213;      /* rgb(19 18 19) */
  --toggl-surface-elevated: #1c1a1c;       /* cards, controls and toast */
  --toggl-surface-active: #371f34;         /* active nav / selected split view */
  --toggl-surface-on-hover: rgb(255 255 255 / 12%);

  /* Text */
  --toggl-text-primary: #ffffff;
  --toggl-text-secondary: #b3b0b2;         /* rgb(179 176 178) */
  --toggl-text-disabled: #575456;          /* root token foreground-secondary-disabled */
  --toggl-text-inverted: #131213;
  --toggl-text-hover: #cfcdcf;             /* settled hover on inactive nav */

  /* Accent */
  --toggl-accent: #c282b9;                 /* rgb(194 130 185) */
  --toggl-accent-hover: #dca7d3;           /* rgb(220 167 211) */
  --toggl-accent-active: #eccce6;          /* rgb(236 204 230) */
  --toggl-accent-muted-bg: #371f34;
  --toggl-accent-muted-border: #632e5c;    /* rgb(99 46 92) */

  /* Strokes and grid */
  --toggl-stroke-primary: #3c393b;         /* major borders and hourly lines */
  --toggl-stroke-secondary: #575456;       /* dashed controls and stronger strokes */
  --toggl-stroke-lane-split: #1c1a1c;      /* Logged / Planned divider */

  /* Calendar events */
  --toggl-event-teal: #74b1b6;             /* logged Google event */
  --toggl-event-teal-muted: #122e30;       /* planned Google event */
  --toggl-event-teal-border: #19484b;
  --toggl-event-generic: #1c1a1c;          /* regular Toggl time entry */
  --toggl-event-generic-border: #3c393b;

  /* Shadows */
  --toggl-shadow-sidebar: 0 4px 16px rgb(0 0 0 / 50%);
  --toggl-shadow-raised: 0 2px 6px rgb(0 0 0 / 39%);

  /* Geometry */
  --toggl-sidebar-rail: 48px;
  --toggl-sidebar-nav: 200px;
  --toggl-sidebar-total: 249px;             /* includes 1px right border */
  --toggl-topbar-height: 64px;
  --toggl-hour-row-height: 60px;
  --toggl-time-column-width: 72px;
  --toggl-day-column-width: 257.4px;
  --toggl-lane-width: 128.7px;
  --toggl-radius-sm: 4px;
  --toggl-radius-md: 8px;
}
```

### Aplicação das cores na tela

| Uso | Valor computado real | Hex equivalente |
|---|---:|---:|
| Fundo do app, topbar e base do calendário | `rgb(28, 26, 28)` | `#1C1A1C` |
| Sidebar, incluindo rail e navegação | `rgb(0, 0, 0)` | `#000000` |
| Barra Logged / Planned | `rgb(19, 18, 19)` | `#131213` |
| Faixa Planned da grade | `oklab(0.183807 0.00212552 -0.00144151 / 0.5)` | valor raw; implementada como `#131213` a 50% |
| Superfície elevada | `rgb(28, 26, 28)` | `#1C1A1C` |
| Divisórias principais e linhas horárias | `rgb(60, 57, 59)` | `#3C393B` |
| Divisão interna Logged / Planned | `rgb(28, 26, 28)` | `#1C1A1C` |
| Texto primário | `rgb(255, 255, 255)` | `#FFFFFF` |
| Texto secundário / muted | `rgb(179, 176, 178)` | `#B3B0B2` |
| Texto desabilitado | token `87 84 86` | `#575456` |
| Accent principal | `rgb(194, 130, 185)` | `#C282B9` |
| Fundo de item ativo / badge 2.0 | `rgb(55, 31, 52)` | `#371F34` |
| Borda do badge 2.0 | `rgb(99, 46, 92)` | `#632E5C` |
| Evento Google em Logged | `rgb(116, 177, 182)` | `#74B1B6` |
| Evento Google em Planned | `rgb(18, 46, 48)` | `#122E30` |
| Borda de evento Google | `rgb(25, 72, 75)` | `#19484B` |
| Evento Toggl regular | `rgb(28, 26, 28)` | `#1C1A1C` |
| Borda de evento Toggl regular | `rgb(60, 57, 59)` | `#3C393B` |

Observação: o elemento de um card Planned mantém `color: rgb(255,255,255)` no container, mas o conteúdo interno usa `#74B1B6`. O card Logged usa conteúdo invertido `#131213`.

### CSS custom properties expostas em `:root`

Valores abaixo foram filtrados diretamente de `getComputedStyle(document.documentElement)`. Propriedades vazias são mantidas porque também estavam expostas.

```css
:root {
  --animate-ai-reveal-in: ai-reveal-in .35s ease-out both;
  --animate-onboarding-pulse: onboarding-pulse 1.4s ease-in-out infinite;
  --animate-pulse: pulse 2s cubic-bezier(.4, 0, .6, 1) infinite;
  --animate-settings-section-glow: settings-section-glow 1.4s ease-out;
  --aspect-video: 16 / 9;
  --background-accent: 194 130 185;
  --background-accent-active: 236 204 230;
  --background-accent-hover: 220 167 211;
  --background-affirmative-active: 157 204 159;
  --background-dark: 60 57 59;
  --background-dark-active: 130 127 129;
  --background-dark-hover: 87 84 86;
  --background-data-muted: ;
  --background-data-muted-hover: ;
  --background-destructive-active: 232 144 129;
  --background-error: 73 0 0;
  --background-error-hover: 108 0 0;
  --background-inverted-active: 233 232 232;
  --background-inverted-disabled: 255 255 255;
  --background-inverted-secondary-hover: 207 205 207;
  --background-muted-active: 99 46 92;
  --background-on-surface: #fff0;
  --background-on-surface-disabled: #fff0;
  --background-on-surface-hover: #ffffff1f;
  --background-on-surface-inverted-disabled: #fff0;
  --background-on-surface-inverted-hover: #ffffff1f;
  --background-primary: 28 26 28;
  --background-secondary: 19 18 19;
  --background-secondary-active: 60 57 59;
  --background-secondary-disabled: 19 18 19;
  --background-secondary-hover: 28 26 28;
  --background-stop-timer-active: 250 184 172;
  --background-stop-timer-hover: 232 144 129;
  --background-success: 18 61 23;
  --background-success-disabled: 18 61 23;
  --background-tertiary-disabled: 0 0 0;
  --blur-lg: 16px;
  --blur-xs: 4px;
  --color-accent-100-disabled: 70 44 74;
  --color-accent-ring: #a84c9d;
  --color-accent-ring-dark: #c282b9;
  --color-error-040-active: 163 17 10;
  --color-error-120: 175 62 48;
  --color-gold: #e6c46a;
  --color-grape: 143 89 166;
  --color-grape-120: 224 179 242;
  --color-grape-120-disabled: 70 45 80;
  --color-orange-020-hover: 68 34 33;
  --color-pale-peach: 70 70 70;
  --color-pale-peach-active: 92 92 92;
  --color-pale-peach-disabled: 34 34 34;
  --color-pale-peach-hover: 84 84 84;
  --color-plum-095-disabled: 71 51 81;
  --color-plum-095-hover: 237 226 242;
  --color-purple-020-disabled: 31 25 37;
  --color-purple-020-hover: 66 46 90;
  --color-success-020-hover: 28 85 35;
  --color-success-040-disabled: 25 44 28;
  --color-success-040-hover: 38 127 51;
  --color-success-120-active: 86 168 93;
  --color-success-120-hover: 79 160 86;
  --color-ui-000-hover: 27 27 27;
  --color-ui-005-disabled: 25 25 25;
  --color-ui-010: 41 41 41;
  --color-ui-010-disabled: 29 29 29;
  --color-ui-010-hover: 57 57 57;
  --color-ui-020: 77 77 77;
  --color-ui-020-disabled: 36 36 36;
  --color-ui-040-disabled: 41 41 41;
  --color-ui-050: 178 178 178;
  --color-ui-050-active: 195 195 195;
  --color-ui-050-hover: 187 187 187;
  --color-ui-060: 153 153 153;
  --color-ui-090: 178 178 178;
  --color-ui-090-disabled: 56 56 56;
  --color-ui-090-hover: 187 187 187;
  --color-ui-120-active: 243 243 243;
  --color-ui-120-disabled: 66 66 66;
  --color-warning-020: 88 61 0;
  --color-warning-020-disabled: 88 61 0;
  --color-warning-020-hover: 105 69 0;
  --color-warning-040-hover: 121 80 4;
  --color-warning-120: 194 133 0;
  --container-3xl: 48rem;
  --container-3xs: 16rem;
  --container-md: 28rem;
  --container-xs: 20rem;
  --default-transition-duration: .15s;
  --default-transition-timing-function: cubic-bezier(.4, 0, .2, 1);
  --ease-out: cubic-bezier(0, 0, .2, 1);
  --elevation-raised-10: #00000052;
  --elevation-sunken-10-secondary: #ffffff05;
  --elevation-sunken-20: #0000003d;
  --foreground-accent: 194 130 185;
  --foreground-accent-active: 236 204 230;
  --foreground-accent-hover: 220 167 211;
  --foreground-data: ;
  --foreground-data-active: ;
  --foreground-data-hover: ;
  --foreground-error: 250 184 172;
  --foreground-error-active: 255 241 237;
  --foreground-inverted-disabled: 0 0 0;
  --foreground-inverted-hover: 28 26 28;
  --foreground-light: 255 255 255;
  --foreground-light-active: 233 232 232;
  --foreground-primary-hover: 245 245 245;
  --foreground-secondary: 179 176 178;
  --foreground-secondary-active: 233 232 232;
  --foreground-secondary-disabled: 87 84 86;
  --foreground-success: 157 204 159;
  --foreground-success-active: 216 240 216;
  --foreground-tertiary: 87 84 86;
  --foreground-warning: 243 194 106;
  --highlight-background-color--normal-with-alpha: hsl(50deg 100% 50% / 15%);
  --highlight-resize-handle-background-color: rgb(220, 185, 0);
  --highlight-text-color: #000;
  --illustration-accent-tertiary: 246 229 243;
  --illustration-main-10: 249 243 248;
  --illustration-main-100: 198 108 186;
  --illustration-main-20: 246 229 243;
  --illustration-main-60: 229 171 219;
  --illustration-main-80: 215 136 203;
  --motion-background-color-in-animation: none;
  --motion-bounce: linear(0,.004,.016,.035,.063,.098,.141 13.6%,.25,.391,.563,.765,1,.891 40.9%,.848,.813,.785,.766,.754,.75,.754,.766,.785,.813,.848,.891 68.2%,1 72.7%,.973,.953,.941,.938,.941,.953,.973,1,.988,.984,.988,1);
  --motion-duration: .7s;
  --motion-end-grayscale: 0%;
  --motion-end-scale-x: 100%;
  --motion-end-translate-x: 0%;
  --motion-end-translate-y: 0%;
  --motion-filter-loop-animation: none;
  --motion-filter-out-animation: none;
  --motion-loop-blur: 0px;
  --motion-loop-opacity: 100%;
  --motion-loop-translate-x: 0%;
  --motion-loop-translate-y: 0%;
  --motion-opacity-in-animation: none;
  --motion-opacity-out-animation: none;
  --motion-origin-grayscale: 0%;
  --motion-origin-opacity: 100%;
  --motion-origin-rotate: 0deg;
  --motion-origin-translate-x: 0%;
  --motion-rotate-out-animation: none;
  --motion-scale-loop-animation: none;
  --motion-spring-bouncier: linear(0,.0023,.0088,.0194 1.59%,.035 2.17%,.078 3.33%,.1415 4.64%,.2054 5.75%,.2821 6.95%,.5912 11.45%,.7205 13.43%,.8393 15.45%,.936 17.39%,.9778,1.015,1.0477,1.0759,1.0998 22.22%,1.1203,1.1364,1.1484 25.26%,1.1586 26.61%,1.1629 28.06%,1.1613 29.56%,1.1537 31.2%,1.1434 32.6%,1.1288 34.19%,1.0508 41.29%,1.0174 44.87%,1.0025 46.89%,.9911 48.87%,.9826 50.9%,.9769 53.03%,.9735 56.02%,.9748 59.45%,.9964 72.64%,1.0031 79.69%,1.0042 86.83%,1.0008 99.97%);
  --motion-spring-smooth: linear(0,.001 .44%,.0045 .94%,.0195 2.03%,.0446 3.19%,.0811 4.5%,.1598 6.82%,.3685 12.34%,.4693 15.17%,.5663,.6498 21.27%,.7215 24.39%,.7532 25.98%,.7829 27.65%,.8105,.8349 31.14%,.8573 32.95%,.8776 34.84%,.8964 36.87%,.9136 39.05%,.929 41.37%,.9421 43.77%,.9537 46.38%,.9636 49.14%,.9789 55.31%,.9888 62.35%,.9949 71.06%,.9982 82.52%,.9997 99.94%);
  --motion-text-color-loop-animation: none;
  --motion-translate-loop-animation: none;
  --motion-translate-out-animation: none;
  --scrollbar-corner: transparent;
  --scrollbar-track: transparent;
  --spacing: .25rem;
  --stroke-accent-disabled: 55 31 52;
  --stroke-data-hover: ;
  --stroke-data-secondary-hover: ;
  --stroke-error-active: 175 62 48;
  --stroke-error-hover: 161 40 28;
  --stroke-inverted: 233 232 232;
  --stroke-inverted-disabled: 245 245 245;
  --stroke-inverted-hover: 207 205 207;
  --stroke-muted-disabled: 0 0 0;
  --stroke-muted-hover: 28 26 28;
  --stroke-primary: 60 57 59;
  --stroke-primary-disabled: 28 26 28;
  --stroke-primary-hover: 87 84 86;
  --stroke-secondary: 87 84 86;
  --stroke-secondary-active: 179 176 178;
  --stroke-secondary-hover: 130 127 129;
  --stroke-success: 30 112 42;
  --stroke-success-disabled: 18 61 23;
  --stroke-success-hover: 47 134 58;
  --stroke-tertiary-active: 207 205 207;
  --stroke-tertiary-hover: 179 176 178;
  --stroke-warning: 142 95 0;
  --stroke-warning-disabled: 88 61 0;
  --stroke-warning-hover: 172 116 0;
  --tracking-wider: .05em;
  --tw-border-style: solid;
  --tw-content: "";
  --tw-gradient-from: rgba(0, 0, 0, 0);
  --tw-gradient-to: rgba(0, 0, 0, 0);
  --tw-gradient-to-position: 100%;
  --tw-gradient-via: rgba(0, 0, 0, 0);
  --tw-gradient-via-position: 50%;
  --tw-inset-ring-shadow: 0 0 #0000;
  --tw-inset-shadow: 0 0 #0000;
  --tw-inset-shadow-alpha: 100%;
  --tw-mask-conic: linear-gradient(#fff,#fff);
  --tw-mask-left-from-color: black;
  --tw-mask-left-to-position: 100%;
  --tw-mask-radial: linear-gradient(#fff,#fff);
  --tw-mask-right: linear-gradient(#fff,#fff);
  --tw-mask-right-from-color: black;
  --tw-mask-top: linear-gradient(#fff,#fff);
  --tw-outline-style: solid;
  --tw-scale-y: 1;
  --tw-shadow-alpha: 100%;
  --tw-space-x-reverse: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-translate-z: 0;
}
```

## 2. Tipografia

Família em todos os elementos inspecionados:

```css
font-family: Inter, ui-sans-serif, system-ui, sans-serif,
  "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
```

| Elemento | Size | Weight | Line-height | Cor | Letter-spacing / transformação |
|---|---:|---:|---:|---|---|
| `What are you working on?` | `20px` | `600` | `28.6px` | `#B3B0B2` vazio; input preenchido usa branco | normal |
| Section labels `TRACK`, `ANALYZE`, `PLAN`, `MANAGE` | `11px` | `600` | `16.06px` | `#B3B0B2` | `0.275px`, uppercase |
| Nav item normal | `14px` | `500` | `20.02px` | `#B3B0B2` | normal |
| Nav item ativo `Timer` | `14px` | `600` | `20.02px` | `#C282B9` | normal |
| Número do dia normal, ex. `17` | `22px` | `400` | `22px` | branco | normal |
| Número do dia atual, `19` | `22px` | `600` | `22px` | `#C282B9` | normal |
| Dia normal, ex. `Mon` | `14px` | `500` | `14px` | branco | normal |
| Dia atual, `Wed` | `14px` | `600` | `14px` | branco | normal |
| Subtítulo do dia normal, `3h 5m / -` | `12px` | `500` | `12px` | `#B3B0B2` | normal |
| Subtítulo do dia atual | `12px` | `600` | `12px` | `#B3B0B2` | normal |
| Horário da grade, ex. `1:00 PM` | `11px` | `500` | `16.06px` | `#B3B0B2` | `0.32px`, uppercase |
| Título de card Google | `12px` | `600` | `16.08px` | `#131213` em Logged; `#74B1B6` em Planned | normal |
| Duração do card Google | `12px` | `500` | `16.08px` | herda a cor do card, com wrapper `opacity: .6` | normal |
| Título de card Toggl muito curto | `11px` | `600` | `14px` | branco | normal |
| Totais `7h 6m`, `8h 5m` | `12px` | `500` | `16.08px` | branco | tabular nums |
| `View reports` | `12px` | `500` | `16.08px` | `#B3B0B2` | normal |
| Timer `0:00:00` | `18px` | `500` | `25.74px` | `#B3B0B2` | centralizado |

Nota estrutural: `What are you working on?` não é um `h1`. É um input de texto com um `span` visual sobreposto para o estado vazio. Para o shell, a aparência importa mais que a semântica atual.

## 3. Espaçamento e dimensões

### Estrutura macro

| Elemento | Medida real |
|---|---:|
| Sidebar total | `249px` (`48px` rail + `200px` nav + `1px` border) |
| Rail da sidebar | `48px` |
| Nav da sidebar | `200px` |
| Topbar principal | `64px` |
| Área principal | começa em `x: 249px`, largura `1359px` no viewport observado |
| Linha de navegação de data | `41px` (`y: 64-105`) |
| Linha Logged / Planned | `41.08px` (`y: 105-146.08`) |
| Cabeçalho do calendário | `73px`: `40px` para dia + `33px` para sublabels Logged/Planned |
| Início visual da grade rolável | `y: 219.08px` |
| Coluna de horários | `72px` |
| Coluna por dia | `257.39-257.41px` |
| Metade Logged / Planned | `128.70px` por lane |
| Altura de cada hora | `60px` |
| Altura total 24h | `1440px` |

Grid CSS computado no viewport:

```css
grid-template-columns: 72px 257.391px 257.406px 257.391px 257.406px 257.391px;
grid-template-rows: 1440px;
```

Linhas horárias:

```css
background-image: repeating-linear-gradient(
  to top,
  rgb(60, 57, 59) 0px,
  rgb(60, 57, 59) 1px,
  rgba(0, 0, 0, 0) 1px,
  rgba(0, 0, 0, 0) 60px
);
```

### Componentes e controles

| Elemento | Dimensões / padding / gap / radius |
|---|---|
| Nav item | `184 x 32px`; `padding: 0 8px`; `gap: 12px`; `radius: 8px` |
| Section label | `184 x 24.05px`; `padding: 4px 8px` |
| Workspace switcher | `200 x 64px`; `padding: 10px 8px 10px 16px`; `gap: 8px` |
| Badge `2.0` | `24.66 x 16px`; `padding: 0 3px`; `border: 1px`; `radius: 8px` |
| Chips `@ Task`, `+ Project`, `# Tags` | alturas `32px`; larguras `91.2`, `103.2`, `88.3px`; `padding: 0 14px`; `gap: 8px`; `radius: 8px`; border dashed `1px` |
| Botão `$` | `36 x 36px`; `radius: 8px`; border transparente |
| Timer mode | `30 x 26px`; `padding: 6px 8px`; `gap: 4px`; `radius: 8px` |
| Campo `0:00:00` | `88 x 36px`; sem padding; texto centralizado |
| FAB play | `36 x 36px`; circular; sem padding |
| Grupo de data | `294 x 32px`; anterior `32px`, centro `232px`, próximo `32px` |
| Dropdown `5 Days` | `100 x 32px`; `padding: 0 14px`; `gap: 8px`; `radius: 8px` |
| Botões de view | `32 x 32px` cada; grupo contínuo; ends com radius `8px` |
| Settings / layout buttons | `32 x 32px`; `radius: 8px` |
| `View reports` | `102.9 x 24.08px`; `padding: 4px 8px`; `gap: 2px`; `radius: 8px` |
| Zoom out / in | `16 x 16px`; `radius: 4px`; ícone renderizado em `8 x 8px` |
| Card Google de 60m | wrapper `114-115 x 60px`; visual `110-111 x 56px`; conteúdo `padding: 2px 6px`; radius `8px` |
| Card Google curto | visual inset de `1px` quando há `padding: 1px` no wrapper |
| Card `Get started` | outer `186 x 70px`; inner `184 x 68px`; `padding: 16px`; radius `8px` |

Sombras:

- Sidebar: `0 4px 16px rgb(0 0 0 / 50%)` mais camadas transparentes produzidas pelo utilitário.
- `Get started`: `0 2px 6px rgb(0 0 0 / 39%)` mais camadas transparentes.
- Cards de evento: `box-shadow: none` no estado observado.

## 4. Inventário de componentes

### Árvore hierárquica

```text
App shell
├── Sidebar (249px)
│   ├── Utility rail (48px)
│   │   ├── Toggl 2.0 icon + badge "2.0"
│   │   ├── Toggle sidebar
│   │   ├── Avatar "MM"
│   │   ├── Notifications
│   │   ├── Share feedback
│   │   └── Help
│   └── Navigation (200px)
│       ├── Workspace switcher: "Mat Meirelles1991's organization"
│       ├── TRACK
│       │   └── Timer [active]
│       ├── ANALYZE
│       │   └── Reports
│       ├── PLAN
│       │   ├── Projects
│       │   ├── Tasks
│       │   └── Timeline [paid star]
│       ├── MANAGE
│       │   ├── Members
│       │   ├── Approvals [paid star]
│       │   └── Time off [paid star]
│       ├── Get started card
│       ├── Upgrade + "30 days" badge
│       ├── Download apps
│       └── Admin settings
└── Main surface
    ├── Timer topbar (64px)
    │   ├── "What are you working on?"
    │   ├── @ Task
    │   ├── + Project
    │   ├── # Tags
    │   ├── $ / billable
    │   ├── timer mode
    │   ├── 0:00:00
    │   ├── play FAB
    │   └── more options
    └── Calendar main
        ├── Period / view toolbar (41px)
        │   ├── previous
        │   ├── calendar + "This week • W34"
        │   ├── next
        │   ├── 5 Days dropdown
        │   ├── calendar view
        │   ├── split view [active]
        │   ├── list view
        │   ├── grid view
        │   ├── settings
        │   └── layout/sidebar toggle
        ├── Summary bar (41.08px)
        │   ├── Logged + bar + 7h 6m
        │   ├── Planned + bar + 8h 5m
        │   └── View reports
        ├── Calendar header (73px)
        │   ├── zoom - / +
        │   └── five day headers, each split into Logged / Planned
        └── Calendar grid
            ├── 72px time column
            ├── five 257.4px day columns
            ├── two 128.7px lanes per day
            ├── hourly repeating grid at 60px
            ├── event cards
            └── current time dot + line
```

### Cabeçalhos de dia e subtítulos

| Dia | Header | Logged / Planned |
|---|---|---|
| Mon 17 | `17 Mon` | `3h 5m / -` |
| Tue 18 | `18 Tue` | `1h 56m / -` |
| Wed 19 | `19 Wed` | `2h 5m / 2h 5m` |
| Thu 20 | `20 Thu` | `- / 4h 30m` |
| Fri 21 | `21 Fri` | `- / 1h 30m` |

`Wed 19` é o dia atual no estado capturado. O número `19` fica em um círculo `36 x 36px`, `radius: 32px`, fundo `oklab(0.689547 0.0943845 -0.0506914 / 0.1)` e texto `#C282B9`.

### Cards visíveis na região renderizada da grade

Os horários abaixo vêm dos estilos inline `top` e `height` do evento. Nesta escala, `top: 720px` significa 12:00 e `height: 60px` significa 60 minutos.

| Dia | Lane | Horário | Duração | Label | Google `G` | Aparência |
|---|---|---:|---:|---|---|---|
| Mon 17 | Logged | 12:00-13:00 | 60m | Almoço | sim | teal claro |
| Tue 18 | Logged | 12:00-13:00 | 60m | Almoço | sim | teal claro |
| Tue 18 | Logged | 14:23-14:39 | 16m | Toggl video assessment | não | surface normal |
| Tue 18 | Logged | 14:23-14:49 | 26m | Toggl video assessment | não | surface normal, sobreposto ao anterior |
| Wed 19 | Logged | 12:00-13:00 | 60m | Almoço | sim | teal claro |
| Wed 19 | Planned | 12:00-13:00 | 60m | Almoço | sim | teal claro no estado sincronizado |
| Thu 20 | Planned | 12:00-13:00 | 60m | Almoço | sim | teal escuro |
| Thu 20 | Planned | 14:00-14:45 | 45m | Azos \| Rodrigo <> Mateus - Product Manager B2C Segurado | sim | teal escuro |
| Thu 20 | Planned | 17:00-18:15 | 75m | Terapia | sim | teal escuro |
| Fri 21 | Planned | 12:00-13:00 | 60m | Almoço | sim | teal escuro |

O ícone `G` não é texto nem Lucide. É um SVG monocromático de `12 x 12px` com `fill: currentColor`, `viewBox="0 0 16 16"`, desenhando o `G` do Google. Nos cards de 60m ele fica no topo direito.

### Marcador de hora atual

- capturado em `Wed 19`, aproximadamente `15:18`;
- linha: `269.39 x 2px`, `#C282B9`;
- começa em `x: 823.8px` e termina em `x: 1093.19px`, cobrindo a largura do dia atual;
- bolinha / botão: `18 x 18px`, circular, `#C282B9`;
- a linha fica centralizada verticalmente na bolinha.

## 5. Ícones

Os SVGs do Toggl são próprios, em geral filled e com `viewBox="0 0 16 16"`. A tabela indica o equivalente mais próximo em `lucide-react`, não que o produto use Lucide.

| Local / função | Lucide mais próximo | Observação |
|---|---|---|
| Toggle sidebar | `PanelLeftClose` | SVG custom combina menu + chevron |
| Workspace dropdown | `ChevronDown` | 16px |
| Timer | `Clock3` | original é relógio preenchido em círculo |
| Reports | `ClipboardList` | original parece documento/lista preenchido |
| Projects | `Folder` | filled |
| Tasks | `ListChecks` | filled |
| Timeline | `PanelTop` ou `Rows2` | duas barras horizontais preenchidas |
| Paid feature | `Star` | aparece em Timeline, Approvals e Time off |
| Members | `User` | filled |
| Approvals | `CircleCheckBig` | filled |
| Time off | `PalmTree` | original é palmeira filled |
| Upgrade | `CircleArrowUp` | círculo 20px |
| Download apps | `Download` | seta para baixo + baseline |
| Admin settings | `Settings` | filled |
| Notifications | `Bell` | filled |
| Share feedback | `Send` | avião de papel filled |
| Help | `CircleHelp` | filled |
| Task shortcut | não usa ícone | `kbd` com `@` |
| Project shortcut | `Plus` | visual real é `kbd` com `+` |
| Tags shortcut | `Hash` | visual real é `kbd` com `#` |
| Billable | `DollarSign` | filled custom |
| Timer mode | `ArrowUp` | seta vertical custom |
| Start timer | `Play` | triângulo filled; FAB 36px, plays internos 12-20px |
| More options | `EllipsisVertical` | original usa três círculos filled |
| Previous / next | `ChevronLeft`, `ChevronRight` | 16px |
| Date control | `CalendarDays` | filled custom |
| Days dropdown | `ChevronDown` | 16px |
| Calendar view | `CalendarDays` | primeiro botão do grupo |
| Split view ativo | `PanelRight` ou `Columns2` | SVG próprio com coluna lateral e três células |
| List view | `List` | pontos + linhas |
| Grid view | `Grid2X2` | quatro quadrantes |
| Calendar settings | `Settings` | filled |
| Layout toggle | `PanelRight` | painel + três linhas na coluna direita |
| View reports | `ChevronRight` | 16px |
| Zoom | `Minus`, `Plus` | SVG visual de 8px dentro de botão 16px |
| Duração do evento | `Timer` | SVG custom 10px |
| Google Calendar | sem equivalente Lucide | `G` custom monocromático, 12px |

## 6. Observações de fidelidade

### Estados e detalhes sutis

- O active state do item `Timer` é translúcido visualmente, mas o valor computado do fundo é sólido `#371F34`; o item mede `184 x 32px` e não ocupa toda a largura da sidebar.
- Hover de item de nav inativo, após a transição de `150ms`, ficou em `background: #1C1A1C` e `color: #CFCDCF`.
- As transições de nav usam `150ms cubic-bezier(.4, 0, .2, 1)` para cor, background, border, outline, text-decoration, fill e stroke.
- Os chips da topbar têm border dashed `1px #575456`, não solid.
- Os `kbd` internos `@`, `+` e `#` têm altura mínima `16px`, `padding: 0 4px`, `radius: 4px` e fundo `rgb(255 255 255 / 12%)`.
- O botão ativo do split view usa fundo `#371F34` e ícone `#C282B9`, mantendo borda `#3C393B`.
- A grade não usa elementos separados para cada linha horizontal. Usa um `repeating-linear-gradient` de 1px a cada 60px.
- Cada dia tem borda direita `1px #3C393B`; dentro do dia, a lane Logged tem borda direita `1px #1C1A1C`.
- A lane Planned usa um fundo de `#131213` a 50%, retornado pelo browser como `oklab(...)` com alpha.
- Cards Google usam `radius: 8px`, `border: 1px #19484B` e nenhuma sombra. O wrapper cria 1-2px de respiro nos cards mais altos.
- O Google `G` e o ícone de duração herdam a cor do card. A duração fica em `opacity: .6`.
- Cards muito curtos reduzem o título para `11px / 14px` e ocultam duração. Plays internos aparecem apenas em hover com uma transição de opacidade.
- O card de `Toggl video assessment` usa fundo `#1C1A1C`, borda `#3C393B`; seu hover declarado é `background-secondary-active` e `border-primary-hover`.
- A barra Logged / Planned tem fundo próprio `#131213`, borda inferior `#3C393B`, `padding: 8px 16px` e `gap: 12px`.
- As barras de progresso são `8px` de altura, fully rounded e `#B3B0B2`. Na captura, Logged mede `463.4px` e Planned `537.6px`.
- O `Get started` é um popover fixo no rodapé da navegação, não apenas um bloco no fluxo. Outer: `186 x 70px`, border `#3C393B`, radius `8px`, sombra `0 2px 6px rgb(0 0 0 / 39%)`.
- A sidebar inteira tem sombra `0 4px 16px rgb(0 0 0 / 50%)`.
- O badge `2.0` tem `11px / 16.06px`, weight `600`, fundo `#371F34`, texto `#C282B9`, borda `#632E5C` e radius `8px`.
- O dia atual `19` usa um disco accent a 10% e texto/weight mais fortes.
- O marcador de hora atual usa a mesma cor accent do FAB e atravessa somente o dia atual.

### Elementos transitórios observados

A tela também continha um prompt flutuante no canto inferior direito:

- `Never forget to start the timer`;
- container `360 x 126.17px` em `x: 1232px`, `y: 762.83px`;
- fundo `#1C1A1C`, border `1px #3C393B`, radius `8px`;
- botão `Enable notifications` em accent.

Esse prompt é estado transitório de onboarding/notificação. Para um shell reutilizável, faz mais sentido deixá-lo fora do estado inicial, a menos que a feature do assessment dependa dele.

### Pontos a confirmar apenas se o viewport mudar

- A largura de cada coluna de dia é fluida. `257.39-257.41px` é o valor real no viewport `1608px`; implemente `grid-template-columns: 72px repeat(5, minmax(0, 1fr))` para preservar o comportamento.
- A posição vertical visível dos cards depende do scroll interno. A geometria canônica é `top = minutos desde 00:00` e `height = duração em minutos` na escala atual.
- O nome do workspace é dado da conta. Para o shell, o texto capturado foi `Mat Meirelles1991's organization`.
