import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { api } from "../utils/api";

/* ================= Sizing: set once, all 4 bottom boxes match ================= */
const SMALL_BOX_H = "h-[200px]"; // <— tweak this value (e.g., 190px / 210px) to fine-tune the exact height

/* ================= FitText component for auto-shrinking text ================= */
const FitText = ({ children, style = {}, className = "", maxFontSize, minFontSize = 8 }) => {
  const ref = useRef(null);
  const [fontSize, setFontSize] = useState(maxFontSize);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const adjustFontSize = () => {
      // Start with the max font size
      const baseSize = maxFontSize || parseInt(style.fontSize) || 22;
      let currentSize = baseSize;

      // Reset to base size first
      element.style.fontSize = `${baseSize}px`;

      // Force a reflow to get accurate measurements
      void element.offsetWidth;

      // Shrink until text fits (with a small buffer for safety)
      while (element.scrollWidth > (element.clientWidth + 1) && currentSize > minFontSize) {
        currentSize -= 0.5;
        element.style.fontSize = `${currentSize}px`;
        void element.offsetWidth; // Force reflow
      }

      setFontSize(currentSize);
    };

    // Initial adjustment with a longer delay to ensure DOM is fully rendered
    const timeout = setTimeout(adjustFontSize, 150);

    // Re-adjust on resize
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(adjustFontSize, 100);
    });
    resizeObserver.observe(element);

    return () => {
      clearTimeout(timeout);
      resizeObserver.disconnect();
    };
  }, [children, style.fontSize, maxFontSize, minFontSize]);

  return (
    <div ref={ref} className={className} style={{ ...style, fontSize: `${fontSize}px`, minHeight: 'fit-content' }}>
      {children}
    </div>
  );
};

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
const useClock = (twelveHour, timezone) => {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  const options = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: !!twelveHour,
    timeZone: timezone || undefined  // Use shul's timezone
  };
  const timeRaw = now.toLocaleTimeString("en-US", options);
  let time = timeRaw.replace(/\s?(AM|PM)/i, ''); // Remove AM/PM

  // Remove leading zero for 12-hour format
  if (twelveHour && time.startsWith('0')) {
    time = time.substring(1);
  }

  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: timezone || undefined  // Use shul's timezone
  };
  const date = now.toLocaleDateString("en-US", dateOptions);
  return { time, date };
};

