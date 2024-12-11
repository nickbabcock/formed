import { VictoryPie, VictoryTheme } from "victory";
import { formatInt } from "~/lib/format";

export function Pie({ data }: { data: { x: string; y: number }[] }) {
  return (
    <VictoryPie
      data={data}
      innerRadius={50}
      padAngle={5}
      theme={VictoryTheme.material}
      labels={({ datum }) => `${datum.x}: ${formatInt(datum.y)}`}
    />
  );
}
