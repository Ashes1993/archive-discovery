import { GlassCard } from "@/components/ui/GlassCard";

export const metadata = {
  title: "Privacy Policy | Archive Discovery",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-6 min-h-screen pt-32 pb-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-silver mb-8 text-center">
          Privacy Protocol
        </h1>

        <GlassCard className="p-8 md:p-12 space-y-8 bg-surface border-border-subtle">
          <div className="text-xs font-mono text-gold uppercase tracking-wider mb-8">
            Last Updated: February 2026
          </div>

          <Section title="1. Data Minimization">
            <p>
              We believe in the right to explore history anonymously. We do not
              require account registration to watch movies. We do not track your
              viewing history linked to a personal identity.
            </p>
          </Section>

          <Section title="2. Information We Collect">
            <p>
              <strong>Usage Data:</strong> We may collect anonymous metrics
              (e.g., page views, search terms) to improve the discovery
              algorithms. This data is aggregated and cannot be used to identify
              you personally.
            </p>
            <p>
              <strong>Local Storage:</strong> We use your browser's local
              storage to save preferences like volume settings or "continue
              watching" markers. This data stays on your device and is never
              sent to our servers.
            </p>
          </Section>

          <Section title="3. Third-Party Sources">
            <p>
              This platform serves content directly from{" "}
              <strong>Archive.org</strong>. When you stream a video, you are
              establishing a direct connection with the Internet Archive
              servers. Their privacy policy applies to the data transfer of the
              video stream itself.
            </p>
          </Section>

          <Section title="4. Cookies">
            <p>
              We use zero tracking cookies. We strictly use functional cookies
              required for the site to operate (e.g. remembering your grid view
              preference).
            </p>
          </Section>

          <div className="pt-8 border-t border-border-subtle">
            <p className="text-sm text-pewter font-sans">
              Questions? Contact the archivist at{" "}
              <a
                href="mailto:hello@example.com"
                className="text-gold hover:underline"
              >
                hello@example.com
              </a>
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold text-silver font-sans tracking-wide">
        {title}
      </h2>
      <div className="text-pewter text-sm leading-relaxed space-y-3 font-sans">
        {children}
      </div>
    </section>
  );
}