/* ================= Main ================= */
export default function ShulDisplay() {
  const { shulSlug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const fetchDisplayData = useCallback(async () => {
    try {
      const json = await api.get(`/display/${shulSlug}/`);
      setData(json);
      setErr(null);
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
  const timezone = (data?.shul?.timezone) || "America/New_York";
  const { time: liveClock, date: longDate } = useClock(timeFormat === "12h", timezone);

  const bgStyle = useMemo(() => {
    const backgroundType = data?.shul?.background_type || 'default';
    const backgroundColor = data?.shul?.background_color || '#000000';
    const backgroundImage = data?.shul?.background_image;

    if (backgroundType === 'color') {
      // Solid color background
      return {
        backgroundColor: backgroundColor
      };
    } else if (backgroundType === 'image' && backgroundImage) {
      // Custom image background
      return {
        backgroundImage: `url("${backgroundImage}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      };
    } else {
      // Default background
      return {
        backgroundImage: [
          "radial-gradient(ellipse at top left, rgba(0,0,0,.35), transparent 45%)",
          "linear-gradient(0deg, rgba(0,0,0,.35), rgba(0,0,0,.35))",
          'url("https://shulschedule.com/wp-content/uploads/2024/08/SHul-Times-Image-1.png")'
        ].join(", "),
        backgroundSize: "cover, cover, cover",
        backgroundPosition: "center, center, center",
        backgroundRepeat: "no-repeat, no-repeat, no-repeat",
      };
    }
  }, [data?.shul?.background_type, data?.shul?.background_color, data?.shul?.background_image]);

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
    custom_texts = [],
    zmanim_display_names = {},
    limudim_display_names = {},
    calendar_display_names = {},
    layout = null
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
    } else if (type === 'customtext') {
      // Handle custom texts
      const customText = custom_texts.find(ct => ct.internal_name === name);
      if (customText) {
        // Return a special object to mark this as custom text
        return { _customText: customText };
      }
      return null;
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
    // Check if it's a custom text
    if (value && value._customText) {
      const ct = value._customText;
      if (ct.text_type === 'divider') {
        return { isDivider: true, dividerColor: ct.font_color };
      }
      if (ct.text_type === 'line_space') {
        return { isLineSpace: true, lineThickness: ct.line_thickness || 40 };
      }
      return { isCustomText: true, label: ct.display_name, text: ct.text_content, fontSize: ct.font_size, fontColor: ct.font_color, textAlign: ct.text_align };
    }
    const formatted = formatValue(value, true, item.name);
    return formatted ? { time: formatted, label: getDisplayName(item) } : null;
  }).filter(Boolean) || [];

  const weekdayTimes = layout?.box2?.items?.map(item => {
    const value = getItemValue(item);
    // Check if it's a custom text
    if (value && value._customText) {
      const ct = value._customText;
      if (ct.text_type === 'divider') {
        return { isDivider: true, dividerColor: ct.font_color };
      }
      if (ct.text_type === 'line_space') {
        return { isLineSpace: true, lineThickness: ct.line_thickness || 40 };
      }
      return { isCustomText: true, label: ct.display_name, text: ct.text_content, fontSize: ct.font_size, fontColor: ct.font_color, textAlign: ct.text_align };
    }
    const formatted = formatValue(value, true, item.name);
    return formatted ? { time: formatted, label: getDisplayName(item) } : null;
  }).filter(Boolean) || [];

  const dlRows = layout?.box3?.items?.map(item => {
    const value = getItemValue(item);
    // Check if it's a custom text
    if (value && value._customText) {
      const ct = value._customText;
      if (ct.text_type === 'divider') {
        return { isDivider: true, dividerColor: ct.font_color };
      }
      if (ct.text_type === 'line_space') {
        return { isLineSpace: true, lineThickness: ct.line_thickness || 40 };
      }
      return { isCustomText: true, label: ct.display_name, value: ct.text_content, fontSize: ct.font_size, fontColor: ct.font_color, textAlign: ct.text_align };
    }
    const formatted = formatValue(value, false);
    return formatted ? { label: getDisplayName(item), value: formatted } : null;
  }).filter(Boolean) || [];

  const box4Items = layout?.box4?.items?.map(item => {
    const value = getItemValue(item);
    // Check if it's a custom text
    if (value && value._customText) {
      const ct = value._customText;
      if (ct.text_type === 'divider') {
        return { isDivider: true, dividerColor: ct.font_color };
      }
      if (ct.text_type === 'line_space') {
        return { isLineSpace: true, lineThickness: ct.line_thickness || 40 };
      }
      return { isCustomText: true, label: ct.display_name, value: ct.text_content, fontSize: ct.font_size, fontColor: ct.font_color, textAlign: ct.text_align };
    }
    const formatted = formatValue(value, false);
    return formatted ? { label: getDisplayName(item), value: formatted } : null;
  }).filter(Boolean) || [];

  const box5Items = layout?.box5?.items?.map(item => {
    const value = getItemValue(item);
    // Check if it's a custom text
    if (value && value._customText) {
      const ct = value._customText;
      if (ct.text_type === 'divider') {
        return { isDivider: true, dividerColor: ct.font_color };
      }
      if (ct.text_type === 'line_space') {
        return { isLineSpace: true, lineThickness: ct.line_thickness || 40 };
      }
      return { isCustomText: true, label: ct.display_name, value: ct.text_content, fontSize: ct.font_size, fontColor: ct.font_color, textAlign: ct.text_align };
    }
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

  // Get outline color for all boxes (default gold)
  const outlineColor = shul.boxes_outline_color || '#d4af37';
  // Get background color for all boxes (default transparent)
  const boxesBackgroundColor = shul.boxes_background_color || '';

  // Get header colors
  const headerTextColor = shul.header_text_color || '#ffc764';
  const headerBgColor = shul.header_bg_color || '#162A45';

  // Get box styling from shul settings
  const box1TitleStyle = {
    fontFamily: shul.box1_title_font || 'Arial',
    color: shul.box1_title_color || '#ffc764'
  };
  const box1TextStyle = {
    fontFamily: shul.box1_text_font || 'Arial',
    color: shul.box1_text_color || '#ffc764',
    fontSize: `${shul.box1_text_size || 22}px`
  };
  const box2TitleStyle = {
    fontFamily: shul.box2_title_font || 'Arial',
    color: shul.box2_title_color || '#ffc764'
  };
  const box2TextStyle = {
    fontFamily: shul.box2_text_font || 'Arial',
    color: shul.box2_text_color || '#ffc764',
    fontSize: `${shul.box2_text_size || 22}px`
  };
  const box3TextStyle = {
    fontFamily: shul.box3_text_font || 'Arial',
    color: shul.box3_text_color || '#ffc764',
    fontSize: `${shul.box3_text_size || 18}px`
  };
  const box4TextStyle = {
    fontFamily: shul.box4_text_font || 'Arial',
    color: shul.box4_text_color || '#ffc764',
    fontSize: `${shul.box4_text_size || 18}px`
  };
  const box5TextStyle = {
    fontFamily: shul.box5_text_font || 'Arial',
    color: shul.box5_text_color || '#ffc764',
    fontSize: `${shul.box5_text_size || 24}px`
  };

  // Get memorial boxes from shul database (editable by master admin only)
  const ilui = Array.isArray(shul.ilui_nishmat) && shul.ilui_nishmat.length > 0
    ? shul.ilui_nishmat
    : [];
  const refuah = Array.isArray(shul.refuah_shleima) && shul.refuah_shleima.length > 0
    ? shul.refuah_shleima
    : [];

  // Center box text style - uses box1 font and color but hardcoded size
  const centerBoxTextStyle = {
    fontFamily: shul.box1_text_font || 'Arial',
    color: shul.box1_text_color || '#ffc764',
    fontSize: '18px'
  };

  return (
    <div className="h-screen w-full text-amber-50 overflow-hidden flex flex-col" style={bgStyle}>
      {/* Top strip */}
      <div className="w-full flex-shrink-0" style={{ backgroundColor: headerBgColor, color: headerTextColor, opacity: 0.95, borderBottom: `2px solid ${outlineColor}` }}>
        <div className="mx-auto max-w-[1600px] px-6">
          <div className="grid grid-cols-3 items-center py-3 text-[20px]">
            <div className="text-left">{longDate}</div>
            <div className="text-center font-semibold text-[22px] tracking-wide tabular-nums">{liveClock}</div>
            <div className={`text-right ${isHebrewLanguage ? '' : 'tabular-nums'}`} dir={isHebrewLanguage ? 'rtl' : 'ltr'}>{hebrewDate}</div>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="mx-auto max-w-[1800px] w-full px-4 lg:px-8 pt-4 lg:pt-6 pb-20 lg:pb-6 flex-1 overflow-y-auto lg:overflow-hidden flex items-start lg:items-center">

        <div className="w-full grid grid-cols-1 lg:grid-cols-[minmax(300px,30%)_minmax(0,40%)_minmax(300px,30%)] gap-4 lg:gap-8">

          {/* LEFT COLUMN */}
          <div className="">
            {/* Tall Shabbos panel */}
            <div className="relative rounded-xl border-[3px] h-[600px] p-8 flex flex-col overflow-hidden" style={{ borderColor: outlineColor, backgroundColor: boxesBackgroundColor || 'transparent' }}>
              <div className="mx-auto w-fit px-6 py-2 rounded-lg border-[3px] text-center text-[24px] font-semibold mb-4" style={{ borderColor: outlineColor, backgroundColor: headerBgColor, opacity: 0.9, ...box1TitleStyle }}>{box1Name}</div>
              <div className="mb-3 text-center" dir="rtl">
                <div className="text-[44px] font-bold whitespace-nowrap">{parsha}</div>
              </div>
              <AutoScrollContainer className="mt-4 space-y-3 flex-1">
                {shabbosTimes.map((r, i) => {
                  if (r.isDivider) {
                    return <hr key={i} className="border-t-2 my-2" style={{ borderColor: r.dividerColor || 'rgba(251, 191, 36, 0.3)' }} />;
                  }
                  if (r.isLineSpace) {
                    return <div key={i} style={{ height: `${r.lineThickness}px` }} />;
                  }
                  if (r.isCustomText) {
                    return (
                      <div key={i} className="break-words" style={{ fontSize: r.fontSize ? `${r.fontSize}px` : box1TextStyle.fontSize, color: r.fontColor || box1TextStyle.color, fontFamily: box1TextStyle.fontFamily, textAlign: r.textAlign || 'left' }}>
                        {r.text}
                      </div>
                    );
                  }
                  return (
                    <FitText key={i} className="grid grid-cols-[1fr_auto_1fr]" style={box1TextStyle} maxFontSize={shul.box1_text_size || 22}>
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
                    </FitText>
                  );
                })}
              </AutoScrollContainer>
            </div>

            {/* Bottom-left small — reference size (we apply the SAME height everywhere) */}
            <div className={`mt-6 rounded-xl border-[3px] p-6 ${SMALL_BOX_H} flex flex-col`} style={{ borderColor: outlineColor, backgroundColor: boxesBackgroundColor || 'transparent' }}>
              <AutoScrollContainer className="space-y-2 flex-1">
                {dlRows.length ? dlRows.map((r, i) => {
                  if (r.isDivider) {
                    return <hr key={i} className="border-t-2 my-2" style={{ borderColor: r.dividerColor || 'rgba(251, 191, 36, 0.3)' }} />;
                  }
                  if (r.isLineSpace) {
                    return <div key={i} style={{ height: `${r.lineThickness}px` }} />;
                  }
                  if (r.isCustomText) {
                    return (
                      <div key={i} className="break-words" style={{ fontSize: r.fontSize ? `${r.fontSize}px` : box3TextStyle.fontSize, color: r.fontColor || box3TextStyle.color, fontFamily: box3TextStyle.fontFamily, textAlign: r.textAlign || 'left' }}>
                        {r.value}
                      </div>
                    );
                  }
                  return (
                    <FitText key={i} className="grid grid-cols-2" style={box3TextStyle} maxFontSize={shul.box3_text_size || 18}>
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
                    </FitText>
                  );
                }) : null}
              </AutoScrollContainer>
            </div>
          </div>

          {/* CENTER COLUMN: wide top box, logo/text, bottom two small boxes side-by-side */}
          <div className="flex flex-col">
            {/* Wide top box (Box 5) - only show if enabled */}
            {shul.show_box5 && (
              <div className="rounded-xl border-[3px] p-4 mb-6 h-[160px] flex flex-col overflow-hidden" style={{ borderColor: outlineColor, backgroundColor: boxesBackgroundColor || 'transparent' }}>
                <AutoScrollContainer className="space-y-2 flex-1">
                  {box5Items.length ? box5Items.map((r, i) => {
                    if (r.isDivider) {
                      return <hr key={i} className="border-t-2 my-2" style={{ borderColor: r.dividerColor || 'rgba(251, 191, 36, 0.3)' }} />;
                    }
                    if (r.isLineSpace) {
                      return <div key={i} style={{ height: `${r.lineThickness}px` }} />;
                    }
                    if (r.isCustomText) {
                      return (
                        <div key={i} className="break-words" style={{ fontSize: r.fontSize ? `${r.fontSize}px` : box5TextStyle.fontSize, color: r.fontColor || box5TextStyle.color, fontFamily: box5TextStyle.fontFamily, textAlign: r.textAlign || 'center' }}>
                          {r.value}
                        </div>
                      );
                    }
                    return (
                      <FitText key={i} className="grid grid-cols-2" style={box5TextStyle} maxFontSize={shul.box5_text_size || 24}>
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
                      </FitText>
                    );
                  }) : <div className="text-center" style={box5TextStyle}>Announcements</div>}
                </AutoScrollContainer>
              </div>
            )}

            {/* Center Logo or Text Display */}
            <div className={`flex flex-col items-center px-8 ${shul.show_box5 ? '' : 'flex-1'}`} style={shul.show_box5 ? { height: '380px' } : {}}>
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
            <div className={`grid grid-cols-2 gap-6 ${shul.show_box5 ? 'mt-6' : 'mt-4'}`}>
              <div>
                <div className="text-center mb-2 text-[20px]" dir="rtl" style={box1TitleStyle}>לעילוי נשמת</div>
                <div className={`rounded-xl border-[3px] p-6 ${SMALL_BOX_H} flex flex-col`} style={{ borderColor: outlineColor, backgroundColor: boxesBackgroundColor || 'transparent' }}>
                  <AutoScrollContainer className="space-y-2 text-center flex-1" dir="rtl">
                    {ilui.length ? ilui.map((n, i) => (
                      <FitText key={i} style={centerBoxTextStyle} maxFontSize={18}>
                        <div className="whitespace-nowrap">{n}</div>
                      </FitText>
                    )) : <div>—</div>}
                  </AutoScrollContainer>
                </div>
              </div>
              <div>
                <div className="text-center mb-2 text-[20px]" dir="rtl" style={box1TitleStyle}>רפואה שלמה</div>
                <div className={`rounded-xl border-[3px] p-6 ${SMALL_BOX_H} flex flex-col`} style={{ borderColor: outlineColor, backgroundColor: boxesBackgroundColor || 'transparent' }}>
                  <AutoScrollContainer className="space-y-2 text-center flex-1" dir="rtl">
                    {refuah.length ? refuah.map((n, i) => (
                      <FitText key={i} style={centerBoxTextStyle} maxFontSize={18}>
                        <div className="whitespace-nowrap">{n}</div>
                      </FitText>
                    )) : <div>—</div>}
                  </AutoScrollContainer>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="">
            {/* Tall Weekday panel */}
            <div className="relative rounded-xl border-[3px] h-[600px] p-8 flex flex-col overflow-hidden" style={{ borderColor: outlineColor, backgroundColor: boxesBackgroundColor || 'transparent' }}>
              <div className="mx-auto w-fit px-6 py-2 rounded-lg border-[3px] text-center text-[24px] font-semibold mb-4" style={{ borderColor: outlineColor, backgroundColor: headerBgColor, opacity: 0.9, ...box2TitleStyle }}>{box2Name}</div>
              <AutoScrollContainer className="mt-6 space-y-3 flex-1">
                {weekdayTimes.map((r, i) => {
                  if (r.isDivider) {
                    return <hr key={i} className="border-t-2 my-2" style={{ borderColor: r.dividerColor || 'rgba(251, 191, 36, 0.3)' }} />;
                  }
                  if (r.isLineSpace) {
                    return <div key={i} style={{ height: `${r.lineThickness}px` }} />;
                  }
                  if (r.isCustomText) {
                    return (
                      <div key={i} className="break-words" style={{ fontSize: r.fontSize ? `${r.fontSize}px` : box2TextStyle.fontSize, color: r.fontColor || box2TextStyle.color, fontFamily: box2TextStyle.fontFamily, textAlign: r.textAlign || 'left' }}>
                        {r.text}
                      </div>
                    );
                  }
                  return (
                    <FitText key={i} className="grid grid-cols-[1fr_auto_1fr]" style={box2TextStyle} maxFontSize={shul.box2_text_size || 22}>
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
                    </FitText>
                  );
                })}
              </AutoScrollContainer>
            </div>

            {/* Bottom-right small — now same size as bottom-left */}
            <div className={`mt-6 rounded-xl border-[3px] p-6 ${SMALL_BOX_H} flex flex-col`} style={{ borderColor: outlineColor, backgroundColor: boxesBackgroundColor || 'transparent' }}>
              <AutoScrollContainer className="space-y-2 flex-1">
                {box4Items.length ? box4Items.map((r, i) => {
                  if (r.isDivider) {
                    return <hr key={i} className="border-t-2 my-2" style={{ borderColor: r.dividerColor || 'rgba(251, 191, 36, 0.3)' }} />;
                  }
                  if (r.isLineSpace) {
                    return <div key={i} style={{ height: `${r.lineThickness}px` }} />;
                  }
                  if (r.isCustomText) {
                    return (
                      <div key={i} className="break-words" style={{ fontSize: r.fontSize ? `${r.fontSize}px` : box4TextStyle.fontSize, color: r.fontColor || box4TextStyle.color, fontFamily: box4TextStyle.fontFamily, textAlign: r.textAlign || 'left' }}>
                        {r.value}
                      </div>
                    );
                  }
                  return (
                    <FitText key={i} className="grid grid-cols-2" style={box4TextStyle} maxFontSize={shul.box4_text_size || 18}>
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
                    </FitText>
                  );
                }) : null}
              </AutoScrollContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Footer strip */}
      <div className="fixed bottom-0 left-0 right-0 text-center text-[14px] text-amber-200/90 py-1" style={{ backgroundColor: headerBgColor, borderTop: `2px solid ${outlineColor}` }}>
        If you want this for your shul too, sign up for free at shulschedule.com
      </div>
    </div>
  );
}
