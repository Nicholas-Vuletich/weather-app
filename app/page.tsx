'use client';

import Navbar from "@/components/Navbar";
import Container from "@/components/Container";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { format, parseISO } from "date-fns";
import WeatherIcon from "@/components/WeatherIcon";
import { getDayOrNightIcon } from "@/utilis/getDayOrNightIcon";


// ⭐ TIP ZA FORECAST API
export interface ForecastResponse {
  list: {
    dt: number;
    main: {
      temp: number;
      temp_min: number;
      temp_max: number;
    };
    weather: {
      description: string;
      icon: string;
    }[];
    dt_txt: string;
  }[];
}


export default function Home() {

  const { isPending, error, data } = useQuery<ForecastResponse>({
    queryKey: ["weather", "osijek"],

    queryFn: async () => {
      const url =
        `https://api.openweathermap.org/data/2.5/forecast?q=Osijek,hr&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&units=metric`;

      const response = await axios.get<ForecastResponse>(url);
      return response.data;
    },
  });


  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error loading weather</div>;
  if (!data) return null;


  // ⭐ Uzmemo prvi element (najbliži trenutnom vremenu)
  const firstData = data.list[0];

  const date = new Date(firstData.dt * 1000);


  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar />

      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">

        <section>
          <div>

            {/* DATUM */}
            <h2 className="flex gap-2 text-2xl items-end">
              <p>{format(date, "EEEE")}</p>
              <p className="text-lg">{format(date, "dd.MM.yyyy")}</p>
            </h2>


            <Container className="gap-10 px-6 items-center">

              {/* TEMPERATURA */}
              <div className="flex flex-col px-4">

                <span className="text-5xl">
                  {Math.round(firstData.main.temp)}°
                </span>

                <p className="text-xs space-x-2">
                  <span>{Math.round(firstData.main.temp_min)}°↓</span>
                  <span>{Math.round(firstData.main.temp_max)}°↑</span>
                </p>

              </div>


              {/* SATNA PROGNOZA */}
              <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">

                {data.list.slice(0, 8).map((d, i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                  >
                    <p>{format(parseISO(d.dt_txt), "HH:mm")}</p>

                    <p className="whitespace-nowrap">{Math.round(d.main.temp)}°</p>

                    <WeatherIcon iconName={getDayOrNightIcon(d.weather[0].icon, d.dt_txt)} />
                    <p>{Math.round(d.main.temp)}°</p>
                  </div>
                ))}

              </div>

            </Container>

          </div>
        </section>

      </main>
    </div>
  );
}