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
    </LCARSFrame>
  );
};

export default Index;
