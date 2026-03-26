import React from "react";
import Image from "next/image";
import { cn } from "@/utilis/cn";

export default function WeatherIcon(
  props: React.HTMLProps<HTMLDivElement> & { iconName: string }
) {
  const { iconName, className, ...rest } = props;

  return (
    <div {...rest} className={cn("relative h-20 w-20", className)}>
      <Image
        width={100}
        height={100}
        alt="weather-icon"
        className="absolute h-full w-full"
        src={`https://openweathermap.org/img/wn/${iconName}@2x.png`}
      />
    </div>
  );
}