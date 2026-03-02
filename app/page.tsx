'use client';

import Navbar from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
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

  console.log("data", data);

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error loading weather</div>;

  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar />
      <div className="p-4">
        <h1>{data?.name}</h1>
        <p>{data?.main.temp} °C</p>
        <p>{data?.weather[0].description}</p>
      </div>
    </div>
  );
}