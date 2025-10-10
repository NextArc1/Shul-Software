import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";


// ---- API Hook ------------------------------------------------
function useShulDisplayData(slug) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';
        const response = await fetch(`${apiBaseUrl}/display/${slug}/`);

        // Check content type before parsing
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(`Server returned ${response.status}: Not JSON. Is the backend running?`);
        }

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Shul not found`);
        }

        const json = await response.json();
        setData(json);
        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [slug]);

  return { data, loading, error };
}

// ---- Live Clock Hook -----------------------------------------
function useNow() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

// ---- Shared Components ---------------------------------------
const WoodFrame = ({ children }) => (
  <div
    className="relative h-screen w-screen overflow-hidden text-[#f7f2df]"
    style={{
      fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Noto Sans, sans-serif",
    }}
  >
    {/* Wood frame background */}
    <div className="absolute inset-0 -z-20 bg-[#2b1507]" />
    <div className="absolute inset-x-[1.5vw] inset-y-[1vh] -z-10 rounded-2xl bg-gradient-to-b from-[#3a1f0b] to-[#2c1406] shadow-[inset_0_0_0_2px_rgba(210,180,96,0.25),inset_0_0_40px_rgba(0,0,0,0.65)]" />
    {/* Subtle vignette */}
    <div className="pointer-events-none absolute inset-x-[1.5vw] inset-y-[1vh] rounded-2xl shadow-[inset_0_0_80px_rgba(0,0,0,0.55)]" />
    {children}
  </div>
);

const GoldBorder = ({ className = "", children }) => (
  <div
    className={`relative rounded-xl bg-[#2f1608]/80 backdrop-blur-md border border-[#d2b374]/30 shadow-[0_10px_20px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.04)] ${className}`}
  >
    {/* hairline highlight */}
    <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-[#d2b374]/20" />
    {children}
  </div>
);

// ---- Header --------------------------------------------------
const Header = ({ shulName, hebrewDate, parsha }) => {
  const now = useNow();

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="px-[2vw] pt-[1vh] pb-[0.5vh]">
      <GoldBorder className="px-[1.5vw] py-[0.5vh]">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Shul Name */}
          <div className="flex-1">
            <h1 className="text-[clamp(1rem,1.5vw,1.5rem)] font-bold text-[#d2b374] tracking-wide">
              {shulName}
            </h1>
            {hebrewDate && (
              <p className="text-[clamp(0.65rem,0.8vw,0.85rem)] text-[#f7f2df]/70" dir="rtl">
                {hebrewDate}
              </p>
            )}
          </div>

          {/* Center: Parsha */}
          {parsha && (
            <div className="text-center flex-1">
              <div className="text-[clamp(0.65rem,0.8vw,0.85rem)] text-[#d2b374]/80 uppercase tracking-widest">
                Parashas
              </div>
              <div className="text-[clamp(0.95rem,1.2vw,1.3rem)] font-bold text-[#d2b374]" dir="rtl">
                {parsha}
              </div>
            </div>
          )}

          {/* Right: Clock & Date */}
          <div className="text-right flex-1">
            <div className="text-[clamp(1rem,1.5vw,1.5rem)] font-bold text-[#d2b374] tabular-nums">
              {formatTime(now)}
            </div>
            <div className="text-[clamp(0.65rem,0.8vw,0.85rem)] text-[#f7f2df]/70">
              {formatDate(now)}
            </div>
          </div>
        </div>
      </GoldBorder>
    </div>
  );
};

