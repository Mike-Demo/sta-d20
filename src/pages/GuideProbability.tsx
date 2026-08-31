import { Link } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import LCARSFrame from "@/components/LCARSFrame";

// Probability that a single d20 (1..20) succeeds against a target number.
// Success on roll <= TN. Natural 1 is always a critical (2 successes).
function successProb(tn: number): number {
  return Math.min(20, Math.max(0, tn)) / 20;
}

// Expected successes per die given TN and Focus discipline (focus = roll <= disc => 2 successes).
// Natural 1 is always 2 successes regardless of focus.
function expectedSuccessesPerDie(tn: number, disc: number | null): number {
  // Each face 1..20
  let total = 0;
  for (let f = 1; f <= 20; f++) {
    let s = 0;
    if (f <= tn) s = 1;
    if (f === 1) s = 2;
    if (disc !== null && f <= disc) s = 2;
    total += s;
  }
  return total / 20;
}

// Probability of meeting a difficulty (D successes) rolling N d20s vs TN, optional focus discipline.
function probMeetDifficulty(n: number, tn: number, difficulty: number, disc: number | null): number {
  // Per-die outcome probabilities (0, 1, or 2 successes).
  let p0 = 0, p1 = 0, p2 = 0;
  for (let f = 1; f <= 20; f++) {
    let s = 0;
    if (f <= tn) s = 1;
    if (f === 1) s = 2;
    if (disc !== null && f <= disc) s = 2;
    if (s === 0) p0 += 1 / 20;
    else if (s === 1) p1 += 1 / 20;
    else p2 += 1 / 20;
  }
  // Distribution of total successes across N dice (convolution).
  let dist: number[] = [1];
  for (let i = 0; i < n; i++) {
    const next = new Array(dist.length + 2).fill(0);
    for (let k = 0; k < dist.length; k++) {
      next[k] += dist[k] * p0;
      next[k + 1] += dist[k] * p1;
      next[k + 2] += dist[k] * p2;
    }
    dist = next;
  }
  let p = 0;
  for (let k = difficulty; k < dist.length; k++) p += dist[k];
  return p;
}

const pct = (p: number) => `${(p * 100).toFixed(1)}%`;

