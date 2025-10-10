import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { api } from "../utils/api";

/* ================= Sizing: set once, all 4 bottom boxes match ================= */
const SMALL_BOX_H = "h-[200px]"; // <— tweak this value (e.g., 190px / 210px) to fine-tune the exact height

/* ================= Auto-scroll container ================= */
const AutoScrollContainer = ({ children, className = "", style = {}, dir }) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    // Check if content overflows
    const checkOverflow = () => {
      const hasOverflow = content.scrollHeight > container.clientHeight;
      setShouldScroll(hasOverflow);
    };

    // Initial check with a slight delay to ensure DOM is fully rendered
    const initialTimeout = setTimeout(checkOverflow, 100);

    // Re-check on resize
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(checkOverflow, 50);
    });
    resizeObserver.observe(container);
    resizeObserver.observe(content);

    return () => {
      clearTimeout(initialTimeout);
      resizeObserver.disconnect();
    };
  }, [children]);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content || !shouldScroll) return;

    let scrollInterval;
    let startTimeout;

    const scroll = () => {
      // Get the height of one copy of the content (half of total since we duplicate)
      const singleContentHeight = content.scrollHeight / 2;

      // Scroll down slowly
      container.scrollTop += 1;

      // When we've scrolled past the first copy, seamlessly reset to the beginning
      if (container.scrollTop >= singleContentHeight) {
        container.scrollTop = 0;
      }
    };

    // Start scrolling after initial 1 second delay
    startTimeout = setTimeout(() => {
      scrollInterval = setInterval(scroll, 50);
    }, 1000);

    return () => {
      clearInterval(scrollInterval);
      clearTimeout(startTimeout);
    };
  }, [shouldScroll]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        ...style,
        overflow: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
      dir={dir}
    >
      <div ref={contentRef}>
        {/* Duplicate content for seamless infinite scroll */}
        {children}
        {shouldScroll && children}
      </div>
    </div>
  );
};

/* ================= Ornaments ================= */
// (Removed BottomCorners entirely per request)