// ---- Zmanim Column with Auto-Scroll -------------------------
const ZmanimColumn = ({ title, items }) => {
  const scrollRef = React.useRef(null);
  const [shouldScroll, setShouldScroll] = React.useState(false);

  React.useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // Check if content overflows
    const isOverflowing = container.scrollHeight > container.clientHeight;
    setShouldScroll(isOverflowing);

    if (isOverflowing) {
      let scrollPosition = 0;
      const scrollSpeed = 0.5; // pixels per frame
      const pauseAtTop = 3000; // pause 3s at top
      const pauseAtBottom = 3000; // pause 3s at bottom
      let isPaused = true;
      let pauseStart = Date.now();
      let direction = 1; // 1 for down, -1 for up

      const scroll = () => {
        if (!container) return;

        const now = Date.now();
        if (isPaused) {
          if (now - pauseStart >= (direction === 1 ? pauseAtTop : pauseAtBottom)) {
            isPaused = false;
          }
        } else {
          scrollPosition += scrollSpeed * direction;

          // Check if reached bottom
          if (scrollPosition >= container.scrollHeight - container.clientHeight) {
            scrollPosition = container.scrollHeight - container.clientHeight;
            direction = -1; // reverse direction
            isPaused = true;
            pauseStart = Date.now();
          }

          // Check if reached top
          if (scrollPosition <= 0) {
            scrollPosition = 0;
            direction = 1; // reverse direction
            isPaused = true;
            pauseStart = Date.now();
          }

          container.scrollTop = scrollPosition;
        }
      };

      const intervalId = setInterval(scroll, 1000 / 60); // 60 FPS
      return () => clearInterval(intervalId);
    }
  }, [items]);

  return (
    <GoldBorder className="h-full p-[1vw] flex flex-col">
      <h2 className="text-[clamp(1rem,1.3vw,1.4rem)] font-bold text-[#d2b374] text-center mb-[1vh] border-b border-[#d2b374]/20 pb-[0.5vh]">
        {title}
      </h2>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-[0.5vh] scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            className="flex justify-between items-center px-[0.8vw] py-[0.5vh] rounded-lg bg-[#1a0d05]/40 hover:bg-[#1a0d05]/60 transition-colors"
          >
            <span className="text-[clamp(0.75rem,0.95vw,1rem)] text-[#f7f2df]">{item.label}</span>
            <span className="text-[clamp(0.85rem,1.1vw,1.15rem)] font-semibold text-[#d2b374] tabular-nums">
              {item.time}
            </span>
          </div>
        ))}
      </div>
    </GoldBorder>
  );
};

// ---- Center Content with Auto-Scroll ------------------------
const CenterContent = ({ limudim }) => {
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // Check if content overflows
    const isOverflowing = container.scrollHeight > container.clientHeight;

    if (isOverflowing) {
      let scrollPosition = 0;
      const scrollSpeed = 0.3; // slower for limudim
      const pauseAtTop = 4000; // pause 4s at top
      const pauseAtBottom = 4000;
      let isPaused = true;
      let pauseStart = Date.now();
      let direction = 1;

      const scroll = () => {
        if (!container) return;

        const now = Date.now();
        if (isPaused) {
          if (now - pauseStart >= (direction === 1 ? pauseAtTop : pauseAtBottom)) {
            isPaused = false;
          }
        } else {
          scrollPosition += scrollSpeed * direction;

          if (scrollPosition >= container.scrollHeight - container.clientHeight) {
            scrollPosition = container.scrollHeight - container.clientHeight;
            direction = -1;
            isPaused = true;
            pauseStart = Date.now();
          }

          if (scrollPosition <= 0) {
            scrollPosition = 0;
            direction = 1;
            isPaused = true;
            pauseStart = Date.now();
          }

          container.scrollTop = scrollPosition;
        }
      };

      const intervalId = setInterval(scroll, 1000 / 60);
      return () => clearInterval(intervalId);
    }
  }, [limudim]);

  return (
    <GoldBorder className="h-full p-4 flex flex-col">
      <h2 className="text-xl font-bold text-[#d2b374] text-center mb-4 border-b border-[#d2b374]/20 pb-2">
        Daily Learning Schedule
      </h2>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-3"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {limudim && Object.entries(limudim).map(([key, value]) => (
          <div
            key={key}
            className="bg-[#1a0d05]/40 rounded-lg p-4 text-center"
          >
            <div className="text-xs text-[#d2b374]/80 uppercase tracking-widest mb-1">
              {key.replace(/_/g, ' ')}
            </div>
            <div className="text-base font-bold text-[#f7f2df]" dir="rtl">
              {value}
            </div>
          </div>
        ))}

        {/* Rotating announcement area */}
        <div className="bg-[#d2b374]/10 rounded-lg p-4 border border-[#d2b374]/20">
          <div className="text-center">
            <div className="text-sm text-[#d2b374] font-semibold mb-1">
              Welcome to our Kehilla
            </div>
            <div className="text-xs text-[#f7f2df]/80">
              Please silence cell phones during davening
            </div>
          </div>
        </div>
      </div>
    </GoldBorder>
  );
};

