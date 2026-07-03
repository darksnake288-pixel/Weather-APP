import React, { useEffect, useState, useRef, useMemo } from 'react';
// استيراد الأيقونات المتنوعة للطقس
import { WiHumidity, WiStrongWind, WiDaySunny, WiCloudy, WiRain, WiSnow } from 'react-icons/wi';

const WeatherCard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const inputRef = useRef(null);

  const search = async (city) => {
    try {
      const url = `https://api.weatherapi.com/v1/current.json?key=149d91117cfc45fcab4201833260207&q=${city}&aqi=no`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        setWeatherData(data);
        console.log(data);
      } else {
        alert("City not found!");
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    search("Cairo");
  }, []);

  const searchEngine = () => {
    const city = inputRef.current.value;
    if (city.trim() !== "") {
      search(city);
    }
  };

  // 🧠 ✅ استخدام useMemo هنا لحفظ الأيقونة المناسبة في الذاكرة
  const weatherIcon = useMemo(() => {
    // لو لسه الداتا مجاتش من الـ API، ارجع null
    if (!weatherData) return null;
    
    console.log("جاري تحديد الأيقونة المناسبة وتخزينها بالـ useMemo... 💾");
    const text = weatherData.current.condition.text.toLowerCase();

    if (text.includes("sunny") || text.includes("clear")) {
      return <WiDaySunny className="text-8xl text-[#FFB300] drop-shadow-[0_0_20px_rgba(255,179,0,0.6)]" />;
    }
    if (text.includes("cloud") || text.includes("overcast") || text.includes("mist")) {
      return (
        <div className="relative w-36 h-36 flex items-center justify-center">
          <WiCloudy className="text-7xl text-slate-400 absolute top-2 left-4 opacity-70" />
          <WiCloudy className="text-8xl text-white drop-shadow-md" />
        </div>
      );
    }
    if (text.includes("rain") || text.includes("drizzle") || text.includes("shower")) {
      return <WiRain className="text-8xl text-blue-300 drop-shadow-lg" />;
    }
    if (text.includes("snow") || text.includes("blizzard") || text.includes("ice")) {
      return <WiSnow className="text-8xl text-teal-100 drop-shadow-lg" />;
    }

    return <WiDaySunny className="text-8xl text-[#FFB300]" />;
    
  }, [weatherData]); // 🎯 التبعية (Dependency): الحسبة دي مش هتشتغل إلا لو الـ weatherData اتغيرت


  return (
    <section className="flex items-center justify-center min-h-screen bg-[#E2D9F3] p-6">
      <div className="w-[400px] h-[600px] bg-gradient-to-b from-[#2F3CBC] via-[#3C2FA7] to-[#1E1968] rounded-[32px] shadow-2xl p-7 flex flex-col items-center justify-between text-white">
        
        {/* 🔍 1. حاوية البحث والزرار */}
        <div className="w-full flex gap-3 justify-center items-center mt-2">
          <input 
            type="text" 
            placeholder="Search" 
            ref={inputRef}
            className="w-full bg-[#EBFAFA] text-slate-700 placeholder-slate-400 font-medium py-3 px-6 rounded-full focus:outline-none text-base shadow-inner"
          />
          <button
            onClick={searchEngine}
            className="bg-white text-[#2F3CBC] p-3 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors shadow-md cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
        </div>

        {/* ☀️ 2. الجزء الأوسط الديناميكي */}
        {weatherData ? (
          <div className="flex flex-col items-center gap-2 flex-1 justify-center w-full">
            
            {/* 🔄 ✅ التعديل هنا: بنعرض المتغير المتخزن مباشرة كـ Component من غير أقواس دالة */}
            <div className="w-36 h-36 flex items-center justify-center mb-2">
              {weatherIcon}
            </div>

            {/* درجة الحرارة الحقيقية */}
            <h1 className="text-6xl font-normal tracking-tight">
              {Math.round(weatherData.current.temp_c)}°c
            </h1>
            
            {/* اسم المدينة */}
            <h2 className="text-3xl font-light tracking-wide text-slate-100 mt-1">
              {weatherData.location.name}
            </h2>

            <p className="text-xs text-indigo-200 capitalize font-medium tracking-wider">
              {weatherData.current.condition.text}
            </p>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-slate-300 text-sm animate-pulse">Loading weather data...</p>
          </div>
        )}

        {/* 💧💨 3. الجزء السفلي: تفاصيل الرطوبة والرياح */}
        {weatherData && (
          <div className="w-full flex items-center justify-between px-2 mb-4 mt-auto">
            <div className="flex items-center gap-2">
              <WiHumidity className="text-4xl text-slate-200" />
              <div className="flex flex-col">
                <span className="text-lg font-medium leading-none">
                  {weatherData.current.humidity} %
                </span>
                <span className="text-[11px] text-slate-300 font-normal mt-1">Humidity</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <WiStrongWind className="text-4xl text-slate-200" />
              <div className="flex flex-col">
                <span className="text-lg font-medium leading-none">
                  {weatherData.current.wind_kph} Km/h
                </span>
                <span className="text-[11px] text-slate-300 font-normal mt-1">Wind Speed</span>
              </div>
            </div>
          </div>
        )}
      </div> 
    </section>
  );
};

export default WeatherCard;