const GuideProbability = () => {
  const pool = 2;
  const difficulties = [1, 2, 3, 4, 5];
  const tns = [8, 10, 12, 14, 16];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "2d20 Probability and Momentum Generation Guide — Star Trek Adventures 2e",
    description:
      "How the Star Trek Adventures 2d20 system works mathematically: probabilities of success at every target number, the impact of Focus, and how often you generate Momentum at each difficulty.",
    image: "https://2d20.space/social-card.png",
    author: { "@type": "Person", name: "MikeDemo" },
    publisher: { "@type": "Person", name: "Mike Demo", url: "https://2d20.space" },
    datePublished: "2026-06-05",
    dateModified: "2026-08-31",
    mainEntityOfPage: "https://2d20.space/guide/probability",
  };

  return (
    <>
      <SEOHead
        title="2d20 Probability & Momentum Guide — Star Trek Adventures Dice Math"
        description="A clear, math-backed guide to Star Trek Adventures 2e: success odds for star trek dice rolls at every target number, Focus impact, and 2d20 system probability for Momentum."
        canonical="https://2d20.space/guide/probability"
        ogType="article"
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <LCARSFrame title="2D20 PROBABILITY GUIDE">
        <article className="max-w-3xl mx-auto px-4 py-6 space-y-6 text-foreground font-lcars">
          <header className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-display font-bold tracking-wider uppercase text-primary">
              2d20 Probability &amp; Momentum Generation
            </h1>
            <p className="text-sm text-muted-foreground">
              How the Star Trek Adventures 2nd Edition dice math actually works — success odds, Focus,
              Momentum generation, and what it all means for your Star Trek dice rolls.
            </p>
            <p className="text-xs">
              <Link to="/" className="text-lcars-arctic-ice underline">← Back to the dice roller</Link>
            </p>
          </header>

          <section className="space-y-3">
            <h2 className="text-lg font-display font-bold uppercase tracking-wider text-lcars-arctic-ice">
              The core mechanic
            </h2>
            <p>
              In STA 2e you roll a pool of d20s — usually 2, sometimes up to 5 with bought dice.
              Each die that rolls <strong>at or below</strong> your Target Number (Attribute + Discipline)
              scores <strong>1 success</strong>. A natural <strong>1</strong> always scores
              <strong> 2 successes</strong> (a critical). If your task has a <em>Focus</em>, dice that
              roll <strong>at or below your Discipline</strong> also score 2 successes.
            </p>
            <p>
              The number of successes you need is the task's <strong>Difficulty</strong> (0–5).
              Any successes <em>over</em> the Difficulty become <strong>Momentum</strong>, which the
              group banks for later rerolls, bonus dice, and narrative effects.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-display font-bold uppercase tracking-wider text-lcars-arctic-ice">
              Single-die success odds
            </h2>
            <p>The chance one d20 scores at least one success at each Target Number:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left px-3 py-2">Target Number</th>
                    <th className="text-left px-3 py-2">P(success)</th>
                    <th className="text-left px-3 py-2">Expected successes (no Focus)</th>
                    <th className="text-left px-3 py-2">Expected successes (Focus 4)</th>
                  </tr>
                </thead>
                <tbody>
                  {tns.map((tn) => (
                    <tr key={tn} className="border-t border-border">
                      <td className="px-3 py-2">{tn}</td>
                      <td className="px-3 py-2">{pct(successProb(tn))}</td>
                      <td className="px-3 py-2">{expectedSuccessesPerDie(tn, null).toFixed(2)}</td>
                      <td className="px-3 py-2">{expectedSuccessesPerDie(tn, 4).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground">
              Note: a natural 1 always crits, so the "expected successes" column is slightly higher than
              raw P(success) would suggest.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-display font-bold uppercase tracking-wider text-lcars-arctic-ice">
              Passing the task: 2d20 vs Difficulty
            </h2>
            <p>
              The standard pool is 2d20. Here's the probability of meeting each Difficulty without
              Focus, at common Target Numbers:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left px-3 py-2">TN \ Difficulty</th>
                    {difficulties.map((d) => (
                      <th key={d} className="text-left px-3 py-2">D{d}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tns.map((tn) => (
                    <tr key={tn} className="border-t border-border">
                      <td className="px-3 py-2 font-bold">{tn}</td>
                      {difficulties.map((d) => (
                        <td key={d} className="px-3 py-2">{pct(probMeetDifficulty(pool, tn, d, null))}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground">
              Most tasks are Difficulty 1 or 2. At a TN of 12 (e.g. Attribute 9 + Discipline 3), a
              standard 2d20 pool passes a D2 task about {pct(probMeetDifficulty(2, 12, 2, null))} of
              the time.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-display font-bold uppercase tracking-wider text-lcars-arctic-ice">
              Momentum generation
            </h2>
            <p>
              Momentum is the surplus — successes beyond the Difficulty. The easier the task and the
              higher your TN, the more Momentum you reliably bank. Expected total successes on 2d20:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left px-3 py-2">TN</th>
                    <th className="text-left px-3 py-2">E[successes], no Focus</th>
                    <th className="text-left px-3 py-2">E[successes], Focus 4</th>
                    <th className="text-left px-3 py-2">Avg Momentum vs D1 (no Focus)</th>
                  </tr>
                </thead>
                <tbody>
                  {tns.map((tn) => {
                    const e = expectedSuccessesPerDie(tn, null) * pool;
                    const ef = expectedSuccessesPerDie(tn, 4) * pool;
                    const mom = Math.max(0, e - 1);
                    return (
                      <tr key={tn} className="border-t border-border">
                        <td className="px-3 py-2 font-bold">{tn}</td>
                        <td className="px-3 py-2">{e.toFixed(2)}</td>
                        <td className="px-3 py-2">{ef.toFixed(2)}</td>
                        <td className="px-3 py-2">{mom.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground">
              Per the rules, you can only bank up to 6 Momentum at any one time, so consistent surplus
              on routine tasks is more valuable than spiking on one heroic roll.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-display font-bold uppercase tracking-wider text-lcars-arctic-ice">
              Buying extra dice
            </h2>
            <p>
              You can buy up to 3 extra d20s by spending Momentum or adding to the Threat pool
              (1, 2, then 3 Momentum/Threat for the 3rd, 4th, and 5th die). Each extra die adds the
              same expected successes shown above — so at TN 12, each bought die adds about
              {" "}{expectedSuccessesPerDie(12, null).toFixed(2)} successes on average. That's a fair
              trade for tough rolls (D3+) and almost always wasted on D1 tasks you'd pass anyway.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-display font-bold uppercase tracking-wider text-lcars-arctic-ice">
              Complications
            </h2>
            <p>
              Any die rolling within your Complication Range (by default just 20, widened by trait or
              environment) triggers a Complication on top of whatever successes you scored. With the
              base range of 20, every d20 has a flat <strong>5%</strong> chance to complicate — so
              2d20 has roughly a <strong>{pct(1 - 0.95 ** 2)}</strong> chance of at least one
              Complication, and 5d20 jumps to about <strong>{pct(1 - 0.95 ** 5)}</strong>. Larger
              pools succeed more, but they also complicate more.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-display font-bold uppercase tracking-wider text-lcars-arctic-ice">
              Try it
            </h2>
            <p>
              Plug your own Attribute, Discipline, Difficulty and Focus into the{" "}
              <Link to="/" className="text-lcars-arctic-ice underline">2d20.space dice roller</Link>{" "}
              and watch the math play out across many rolls.
            </p>
          </section>
        </article>
      </LCARSFrame>
    </>
  );
};

export default GuideProbability;
