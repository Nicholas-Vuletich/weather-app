'use client';

import Navbar from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import Container from "@/components/Container";

export interface WeatherResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export default function Home() {
  const { isPending, error, data } = useQuery<WeatherResponse>({
    queryKey: ["weather", "pune"],
    queryFn: async () => {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=pune&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&units=metric`;
      const response = await axios.get<WeatherResponse>(url);
      return response.data;
    },
  });

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error loading weather</div>;

  const date = new Date(data.dt * 1000);

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar />

      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        <section>
          <div>
            <h2 className="flex gap-2 text-2xl items-end">
              <p>{format(date, "EEEE")}</p>
              <p className="text-lg">{format(date, "dd.MM.yyyy")}</p>
            </h2>
            <Container className="gap-10 px-6 items-center">

            <div className="flex flex-col px-4"></div>

            </Container>
          </div>
        </section>

        <section></section>
      </main>
    </div>
  );
}