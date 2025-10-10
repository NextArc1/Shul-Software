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

// Marble & Gold – light, elegant lobby-style template
export default function ShulDisplayMarbleGold() {
  const { slug } = useParams();
  const { data: apiData, loading, error } = useShulDisplayData(slug);
  const now = useNow();

  // Loading state
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
        <div className="text-3xl text-yellow-800 font-semibold">טוען...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
        <div className="text-2xl text-red-600">שגיאה: {error}</div>
      </div>
    );
  }

  // Transform API data to template format
  const shulName = apiData?.shul?.name || "קהילה";
  const parsha = apiData?.limudim?.Parsha || "";

  // Build Hebrew date
  const hebrewDate = apiData?.jewish_calendar?.["Jewish Month Name"]
    ? `${apiData.jewish_calendar["Jewish Day"]} ${apiData.jewish_calendar["Jewish Month Name"]} ${apiData.jewish_calendar["Jewish Year"]}`
    : "";

  // Map Zmanim (left column)
  const zmanimLeft = apiData?.zmanim
    ? [
        { l: "עלות השחר", t: apiData.zmanim["Alos HaShachar"] },
        { l: "נץ החמה", t: apiData.zmanim["Neitz HaChamah"] },
        { l: "סז\"ק\"ש", t: apiData.zmanim["Sof Zman Krias Shema GRA"] },
        { l: "סז\"ת", t: apiData.zmanim["Sof Zman Tefillah GRA"] },
        { l: "חצות", t: apiData.zmanim["Chatzos"] },
        { l: "מנחה גדולה", t: apiData.zmanim["Mincha Gedola"] },
        { l: "מנחה קטנה", t: apiData.zmanim["Mincha Ketana"] },
        { l: "פלג המנחה", t: apiData.zmanim["Plag HaMincha"] },
        { l: "שקיעה", t: apiData.zmanim["Shkiah"] },
        { l: "צאת הכוכבים", t: apiData.zmanim["Tzais"] },
      ].filter(item => item.t)
    : [];

  // Map Custom Times (right column)
  const tefillahTimes = apiData?.custom_times
    ? apiData.custom_times.map(ct => ({
        l: ct.display_name,
        t: ct.time,
      }))
    : [];

  // Notes/announcements - you can add an announcements field to your API
  const notes = apiData?.announcements || [];

  return (
    <div className="h-screen w-screen text-neutral-900" dir="rtl">
      {/* Marble background layers */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.6),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.5),transparent_45%)]" />
      <div className="absolute inset-0 -z-20 bg-[url('https://images.unsplash.com/photo-1523419409543-8a46d283f0a5?q=80&w=1600&auto=format&fit=crop')] bg-cover opacity-20" />

      <div className="h-full w-full p-8 grid grid-rows-[auto_1fr_auto] grid-cols-12 gap-6">
        {/* Header */}
        <div className="col-span-12 rounded-2xl bg-white/80 backdrop-blur border border-yellow-700/20 shadow-[0_10px_30px_rgba(0,0,0,0.08)] px-6 py-4">
          <div className="flex items-end justify-between">
            <div className="flex items-baseline gap-4">
              <h1 className="text-[clamp(22px,3.2vw,44px)] font-extrabold">{shulName}</h1>
              {parsha && (
                <div className="text-[clamp(14px,1.6vw,20px)] text-yellow-800">{parsha}</div>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm opacity-70">{hebrewDate}</div>
              <div className="text-base font-semibold tabular-nums">
                {now.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}
              </div>
            </div>
          </div>
        </div>

        {/* Left - Zmanim */}
        <div className="col-span-12 lg:col-span-3 rounded-2xl bg-white/85 backdrop-blur border border-yellow-700/20 shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-5">
          <div className="text-yellow-900 font-semibold tracking-widest uppercase text-sm">זמני היום</div>
          <div className="mt-3 divide-y divide-yellow-800/15">
            {zmanimLeft.map((x,i)=> (
              <div key={i} className="grid grid-cols-[1fr_auto] items-center py-2">
                <div className="text-[clamp(14px,1.6vw,18px)]">{x.l}</div>
                <div className="text-[clamp(16px,2vw,22px)] font-bold tabular-nums">{x.t}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Center - Daily Learning */}
        <div className="col-span-12 lg:col-span-6 rounded-2xl bg-white/90 backdrop-blur border border-yellow-700/20 shadow-[0_20px_40px_rgba(0,0,0,0.08)] overflow-hidden">
          <div className="px-6 py-3 border-b border-yellow-800/20 text-center font-semibold text-yellow-900">לימוד יומי · Daily Learning</div>
          <div className="p-6 overflow-y-auto h-full">
            <div className="space-y-4">
              {apiData?.limudim && Object.entries(apiData.limudim).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-gradient-to-br from-yellow-50/80 to-white/80 rounded-xl p-5 border border-yellow-700/20 shadow-sm"
                >
                  <div className="text-xs text-yellow-800 uppercase tracking-widest mb-2 font-semibold">
                    {key.replace(/_/g, ' ')}
                  </div>
                  <div className="text-lg font-bold text-neutral-900" dir="rtl">
                    {value}
                  </div>
                </div>
              ))}
            </div>

            {/* Welcome message */}
            <div className="mt-6 bg-gradient-to-r from-yellow-100/50 to-yellow-50/50 rounded-xl p-5 border border-yellow-700/20">
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-900 mb-2">ברוכים הבאים</div>
                <div className="text-sm text-neutral-700">אנא שמרו על שקט בעת התפילה</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Tefillah Times + Notes */}
        <div className="col-span-12 lg:col-span-3 rounded-2xl bg-white/85 backdrop-blur border border-yellow-700/20 shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-5">
          <div className="text-yellow-900 font-semibold tracking-widest uppercase text-sm">זמני תפילה</div>
          <div className="mt-3 divide-y divide-yellow-800/15">
            {tefillahTimes.length > 0 ? (
              tefillahTimes.map((x,i)=> (
                <div key={i} className="grid grid-cols-[1fr_auto] items-center py-2">
                  <div className="text-[clamp(14px,1.6vw,18px)]">{x.l}</div>
                  <div className="text-[clamp(16px,2vw,22px)] font-bold tabular-nums">{x.t}</div>
                </div>
              ))
            ) : (
              // Fallback if no custom times
              <>
                <div className="grid grid-cols-[1fr_auto] items-center py-2">
                  <div className="text-[clamp(14px,1.6vw,18px)]">שחרית</div>
                  <div className="text-[clamp(16px,2vw,22px)] font-bold tabular-nums">7:30</div>
                </div>
                <div className="grid grid-cols-[1fr_auto] items-center py-2">
                  <div className="text-[clamp(14px,1.6vw,18px)]">מנחה</div>
                  <div className="text-[clamp(16px,2vw,22px)] font-bold tabular-nums">1:45</div>
                </div>
                <div className="grid grid-cols-[1fr_auto] items-center py-2">
                  <div className="text-[clamp(14px,1.6vw,18px)]">מעריב</div>
                  <div className="text-[clamp(16px,2vw,22px)] font-bold tabular-nums">8:00</div>
                </div>
              </>
            )}
          </div>
          {notes.length > 0 && (
            <div className="mt-4 space-y-3">
              {notes.map((n,i)=> (
                <div key={i} className="rounded-lg border border-yellow-800/20 bg-white/70 p-3">
                  <div className="font-semibold">{n.title || n.t}</div>
                  <div className="text-sm opacity-90">{n.body || n.b}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom ticker */}
        <div className="col-span-12 rounded-xl bg-gradient-to-r from-yellow-200/70 via-yellow-100/80 to-yellow-200/70 border border-yellow-800/30 shadow-[0_6px_20px_rgba(0,0,0,0.08)] px-4 py-3 text-center text-yellow-900 uppercase tracking-widest text-xs">
          לצורכי בטיחות, אנא שמרו על שקט בעת התפילה · Welcome · ברוכים הבאים
        </div>
      </div>
    </div>
  );
}
