"use client";

import {
  NorthIndianChart,
  type ChartBody,
} from "./NorthIndianChart";
import { SouthIndianChart } from "./SouthIndianChart";

export type ChartStyle = "north" | "south";

type Props = {
  style: ChartStyle;
  title: string;
  subtitle?: string;
  lagnaSignIndex: number;
  bodies: ChartBody[];
  locale: "en" | "hi";
  showAsc?: boolean;
  className?: string;
};

/** Same calculation data — North (house-fixed diamond) or South (sign-fixed grid). */
export function VedicChartView(props: Props) {
  if (props.style === "south") {
    return (
      <SouthIndianChart
        title={props.title}
        subtitle={props.subtitle}
        lagnaSignIndex={props.lagnaSignIndex}
        bodies={props.bodies}
        locale={props.locale}
        showAsc={props.showAsc}
        className={props.className}
      />
    );
  }
  return (
    <NorthIndianChart
      title={props.title}
      subtitle={props.subtitle}
      lagnaSignIndex={props.lagnaSignIndex}
      bodies={props.bodies}
      locale={props.locale}
      showAsc={props.showAsc}
      className={props.className}
    />
  );
}
