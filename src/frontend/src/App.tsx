import { Button } from "@/components/ui/button";
import { Cloud, Globe, Loader2, Shield, Zap } from "lucide-react";
import { motion } from "motion/react";
import { Suspense, lazy } from "react";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";

const AuthenticatedApp = lazy(() => import("./components/AuthenticatedApp"));

export default function App() {
  const { identity, isInitializing, login, isLoggingIn } =
    useInternetIdentity();
  const { isFetching, actor } = useActor();

  const isAuthenticated = !!identity;

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage login={login} isLoggingIn={isLoggingIn} />;
  }

  if (!actor || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <AuthenticatedApp />
    </Suspense>
  );
}

const FEATURES = [
  {
    icon: Shield,
    title: "Fully Secure",
    description:
      "End-to-end encryption backed by the cryptographic guarantees of the Internet Computer.",
  },
  {
    icon: Globe,
    title: "Decentralised",
    description:
      "No servers, no middlemen. Your data lives entirely on-chain, owned by you.",
  },
  {
    icon: Zap,
    title: "Always Available",
    description:
      "Access your files from anywhere, anytime — with no single point of failure.",
  },
];

function SignInButton({
  login,
  isLoggingIn,
  large,
  ocid,
}: {
  login: () => void;
  isLoggingIn: boolean;
  large?: boolean;
  ocid: string;
}) {
  return (
    <button
      type="button"
      onClick={login}
      disabled={isLoggingIn}
      data-ocid={ocid}
      style={{
        background: isLoggingIn
          ? "oklch(25% 0.06 262)"
          : "linear-gradient(135deg, oklch(55% 0.24 255), oklch(58% 0.26 295))",
        boxShadow: isLoggingIn
          ? "none"
          : "0 0 32px oklch(55% 0.24 265 / 0.35), 0 4px 16px oklch(0% 0 0 / 0.4)",
        transition: "all 0.25s ease",
        cursor: isLoggingIn ? "not-allowed" : "pointer",
        border: "none",
        borderRadius: large ? "14px" : "10px",
        padding: large ? "14px 32px" : "9px 20px",
        fontSize: large ? "1.05rem" : "0.875rem",
        fontWeight: 600,
        color: "oklch(97% 0.005 260)",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        letterSpacing: "-0.01em",
      }}
    >
      {isLoggingIn ? (
        <>
          <Loader2
            style={{ width: large ? 18 : 15, height: large ? 18 : 15 }}
            className="animate-spin"
          />
          Connecting…
        </>
      ) : (
        <>
          <Cloud style={{ width: large ? 18 : 15, height: large ? 18 : 15 }} />
          Sign in with Internet Identity
        </>
      )}
    </button>
  );
}

