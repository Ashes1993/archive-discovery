import { GlassCard } from "@/components/ui/GlassCard";

export const metadata = {
  title: "Terms of Use | Archive Discovery",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-6 min-h-screen pt-32 pb-20">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-silver mb-8 text-center">
          Terms of Use
        </h1>

        <GlassCard className="p-8 md:p-12 space-y-8 bg-surface border-border-subtle">
          <div className="text-xs font-mono text-gold uppercase tracking-wider mb-8 border-b border-border-subtle pb-4">
            Effective Date: February 2026
          </div>

          <Section title="1. Public Domain Nature">
            <p>
              The video content hosted on this platform is believed to be in the{" "}
              <strong>Public Domain</strong> under U.S. Copyright Law. This
              means the copyright has expired, was never renewed, or the work
              was dedicated to the public domain.
            </p>
            <p>
              However, copyright laws vary by country. You are responsible for
              ensuring your use of this content complies with the laws of your
              jurisdiction.
            </p>
          </Section>

          <Section title="2. Third-Party APIs and Metadata">
            <p>
              To provide accurate metadata and cinematic poster artwork, Archive
              Discovery utilizes The Movie Database (TMDB) API.
            </p>
            <p className="border-l-2 border-gold pl-4 italic bg-gold/5 py-2 pr-2">
              This product uses the TMDB API but is not endorsed or certified by
              TMDB.
            </p>
            <p>
              By using our platform, you agree to respect the intellectual
              property of TMDB&apos;s contributors. You may not scrape or
              mass-download metadata provided by TMDB through our service.
            </p>
          </Section>

          <Section title="3. License & Usage">
            <p>
              <strong>The Content:</strong> You are free to download, remix, and
              share the movies found here, as they belong to the public.
            </p>
            <p>
              <strong>The Interface:</strong> The design, code, and curation of
              &quot;Archive Discovery&quot; are copyrighted by the creators. You
              may not scrape our curation data without permission.
            </p>
          </Section>

          <Section title="4. Disclaimer of Warranties">
            <p>
              The service is provided &quot;as is.&quot; We do not guarantee the
              preservation of these links in perpetuity, as we rely on the
              Internet Archive&apos;s API availability. We are not liable for
              any historical inaccuracies found within the films.
            </p>
          </Section>

          <Section title="5. User Conduct">
            <p>
              While we celebrate free speech and historical preservation, we
              reserve the right to block access to users attempting to abuse the
              API, spam the search endpoints, or attack the infrastructure.
            </p>
          </Section>
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
