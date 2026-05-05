'use client';

import React, { useState } from "react";
import axios from "axios";
import { MdWbSunny, MdMyLocation, MdOutlineLocationOn } from "react-icons/md";
import SearchBox from "./SearchBox";
import { useAtom } from "jotai";
import { placeAtom } from "@/app/atom";
import { loadingCityAtom } from "@/app/atom";

type Props = {
  location?: string;
};

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

type ApiResponse = {
  list: {
    name: string;
  }[];
};

export default function Navbar({ location }: Props) {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState("");

  const [place, setPlace] = useAtom(placeAtom);
  const [, setLoadingCity] = useAtom(loadingCityAtom);

  async function handleInputChange(value: string) {
    setCity(value);

    if (value.length >= 3) {
      try {
        if (!API_KEY) return;

        const response = await axios.get<ApiResponse>(
          `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${API_KEY}`
        );

        const suggestionList: string[] = [
          ...new Set(response.data.list.map((item) => item.name)),
        ];

        setSuggestions(suggestionList);
        setShowSuggestions(true);
        setError("");
      } catch {
        setSuggestions([]);
        setShowSuggestions(true);
        setError("City not found");
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setError("");
    }
  }

  function handleSuggestionClick(value: string) {
    setCity(value);
    setPlace(value);
    setShowSuggestions(false);
  }

  function handleSubmitSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoadingCity(true);

    if (suggestions.length === 0) {
      setError("Location not found");
      setLoadingCity(false);
    } else {
      setError("");

      setTimeout(() => {
        setPlace(city);
        setShowSuggestions(false);
        setLoadingCity(false);
      }, 500);
    }
  }

  async function handleCurrentLocation() {
    if (!navigator.geolocation) return;

    setLoadingCity(true);

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        if (!API_KEY) return;

        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
        );

        const cityName = response.data.name;

        setPlace(cityName);
        setCity(cityName);
        setLoadingCity(false);
      } catch {
        setLoadingCity(false);
      }
    });
  }

  return (
    <>
      <nav className="shadow-sm sticky top-0 left-0 z-50 bg-white">
        <div className="h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <h2 className="text-gray-500 text-3xl">Weather</h2>
            <MdWbSunny className="text-3xl mt-1 text-yellow-300" />
          </div>

          {/* Location + Search */}
          <section className="flex gap-4 items-center">

            <button type="button" onClick={handleCurrentLocation}>
              <MdMyLocation
                title="Your current location"
                className="text-2xl text-gray-400 hover:opacity-80"
              />
            </button>

            <MdOutlineLocationOn className="text-3xl" />

            <p className="text-slate-900/80 text-sm">
              {location ?? place ?? "Unknown"}
            </p>

            <div className="relative hidden md:flex">
              <SearchBox
                value={city}
                onSubmit={handleSubmitSearch}
                onChange={(e) => handleInputChange(e.target.value)}
              />

              {showSuggestions && (
                <SuggestionBox
                  suggestions={suggestions}
                  onClick={handleSuggestionClick}
                  error={error}
                />
              )}
            </div>

          </section>
        </div>
      </nav>

      {/* MOBILE SEARCH */}
      <section className="flex max-w-7xl px-3 md:hidden mt-2">
        <div className="relative w-full">
          <SearchBox
            value={city}
            onSubmit={handleSubmitSearch}
            onChange={(e) => handleInputChange(e.target.value)}
          />

          {showSuggestions && (
            <SuggestionBox
              suggestions={suggestions}
              onClick={handleSuggestionClick}
              error={error}
            />
          )}
        </div>
      </section>
    </>
  );
}

type SuggestionBoxProps = {
  suggestions: string[];
  onClick: (value: string) => void;
  error: string;
};

function SuggestionBox({
  suggestions,
  onClick,
  error,
}: SuggestionBoxProps) {
  return (
    <ul className="bg-white absolute border top-[44px] left-0 border-gray-300 rounded-md min-w-[200px] flex flex-col gap-1 py-2 px-2 z-50">

      {error && suggestions.length === 0 && (
        <li className="text-red-500 p-1">{error}</li>
      )}

      {suggestions.map((city, index) => (
        <li
          key={`${city}-${index}`}
          onClick={() => onClick(city)}
          className="cursor-pointer hover:bg-gray-200 px-2 py-1 rounded"
        >
          {city}
        </li>
      ))}
    </ul>
  );
}