function LandingPage({
  login,
  isLoggingIn,
}: {
  login: () => void;
  isLoggingIn: boolean;
}) {
  return (
    <div
      className="landing-dark min-h-screen flex flex-col overflow-x-hidden"
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {/* Dot grid overlay */}
      <div
        aria-hidden="true"
        className="landing-dot-grid pointer-events-none fixed inset-0 z-0"
      />

      {/* ── Navbar ────────────────────────────────────────── */}
      <header
        className="relative z-20 w-full"
        style={{
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          background: "oklch(8% 0.025 260 / 0.75)",
          borderBottom: "1px solid oklch(22% 0.04 262 / 0.6)",
        }}
      >
        <nav className="max-w-6xl mx-auto px-6 lg:px-8 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2.5"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background:
                  "linear-gradient(135deg, oklch(55% 0.24 255), oklch(58% 0.26 295))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 14px oklch(55% 0.24 265 / 0.4)",
              }}
            >
              <Cloud style={{ width: 17, height: 17, color: "white" }} />
            </div>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "1.2rem",
                letterSpacing: "-0.02em",
                color: "oklch(96% 0.008 260)",
              }}
            >
              ICcloud
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <SignInButton
              login={login}
              isLoggingIn={isLoggingIn}
              ocid="nav.primary_button"
            />
          </motion.div>
        </nav>
      </header>

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center min-h-[92vh] px-6 py-24">
        {/* Glow orb */}
        <div
          aria-hidden="true"
          className="landing-glow-orb pointer-events-none absolute inset-0"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="mb-6"
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "oklch(72% 0.18 262)",
              background: "oklch(22% 0.06 262 / 0.6)",
              border: "1px solid oklch(40% 0.1 262 / 0.5)",
              padding: "6px 16px",
              borderRadius: 999,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "oklch(65% 0.22 262)",
                boxShadow: "0 0 8px oklch(65% 0.22 262 / 0.8)",
                animation: "pulse 2s ease-in-out infinite",
              }}
            />
            On the Internet Computer
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.2 }}
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(2.6rem, 8vw, 5.5rem)",
            lineHeight: 1.06,
            letterSpacing: "-0.03em",
            color: "oklch(96% 0.008 260)",
            maxWidth: 760,
          }}
        >
          <span className="text-gradient-cloud" style={{ display: "block" }}>
            ICcloud
          </span>
          <span
            style={{
              display: "block",
              fontSize: "0.75em",
              fontWeight: 700,
              color: "oklch(82% 0.01 260)",
            }}
          >
            My Cloud. My Files
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          style={{
            marginTop: "1.5rem",
            fontSize: "1.1rem",
            lineHeight: 1.7,
            color: "oklch(62% 0.04 262)",
            maxWidth: 480,
          }}
        >
          Secure, decentralised cloud storage — built entirely on the Internet
          Computer.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{ marginTop: "2.5rem" }}
        >
          <SignInButton
            login={login}
            isLoggingIn={isLoggingIn}
            large
            ocid="hero.primary_button"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.65 }}
          style={{
            marginTop: "1rem",
            fontSize: "0.78rem",
            color: "oklch(45% 0.04 262)",
          }}
        >
          No account needed — your identity lives on-chain.
        </motion.p>

        {/* Scroll chevron hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1, delay: 1.2 }}
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            style={{
              width: 20,
              height: 20,
              borderRight: "2px solid oklch(50% 0.06 262)",
              borderBottom: "2px solid oklch(50% 0.06 262)",
              transform: "rotate(45deg)",
            }}
          />
        </motion.div>
      </section>

      {/* ── Features ──────────────────────────────────────── */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "oklch(60% 0.14 262)",
                marginBottom: "0.75rem",
              }}
            >
              Why ICcloud
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                letterSpacing: "-0.025em",
                color: "oklch(93% 0.008 260)",
              }}
            >
              Built different. Built{" "}
              <span className="text-gradient-cloud">on-chain.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="landing-feature-card p-7"
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.12 }}
              >
                <div className="landing-icon-wrap">
                  <feature.icon
                    style={{
                      width: 22,
                      height: 22,
                      color: "oklch(70% 0.2 262)",
                    }}
                  />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    letterSpacing: "-0.015em",
                    color: "oklch(93% 0.008 260)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    lineHeight: 1.65,
                    color: "oklch(55% 0.04 262)",
                  }}
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────── */}
      <section className="relative z-10 py-28 px-6">
        {/* Glow under CTA */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 55% at 50% 50%, oklch(38% 0.14 270 / 0.18), transparent 70%)",
          }}
        />
        <motion.div
          className="max-w-2xl mx-auto text-center relative"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(2rem, 5vw, 3.4rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: "oklch(95% 0.008 260)",
              marginBottom: "1.25rem",
            }}
          >
            Ready to get <span className="text-gradient-cloud">started?</span>
          </h2>
          <p
            style={{
              fontSize: "1rem",
              lineHeight: 1.7,
              color: "oklch(58% 0.04 262)",
              marginBottom: "2rem",
              maxWidth: 420,
              margin: "0 auto 2rem",
            }}
          >
            Join the decentralised storage revolution. Your files, secured by
            the Internet Computer.
          </p>
          <SignInButton
            login={login}
            isLoggingIn={isLoggingIn}
            large
            ocid="cta.primary_button"
          />
        </motion.div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer
        className="relative z-10 py-8 text-center"
        style={{
          borderTop: "1px solid oklch(18% 0.03 262)",
        }}
      >
        <p
          style={{
            fontSize: "0.78rem",
            color: "oklch(38% 0.03 262)",
          }}
        >
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "oklch(55% 0.1 262)",
              textDecoration: "underline",
              textUnderlineOffset: 3,
              transition: "color 0.2s",
            }}
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
