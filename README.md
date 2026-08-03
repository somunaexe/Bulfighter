# Bulfighter

Live site: [bulfighter.com](https://bulfighter.com/)

The official source code for **Bulfighter** — a React single-page application with an interactive 3D globe visualisation, animated UI, and a serverless contact/email pipeline.

## Tech Stack

**Frontend**
- [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) — app shell and build tooling
- [React Router](https://reactrouter.com/) — client-side routing
- [Tailwind CSS](https://tailwindcss.com/) — utility-first styling
- [date-fns](https://date-fns.org/), [file-saver](https://github.com/eligrey/FileSaver.js/), [react-responsive](https://github.com/yocontra/react-responsive)
<!-- - [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + [Drei](https://github.com/pmndrs/drei) + [Three.js](https://threejs.org/) — 3D rendering
- [react-globe.gl](https://github.com/vasturiano/react-globe.gl) — interactive 3D globe visualisation -->
<!-- - [GSAP](https://gsap.com/) (`@gsap/react`) — animation -->
<!-- - [Leva](https://github.com/pmndrs/leva) — real-time 3D scene tuning controls -->
<!-- - [maath](https://github.com/pmndrs/maath) — math helpers for 3D/animation -->


**Backend / Infra**
- [Express 5](https://expressjs.com/) — API server
- [Nodemailer](https://nodemailer.com/) — transactional email, packaged as an AWS Lambda layer (`nodemailer-layer/`)
- [CORS](https://github.com/expressjs/cors), [dotenv](https://github.com/motdotla/dotenv)
- GitHub Actions (`.github/workflows/`) — CI/CD

**Tooling**
- ESLint (flat config) with React/Hooks/Refresh plugins
- PostCSS + Autoprefixer

## Project Structure

```
Bulfighter/
├── .github/workflows/   # CI/CD pipelines
├── nodemailer-layer/     # AWS Lambda layer for the email/contact backend
├── public/               # Static assets
├── src/                  # React application source
├── index.html            # Vite entry point
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── eslint.config.js
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/somunaexe/Bulfighter.git
cd Bulfighter
npm install
```

### Environment Variables

The email/contact feature requires SMTP credentials. Create a `.env` file in the project root:

```bash
# .env
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

### Development

```bash
npm run dev
```

Starts the Vite dev server (proxied to `http://localhost:3000` for API requests).

### Build

```bash
npm run build
```

Outputs a production build via Vite.

### Preview

```bash
npm run preview
```

Serves the production build locally.

### Lint

```bash
npm run lint
```

## Deployment

- The frontend builds to static assets via Vite and can be deployed to any static host.
- The email/contact backend (Nodemailer) is packaged in `nodemailer-layer/` for deployment as an AWS Lambda layer.
- CI/CD is handled via GitHub Actions workflows in `.github/workflows/`.

## License

No license specified yet — all rights reserved by default until a `LICENSE` file is added.
