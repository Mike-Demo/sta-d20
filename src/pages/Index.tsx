import LCARSFrame from "@/components/LCARSFrame";
import DiceRoller from "@/components/DiceRoller";
import WatchDiceRoller from "@/components/WatchDiceRoller";
import SEOHead from "@/components/SEOHead";
import { useIsWatch } from "@/hooks/use-watch";

const Index = () => {
  const isWatch = useIsWatch();

  if (isWatch) {
    return <WatchDiceRoller />;
  }

  return (
    <>
      <SEOHead />
      <LCARSFrame title="STA2E-D20">
        <DiceRoller />
      </LCARSFrame>
    </>
  );
};

export default Index;
