import LCARSFrame from "@/components/LCARSFrame";
import DiceRoller from "@/components/DiceRoller";
import WatchDiceRoller from "@/components/WatchDiceRoller";
import { useIsWatch } from "@/hooks/use-watch";

const Index = () => {
  const isWatch = useIsWatch();

  if (isWatch) {
    return <WatchDiceRoller />;
  }

  return (
    <LCARSFrame title="STA2E-D20">
      <DiceRoller />
      <section className="max-w-3xl mx-auto px-4 py-10 space-y-4" aria-label="About this dice roller">
        <h2 className="text-xl font-bold">Star Trek Adventures 2d20 Dice Roller</h2>
        <p>
          2d20.space is a free LCARS-style dice roller for the Star Trek
          Adventures Second Edition tabletop RPG. Set your Target Number
          (usually Attribute + Discipline), choose 2 to 5 dice, and roll a
          complete task pool: successes, critical successes, complications,
          Focus doubling, assists, Momentum and Threat bonus dice, and rerolls
          are all handled with rules-accurate math. Every roll is logged in a
          stardate-stamped history, and dice are generated with{" "}
          <code>crypto.getRandomValues</code> for cryptographically secure
          randomness.
        </p>
        <p>
          New to the 2d20 system? The{" "}
          <a href="/guide/probability/" className="underline">
            Probability &amp; Momentum Guide
          </a>{" "}
          breaks down success odds at every target number, how Focus changes
          the math, and how Momentum generation works at each difficulty. The
          roller is a fan-made utility, not affiliated with Modiphius, CBS, or
          Paramount &mdash; and it&rsquo;s free forever, with no accounts and no
          tracking beyond anonymized page views.
        </p>
      </section>
    </LCARSFrame>
  );
};

export default Index;
