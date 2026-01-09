import Link from "next/link";
import styles from "./page.module.css";
import TerminalDemo, { CopyButton } from "@/components/TerminalDemo";
import {
  Github,
  ShieldCheck,
  Zap,
  Lock,
  Search,
  Fingerprint,
  GitBranch,
  PackageSearch,
  Terminal,
  ArrowRight,
  Heart,
  Globe
} from "lucide-react";

export default function Home() {
  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <div className={styles.logo}>ship18ion</div>
        <div className="flex items-center gap-6">
          <Link
            href="https://github.com/champ18ion"
            target="_blank"
            className={styles.authorBadge}
          >
            <Globe size={14} />
            <span>by champ18ion</span>
          </Link>
          <Link
            href="https://github.com/champ18ion/ship18ion"
            target="_blank"
            className={styles.githubLink}
          >
            <Github size={20} />
          </Link>
        </div>
      </nav>

      <main className={styles.main}>
        {/* --- Hero Section --- */}
        <section className={styles.hero}>
          <div className={styles.badge}>v1.2.0 • The Gold Standard</div>
          <h1 className={styles.title}>
            Ship with <br /> absolute confidence.
          </h1>
          <p className={styles.subtitle}>
            The elite production-readiness inspector for modern web applications.
            Detect secrets, env leaks, and security flaws instantly.
          </p>

          <div className="mb-12">
            <CopyButton text="npx ship18ion check" />
          </div>

          <div className={styles.heroDemo}>
            <TerminalDemo />
          </div>
        </section>

        {/* --- Value Proposition --- */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Built for the Elite.</h2>
          <p className={styles.sectionDesc}>
            `ship18ion` isn't just a scanner. It's your final line of defense
            against the mistakes that kill production.
          </p>

          <div className={styles.features}>
            <div className={styles.featureCard}>
              <ShieldCheck className="mb-4 text-blue-500" size={32} />
              <h3>Security Intelligence</h3>
              <p>Deep scan for hardcoded AWS, Stripe, and Google keys. High-entropy detection flags potential leaks before they're pushed.</p>
            </div>
            <div className={styles.featureCard}>
              <Zap className="mb-4 text-yellow-500" size={32} />
              <h3>Instant Context</h3>
              <p>Zero-config auto-detection for Next.js, Vite, and more. Tailored checks for your specific framework, out of the box.</p>
            </div>
            <div className={styles.featureCard}>
              <Lock className="mb-4 text-green-500" size={32} />
              <h3>Build Hygiene</h3>
              <p>Ensures source maps and root environment files never leak into your deployment artifacts. Keep your builds clean.</p>
            </div>
          </div>
        </section>

        {/* --- Rules Explorer --- */}
        <section className={styles.section}>
          <div className="text-center mb-12">
            <h2 className={styles.sectionTitle}>Deep Inspection</h2>
            <p className={styles.sectionDesc}>Everything you need to ensure your app is ready for the world.</p>
          </div>

          <div className={styles.ruleGrid}>
            <div className={styles.ruleItem}>
              <div className={styles.ruleIcon}><Search size={24} /></div>
              <div className={styles.ruleContent}>
                <h4>Env Variable Audit</h4>
                <p>Detects unused variables in .env and references to variables that don't exist.</p>
              </div>
            </div>
            <div className={styles.ruleItem}>
              <div className={styles.ruleIcon}><Fingerprint size={24} /></div>
              <div className={styles.ruleContent}>
                <h4>Secret Scanning</h4>
                <p>Advanced heuristics find API keys and private keys hidden in your source code.</p>
              </div>
            </div>
            <div className={styles.ruleItem}>
              <div className={styles.ruleIcon}><GitBranch size={24} /></div>
              <div className={styles.ruleContent}>
                <h4>Git Status Check</h4>
                <p>Warns if you're trying to ship from a dirty working directory or the wrong branch.</p>
              </div>
            </div>
            <div className={styles.ruleItem}>
              <div className={styles.ruleIcon}><PackageSearch size={24} /></div>
              <div className={styles.ruleContent}>
                <h4>Dependency Health</h4>
                <p>Flags devDependencies in production lists and prevents package duplication.</p>
              </div>
            </div>
            <div className={styles.ruleItem}>
              <div className={styles.ruleIcon}><Terminal size={24} /></div>
              <div className={styles.ruleContent}>
                <h4>Hygiene Checks</h4>
                <p>Locates forgotten console.log() calls and unresolved FIXME/TODO comments.</p>
              </div>
            </div>
            <div className={styles.ruleItem}>
              <div className={styles.ruleIcon}><Lock size={24} /></div>
              <div className={styles.ruleContent}>
                <h4>CORS & Config</h4>
                <p>Identifies dangerous wildcard CORS origins and hardcoded database strings.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- CI/CD Section --- */}
        <section className={styles.section}>
          <div className="text-center mb-12">
            <h2 className={styles.sectionTitle}>Built for Pipelines.</h2>
            <p className={styles.sectionDesc}>Integrate `ship18ion` into your CI/CD flow to block insecure builds automatically.</p>
          </div>

          <div className={styles.featureCard} style={{ maxWidth: '800px', width: '100%', padding: '48px' }}>
            <div className="flex items-center gap-6 mb-4">
              <Terminal className="text-blue-500" size={32} />
              <h3 style={{ margin: 0 }}>CI Mode</h3>
            </div>
            <p className="mb-4" style={{ fontSize: '16px' }}>
              Use the `--ci` flag for clean, machine-readable output and standard exit codes.
              Perfect for GitHub Actions, GitLab CI, or Jenkins.
            </p>
            <div style={{ background: '#000', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: '14px', color: '#ccc' }}>
              $ ship18ion check --ci
            </div>
          </div>
        </section>

        {/* --- Frameworks Section --- */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Works with the best.</h2>
          <p className={styles.sectionDesc}>Universal support for the most popular modern frameworks.</p>

          <div className="flex gap-6 items-center justify-center flex-wrap" style={{ opacity: 0.6 }}>
            <span style={{ fontSize: '18px', fontWeight: 700 }}>Next.js</span>
            <span style={{ fontSize: '18px', fontWeight: 700 }}>Vite</span>
            <span style={{ fontSize: '18px', fontWeight: 700 }}>NestJS</span>
            <span style={{ fontSize: '18px', fontWeight: 700 }}>Express</span>
            <span style={{ fontSize: '18px', fontWeight: 700 }}>Fastify</span>
            <span style={{ fontSize: '18px', fontWeight: 700 }}>Remix</span>
          </div>
        </section>

        {/* --- Final CTA --- */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Ready to ship better?</h2>
          <p className={styles.sectionDesc}>Join the developers who refuse to ship broken apps.</p>

          <div className="flex gap-4">
            <Link
              href="https://www.npmjs.com/package/ship18ion"
              target="_blank"
              className={styles.cta}
            >
              Get Started <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerCredits}>
          <div>© 2026 ship18ion. All rights reserved.</div>
          <div className="flex items-center gap-2 mt-2">
            <span>Crafted with</span>
            <Heart size={14} className="text-red-500" fill="currentColor" />
            <span>by</span>
            <Link href="https://github.com/champ18ion" target="_blank" className={styles.footerName}>
              champ18ion
            </Link>
          </div>
        </div>
        <div className="flex gap-6">
          <Link href="https://github.com/champ18ion/ship18ion" target="_blank">GitHub</Link>
          <Link href="https://www.npmjs.com/package/ship18ion" target="_blank">NPM</Link>
          <Link href="https://github.com/champ18ion" target="_blank">Portfolio</Link>
        </div>
      </footer>
    </div>
  );
}
