'use client';

import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import ForecastWeatherDetail from "@/components/ForecastWeatherDetail";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { format, parseISO, fromUnixTime } from "date-fns";
import WeatherIcon from "@/components/WeatherIcon";
import { getDayOrNightIcon } from "@/utilis/getDayOrNightIcon";
import WeatherDetails from "@/components/WeatherDetails";
import { metersToKilometers } from "@/utilis/metersToKilometers";
import { convertWindSpeed } from "@/utilis/convertWindSpeed";

export interface ForecastResponse {
  city: {
    sunrise: number;
    sunset: number;
    name: string;
    country: string;
    timezone: number;
  };
  list: {
    dt: number;
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
    };
    weather: {
      description: string;
      icon: string;
    }[];
    dt_txt: string;
  }[];
}

export default function Home() {

  const { isLoading, error, data } = useQuery<ForecastResponse>({
    queryKey: ["weather", "osijek"],
    queryFn: async () => {
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=Osijek,hr&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&units=metric`;
      const response = await axios.get<ForecastResponse>(url);
      return response.data;
    },
  });

  if (isLoading)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading...</p>
      </div>
    );

  if (error) return <div>Error loading weather</div>;
  if (!data) return null;

  const firstData = data.list[0];
  const date = new Date(firstData.dt * 1000);

  const uniqueDates = [
    ...new Set(
      data.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    ),
  ];

  const firstDataForEachDate = uniqueDates.map((date: string) => {
    return data.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();

      return entryDate === date && entryTime >= 6;
    });
  });

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
              <div className="flex flex-col px-4">
                <span className="text-5xl">
                  {Math.round(firstData.main.temp)}°
                </span>
                <p className="text-xs space-x-2">
                  <span>{Math.round(firstData.main.temp_min)}°↓</span>
                  <span>{Math.round(firstData.main.temp_max)}°↑</span>
                </p>
              </div>

              <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                {data.list.slice(0, 8).map((d, i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                  >
                    <p>{format(parseISO(d.dt_txt), "HH:mm")}</p>

                    <WeatherIcon
                      iconName={getDayOrNightIcon(
                        d.weather[0].icon,
                        d.dt_txt
                      )}
                    />

                    <p className="whitespace-nowrap">
                      {Math.round(d.main.temp)}°
                    </p>
                  </div>
                ))}
              </div>
            </Container>
          </div>

          <div className="flex gap-4">

            <Container className="w-fit justify-center flex-col px-4 items-center">
              <p className="capitalize text-center">
                {firstData.weather[0].description}
              </p>

              <WeatherIcon
                iconName={getDayOrNightIcon(
                  firstData.weather[0].icon,
                  firstData.dt_txt
                )}
              />
            </Container>

            <Container className="bg-yellow-300/80 px-6 gap-4 justify-between overflow-x-auto">
              <WeatherDetails
                visibility={metersToKilometers(firstData.visibility)}
                humidity={`${firstData.main.humidity}%`}
                windSpeed={convertWindSpeed(firstData.wind.speed)}
                airPressure={`${firstData.main.pressure} hPa`}
                sunrise={format(fromUnixTime(data.city.sunrise), "H:mm")}
                sunset={format(fromUnixTime(data.city.sunset), "H:mm")}
              />
            </Container>

          </div>
        </section>

        <section className="flex w-full flex-col gap-4">
          <p className="text-2xl">Forecast (5 days)</p>

          {firstDataForEachDate.map((d, i) =>
            d ? (
              <ForecastWeatherDetail
                key={i}
                description={d.weather[0].description}
                date={format(parseISO(d.dt_txt), "dd.MM")}
                day={format(parseISO(d.dt_txt), "EEEE")}
                feels_like={d.main.feels_like}
                temp={d.main.temp}
                temp_max={d.main.temp_max}
                temp_min={d.main.temp_min}
                airPressure={`${d.main.pressure} hPa`}
                humidity={`${d.main.humidity}%`}
                sunrise={format(fromUnixTime(data.city.sunrise), "H:mm")}
                sunset={format(fromUnixTime(data.city.sunset), "H:mm")}
                visibility={`${metersToKilometers(d.visibility)}`}
                windSpeed={convertWindSpeed(d.wind.speed)}
              />
            ) : null
          )}

        </section>

      </main>
    </div>
  );
}