// ---- Main Component ------------------------------------------
export default function ShulDisplayWoodGold() {
  const { slug } = useParams();
  const { data, loading, error } = useShulDisplayData(slug);

  // Add global style to hide scrollbars
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (loading) {
    return (
      <WoodFrame>
        <div className="flex items-center justify-center h-full">
          <div className="text-3xl text-[#d2b374]">Loading...</div>
        </div>
      </WoodFrame>
    );
  }

  if (error) {
    return (
      <WoodFrame>
        <div className="flex items-center justify-center h-full">
          <div className="text-3xl text-red-400">Error: {error}</div>
        </div>
      </WoodFrame>
    );
  }

  // Transform API data into display format
  const zmanimItems = data?.zmanim
    ? [
        { label: "Alos HaShachar", time: data.zmanim["Alos HaShachar"] },
        { label: "Neitz HaChamah", time: data.zmanim["Neitz HaChamah"] },
        { label: "Sof Zman Shema", time: data.zmanim["Sof Zman Krias Shema GRA"] },
        { label: "Sof Zman Tefillah", time: data.zmanim["Sof Zman Tefillah GRA"] },
        { label: "Chatzos", time: data.zmanim["Chatzos"] },
        { label: "Mincha Gedola", time: data.zmanim["Mincha Gedola"] },
        { label: "Mincha Ketana", time: data.zmanim["Mincha Ketana"] },
        { label: "Plag HaMincha", time: data.zmanim["Plag HaMincha"] },
        { label: "Shkiah", time: data.zmanim["Shkiah"] },
        { label: "Tzais", time: data.zmanim["Tzais"] },
      ].filter(item => item.time)
    : [];

  const tefillahItems = data?.custom_times
    ? data.custom_times.map(ct => ({
        label: ct.display_name,
        time: ct.time,
      }))
    : [];

  return (
    <WoodFrame>
      {/* Header */}
      <Header
        shulName={data?.shul?.name || "Shul Display"}
        hebrewDate={data?.jewish_calendar?.["Jewish Month Name"]
          ? `${data.jewish_calendar["Jewish Day"]} ${data.jewish_calendar["Jewish Month Name"]} ${data.jewish_calendar["Jewish Year"]}`
          : null}
        parsha={data?.limudim?.Parsha}
      />

      {/* Two Sides Layout with Bottom Center Boxes */}
      <div className="px-[2vw] pb-[1.5vh] pt-[0.5vh] h-[calc(100vh-10vh)]">
        <div className="grid grid-cols-[minmax(18vw,28vw)_1fr_minmax(18vw,28vw)] gap-[3vw] h-full w-full mx-auto">
          {/* Left Side - Two Stacked Boxes */}
          <div className="flex flex-col gap-[1.5vh]">
            {/* Left Top: Zmanim */}
            <div className="h-[44%]">
              <ZmanimColumn title="זמנים · Zmanim" items={zmanimItems} />
            </div>

            {/* Left Bottom: Daily Learning */}
            <div className="h-[25%]">
              <CenterContent limudim={data?.limudim} />
            </div>
          </div>

          {/* Center Column - 2 Bottom Boxes */}
          <div className="flex flex-col gap-[1.5vh]">
            {/* Center Top: Empty */}
            <div className="h-[44%]"></div>

            {/* Center Bottom: 2 Boxes */}
            <div className="h-[25%] grid grid-cols-2 gap-[1vw]">
              {/* Center Left: New Box */}
              <GoldBorder className="h-full p-4 flex flex-col">
                <h2 className="text-lg font-bold text-[#d2b374] text-center mb-3 border-b border-[#d2b374]/20 pb-2">
                  Information
                </h2>
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-sm text-[#f7f2df]/80">
                    Additional content here
                  </div>
                </div>
              </GoldBorder>

              {/* Center Right: New Box */}
              <GoldBorder className="h-full p-4 flex flex-col">
                <h2 className="text-lg font-bold text-[#d2b374] text-center mb-3 border-b border-[#d2b374]/20 pb-2">
                  Updates
                </h2>
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-sm text-[#f7f2df]/80">
                    Additional content here
                  </div>
                </div>
              </GoldBorder>
            </div>
          </div>

          {/* Right Side - Two Stacked Boxes */}
          <div className="flex flex-col gap-[1.5vh]">
            {/* Right Top: Tefillah Times */}
            <div className="h-[44%]">
              <ZmanimColumn
                title="תפילות · Prayer Times"
                items={tefillahItems.length > 0 ? tefillahItems : [
                  { label: "Shacharis", time: "7:00 AM" },
                  { label: "Mincha", time: "6:30 PM" },
                  { label: "Maariv", time: "8:00 PM" },
                ]}
              />
            </div>

            {/* Right Bottom: Announcements */}
            <div className="h-[25%]">
              <GoldBorder className="h-full p-4 flex flex-col">
                <h2 className="text-lg font-bold text-[#d2b374] text-center mb-3 border-b border-[#d2b374]/20 pb-2">
                  Announcements
                </h2>
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-base text-[#d2b374] font-semibold mb-2">
                      Welcome to our Kehilla
                    </div>
                    <div className="text-sm text-[#f7f2df]/80">
                      Please silence cell phones during davening
                    </div>
                  </div>
                </div>
              </GoldBorder>
            </div>
          </div>
        </div>
      </div>
    </WoodFrame>
  );
}