/* Ribbon header (kept) */
const Ribbon = ({ text }) => (
  <div className="relative mx-auto w-fit select-none">
    <svg className="h-12" viewBox="0 0 520 120" aria-hidden>
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0%" stopColor="#b18f25" />
          <stop offset="50%" stopColor="#f5d66d" />
          <stop offset="100%" stopColor="#b18f25" />
        </linearGradient>
      </defs>
      <rect x="90" y="22" width="340" height="76" rx="10" fill="url(#g)" stroke="#8c6d1b" strokeWidth="6" />
      <path d="M90 60 L10 22 L10 98 L90 60" fill="#8c6d1b" />
      <path d="M430 60 L510 22 L510 98 L430 60" fill="#8c6d1b" />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center text-[#2a1a06] font-semibold tracking-wide text-[20px]">
      {text}
    </div>
  </div>
);

/* ================= Helpers ================= */
// Times are formatted by the backend with intelligent rounding and no AM/PM

/* ================= Clock ================= */
const useClock = (twelveHour) => {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  const options = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !!twelveHour
  };
  const timeRaw = now.toLocaleTimeString("en-US", options);
  let time = timeRaw.replace(/\s?(AM|PM)/i, ''); // Remove AM/PM

  // Remove leading zero for 12-hour format
  if (twelveHour && time.startsWith('0')) {
    time = time.substring(1);
  }

  const date = now.toLocaleDateString([], { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  return { time, date };
};

/* ================= Main ================= */
export default function ShulDisplay() {
  const { shulSlug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const [layout, setLayout] = useState(null);

  const fetchDisplayData = useCallback(async () => {
    try {
      const json = await api.get(`/display/${shulSlug}/`);
      setData(json);
      setErr(null);

      // Fetch layout configuration
      try {
        const layoutJson = await api.get('/shul/display-layout/');
        if (layoutJson.layout_config) {
          setLayout(layoutJson.layout_config);
        }
      } catch (layoutError) {
        console.error('Error loading layout:', layoutError);
        // Continue even if layout fails - use empty boxes
      }
    } catch (e) {
      setErr(`Failed to load shul data: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, [shulSlug]);

  useEffect(() => {
    if (!shulSlug) return;
    fetchDisplayData();
    const t = setInterval(fetchDisplayData, 5 * 60 * 1000);
    return () => clearInterval(t);
  }, [shulSlug, fetchDisplayData]);

  const timeFormat = (data?.shul?.time_format) || "24h";
  const showSeconds = (data?.shul?.show_seconds) || false;
  const { time: liveClock, date: longDate } = useClock(timeFormat === "12h");

  const bgStyle = useMemo(() => ({
    backgroundImage: [
      "radial-gradient(ellipse at top left, rgba(0,0,0,.35), transparent 45%)",
      "linear-gradient(0deg, rgba(0,0,0,.35), rgba(0,0,0,.35))",
      'url("https://shulschedule.com/wp-content/uploads/2024/08/SHul-Times-Image-1.png")'
    ].join(", "),
    backgroundSize: "cover, cover, cover",
    backgroundPosition: "center, center, center",
    backgroundRepeat: "no-repeat, no-repeat, no-repeat",
  }), []);

  if (loading)
    return <div className="h-screen w-screen bg-black text-[#ffc764] flex items-center justify-center text-xl">Loading…</div>;
  if (err)
    return (
      <div className="h-screen w-screen bg-black text-[#ffc764] flex items-center justify-center text-center p-6">
        <div><div className="mb-4">{err}</div><button onClick={fetchDisplayData} className="px-4 py-2 bg-[#192138] text-[#ffc764] rounded">Retry</button></div>
      </div>
    );
  if (!data) return null;

  const {
    shul = {},
    zmanim = {},
    limudim = {},
    custom_times = [],
    zmanim_display_names = {},
    limudim_display_names = {},
    calendar_display_names = {}
  } = data;

  // Helper function to get value from layout item
  const getItemValue = (item) => {
    if (!item || !item.id) return null;

    const [type, ...nameParts] = item.id.split('_');
    const name = nameParts.join('_');

    let value = null;

    if (type === 'zmanim') {
      value = zmanim[name];
    } else if (type === 'limudim') {
      value = limudim[name];
    } else if (type === 'calendar') {
      value = data.jewish_calendar?.[name];
    } else {
      // Handle custom times - they might not have prefix
      const customTime = custom_times.find(ct => ct.internal_name === item.id || ct.internal_name === name);
      value = customTime?.time;
    }

    return value;
  };

  // Helper function to get translated display name
  const getDisplayName = (item) => {
    if (!item || !item.name) return item?.name || '';

    // Try to find translated name using the item's original name directly
    // The display_names dicts use the full English name as keys
    if (zmanim_display_names[item.name]) {
      return zmanim_display_names[item.name];
    } else if (limudim_display_names[item.name]) {
      return limudim_display_names[item.name];
    } else if (calendar_display_names[item.name]) {
      return calendar_display_names[item.name];
    }

    // Fallback to original name
    return item.name;
  };

  // Helper function to format value based on type
  const formatValue = (value, isTime = false, fieldName = '') => {
    if (value === null || value === undefined) return null;

    // Handle booleans
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';

    // Times are already formatted by the backend with intelligent rounding
    // Just return them as-is
    return String(value);
  };

  // Map layout boxes to display data
  const shabbosTimes = layout?.box1?.items?.map(item => {
    const value = getItemValue(item);
    const formatted = formatValue(value, true, item.name);
    return formatted ? { time: formatted, label: getDisplayName(item) } : null;
  }).filter(Boolean) || [];

  const weekdayTimes = layout?.box2?.items?.map(item => {
    const value = getItemValue(item);
    const formatted = formatValue(value, true, item.name);
    return formatted ? { time: formatted, label: getDisplayName(item) } : null;
  }).filter(Boolean) || [];

  const dlRows = layout?.box3?.items?.map(item => {
    const value = getItemValue(item);
    const formatted = formatValue(value, false);
    return formatted ? { label: getDisplayName(item), value: formatted } : null;
  }).filter(Boolean) || [];

  const box4Items = layout?.box4?.items?.map(item => {
    const value = getItemValue(item);
    const formatted = formatValue(value, false);
    return formatted ? { label: getDisplayName(item), value: formatted } : null;
  }).filter(Boolean) || [];

  const parsha = data.parsha || shul.parsha || "";
  const titleRight = data.hebrew_header || shul.hebrew_header || "";

  // Use backend-formatted Hebrew date
  const language = shul.language || 'en';
  const isHebrewLanguage = language === 'he' || language === 'sh' || language === 'ah';
  const hebrewDate = data.formatted_hebrew_date || '';

  // Get box display names from layout
  const box1Name = layout?.box1?.displayName || 'Shabbos Times';
  const box2Name = layout?.box2?.displayName || 'Weekday Times';

  const ilui = Array.isArray(data.iluiy_neshamos) ? data.iluiy_neshamos : [
    "אסתר ריבה בת מאיר",
    "משה לעזר בן אברהם יצחק",
    "משה בן דוד",
    "חיים יעקב בן משה",
    "הרה״ג בנימין אשר בן דוב בער",
    "הרה״ג שלמה בן חיים זאב",
    "משה לעזר בן אברהם יצחק"
  ];
  const refuah = Array.isArray(data.refuah_shleima) ? data.refuah_shleima : [
    "נסים בת שרה"
  ];

  return (
    <div className="h-screen w-full text-amber-50 overflow-hidden flex flex-col" style={bgStyle}>
      {/* Top strip */}
      <div className="w-full bg-[#162A45]/95 text-amber-100 flex-shrink-0">
        <div className="mx-auto max-w-[1600px] px-6">
          <div className="grid grid-cols-3 items-center py-3 text-[20px]">
            <div className="text-left">{longDate}</div>
            <div className="text-center font-semibold text-[22px] tracking-wide tabular-nums">{liveClock}</div>
            <div className={`text-right ${isHebrewLanguage ? '' : 'tabular-nums'}`} dir={isHebrewLanguage ? 'rtl' : 'ltr'}>{hebrewDate}</div>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="mx-auto max-w-[1800px] w-full px-8 pt-6 pb-6 flex-1 overflow-hidden flex items-center">

        <div className="w-full grid grid-cols-[minmax(300px,27%)_minmax(0,54%)_minmax(300px,27%)] gap-8">

          {/* LEFT COLUMN */}
          <div className="">
            {/* Tall Shabbos panel */}
            <div className="relative rounded-xl border-[3px] border-[#d4af37] h-[600px] p-8 flex flex-col overflow-hidden">
              <div className="mx-auto w-fit px-6 py-2 rounded-lg border-[3px] border-[#d4af37] bg-[#162A45]/90 text-center text-amber-100 text-[24px] font-semibold mb-4">{box1Name}</div>
              <div className="mb-3 text-center" dir="rtl">
                <div className="text-[44px] font-bold whitespace-nowrap">{parsha}</div>
              </div>
              <AutoScrollContainer className="mt-4 space-y-3 flex-1">
                {shabbosTimes.map((r, i) => (
                  <div key={i} className="grid grid-cols-[1fr_auto_1fr] text-amber-100 text-[22px]">
                    {isHebrewLanguage ? (
                      <>
                        <div className="text-left tabular-nums whitespace-nowrap">{r.time}</div>
                        <div className="mx-3" />
                        <div className="text-right whitespace-nowrap" dir="rtl">{r.label}</div>
                      </>
                    ) : (
                      <>
                        <div className="text-left whitespace-nowrap">{r.label}</div>
                        <div className="mx-3" />
                        <div className="text-right tabular-nums whitespace-nowrap">{r.time}</div>
                      </>
                    )}
                  </div>
                ))}
              </AutoScrollContainer>
            </div>

            {/* Bottom-left small — reference size (we apply the SAME height everywhere) */}
            <div className={`mt-6 rounded-xl border-[3px] border-[#d4af37] p-6 ${SMALL_BOX_H} flex flex-col`}>
              <AutoScrollContainer className="space-y-2 flex-1">
                {dlRows.length ? dlRows.map((r, i) => (
                  <div key={i} className="grid grid-cols-2 text-amber-100 text-[18px]">
                    {isHebrewLanguage ? (
                      <>
                        <div className="text-left pl-2 tabular-nums whitespace-nowrap">{r.value}</div>
                        <div className="text-right pr-2 whitespace-nowrap" dir="rtl">{r.label}</div>
                      </>
                    ) : (
                      <>
                        <div className="text-left pl-2 whitespace-nowrap">{r.label}</div>
                        <div className="text-right pr-2 tabular-nums whitespace-nowrap">{r.value}</div>
                      </>
                    )}
                  </div>
                )) : <div className="text-center text-amber-200/70">—</div>}
              </AutoScrollContainer>
            </div>
          </div>

          {/* CENTER COLUMN: logo/text at top; bottom two small boxes side-by-side */}
          <div className="flex flex-col">
            {/* Center Logo or Text Display */}
            <div className="flex-1 flex flex-col items-center px-8">
              <div style={{ flex: shul.center_vertical_position || 50 }} />
              <div className="flex items-center justify-center">
                {shul.center_logo ? (
                  <img
                    src={shul.center_logo}
                    alt="Shul Logo"
                    className="max-w-full object-contain"
                    style={{ maxHeight: `${shul.center_logo_size || 400}px` }}
                  />
                ) : shul.center_text ? (
                  <div
                    className="text-center font-bold"
                    style={{
                      fontSize: `${shul.center_text_size || 48}px`,
                      color: shul.center_text_color || '#ffc764',
                      fontFamily: shul.center_text_font || 'Arial'
                    }}
                    dir={isHebrewLanguage ? 'rtl' : 'ltr'}
                  >
                    {shul.center_text}
                  </div>
                ) : null}
              </div>
              <div style={{ flex: 100 - (shul.center_vertical_position || 50) }} />
            </div>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div>
                <div className="text-center text-amber-200 mb-2" dir="rtl">לעילוי נשמת</div>
                <div className={`rounded-xl border-[3px] border-[#d4af37] p-6 ${SMALL_BOX_H} flex flex-col`}>
                  <AutoScrollContainer className="space-y-2 text-center flex-1" dir="rtl">
                    {ilui.length ? ilui.map((n, i) => <div key={i} className="whitespace-nowrap">{n}</div>) : <div>—</div>}
                  </AutoScrollContainer>
                </div>
              </div>
              <div>
                <div className="text-center text-amber-200 mb-2" dir="rtl">רפואה שלמה</div>
                <div className={`rounded-xl border-[3px] border-[#d4af37] p-6 ${SMALL_BOX_H} flex flex-col`}>
                  <AutoScrollContainer className="space-y-2 text-center flex-1" dir="rtl">
                    {refuah.length ? refuah.map((n, i) => <div key={i} className="whitespace-nowrap">{n}</div>) : <div>—</div>}
                  </AutoScrollContainer>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="">
            {/* Tall Weekday panel */}
            <div className="relative rounded-xl border-[3px] border-[#d4af37] h-[600px] p-8 flex flex-col overflow-hidden">
              <div className="mx-auto w-fit px-6 py-2 rounded-lg border-[3px] border-[#d4af37] bg-[#162A45]/90 text-center text-amber-100 text-[24px] font-semibold mb-4">{box2Name}</div>
              <AutoScrollContainer className="mt-6 space-y-3 flex-1">
                {weekdayTimes.map((r, i) => (
                  <div key={i} className="grid grid-cols-[1fr_auto_1fr] text-amber-100 text-[22px]">
                    {isHebrewLanguage ? (
                      <>
                        <div className="text-left tabular-nums whitespace-nowrap">{r.time}</div>
                        <div className="mx-3" />
                        <div className="text-right whitespace-nowrap" dir="rtl">{r.label}</div>
                      </>
                    ) : (
                      <>
                        <div className="text-left whitespace-nowrap">{r.label}</div>
                        <div className="mx-3" />
                        <div className="text-right tabular-nums whitespace-nowrap">{r.time}</div>
                      </>
                    )}
                  </div>
                ))}
              </AutoScrollContainer>
            </div>

            {/* Bottom-right small — now same size as bottom-left */}
            <div className={`mt-6 rounded-xl border-[3px] border-[#d4af37] p-6 ${SMALL_BOX_H} flex flex-col`}>
              <AutoScrollContainer className="space-y-2 flex-1">
                {box4Items.length ? box4Items.map((r, i) => (
                  <div key={i} className="grid grid-cols-2 text-amber-100 text-[18px]">
                    {isHebrewLanguage ? (
                      <>
                        <div className="text-left pl-2 tabular-nums whitespace-nowrap">{r.value}</div>
                        <div className="text-right pr-2 whitespace-nowrap" dir="rtl">{r.label}</div>
                      </>
                    ) : (
                      <>
                        <div className="text-left pl-2 whitespace-nowrap">{r.label}</div>
                        <div className="text-right pr-2 tabular-nums whitespace-nowrap">{r.value}</div>
                      </>
                    )}
                  </div>
                )) : <div className="text-center text-amber-200/70">—</div>}
              </AutoScrollContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Footer strip */}
      <div className="fixed bottom-0 left-0 right-0 text-center text-[14px] text-amber-200/90 bg-[#162A45]/90 py-1">
        If you want this for your shul too, sign up for free at shulschedule.com
      </div>
    </div>
  );
}
