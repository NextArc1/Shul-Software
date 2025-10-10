"""
Translation mappings for zmanim, Jewish calendar, and limudim terms.
Supports multiple languages for international Jewish communities.
"""

# ============================================================================
# ZMANIM TRANSLATIONS
# ============================================================================

ZMANIM_TRANSLATIONS = {
    # Basic Zmanim (14 terms)
    'Alos HaShachar': {
        'en': 'Alos HaShachar',
        'he': 'עלות השחר',
        's': 'Alot HaShachar',  # Sephardic pronunciation
        'a': 'Alos HaShachar',  # Ashkenazic pronunciation
        'sh': 'עלות השחר',
        'ah': 'עלות השחר',
    },
    'Neitz HaChamah': {
        'en': 'Neitz HaChamah',
        'he': 'נץ החמה',
        's': 'Netz HaChama',  # Sephardic pronunciation
        'a': 'Neitz HaChamah',  # Ashkenazic pronunciation
        'sh': 'נץ החמה',
        'ah': 'נץ החמה',
    },
    'Chatzos': {
        'en': 'Chatzos',
        'he': 'חצות',
        's': 'Chatzot',  # Sephardic pronunciation
        'a': 'Chatzos',  # Ashkenazic pronunciation
        'sh': 'חצות',
        'ah': 'חצות',
    },
    'Mincha Gedola': {
        'en': 'Mincha Gedola',
        'he': 'מנחה גדולה',
        's': 'Mincha Gedola',  # Sephardic pronunciation
        'a': 'Mincha Gedolah',  # Ashkenazic pronunciation
        'sh': 'מנחה גדולה',
        'ah': 'מנחה גדולה',
    },
    'Mincha Ketana': {
        'en': 'Mincha Ketana',
        'he': 'מנחה קטנה',
        's': 'Mincha Ketana',  # Sephardic pronunciation
        'a': 'Mincha Ketanah',  # Ashkenazic pronunciation
        'sh': 'מנחה קטנה',
        'ah': 'מנחה קטנה',
    },
    'Plag HaMincha': {
        'en': 'Plag HaMincha',
        'he': 'פלג המנחה',
        's': 'Plag HaMincha',  # Sephardic pronunciation
        'a': 'Plag HaMinchah',  # Ashkenazic pronunciation
        'sh': 'פלג המנחה',
        'ah': 'פלג המנחה',
    },
    'Shkiah': {
        'en': 'Shkiah',
        'he': 'שקיעה',
        's': 'Shekia',  # Sephardic pronunciation
        'a': 'Shkiah',  # Ashkenazic pronunciation
        'sh': 'שקיעה',
        'ah': 'שקיעה',
    },
    'Tzais': {
        'en': 'Tzais',
        'he': 'צאת הכוכבים',
        's': 'Tzait',  # Sephardic pronunciation
        'a': 'Tzais',  # Ashkenazic pronunciation
        'sh': 'צאת הכוכבים',
        'ah': 'צאת הכוכבים',
    },
    'Tzais 72 minutes': {
        'en': 'Tzais 72 minutes',
        'he': 'צאת הכוכבים 72 דקות',
        's': 'Tzait 72 minutes',  # Sephardic pronunciation
        'a': 'Tzais 72 minutes',  # Ashkenazic pronunciation
        'sh': 'צאת הכוכבים 72 דקות',
        'ah': 'צאת הכוכבים 72 דקות',
    },
    'Sof Zman Krias Shema GRA': {
        'en': 'Sof Zman Krias Shema GRA',
        'he': 'סוף זמן קריאת שמע גר״א',
        's': 'Sof Zman Kriat Shema GRA',  # Sephardic pronunciation
        'a': 'Sof Zman Krias Shema GRA',  # Ashkenazic pronunciation
        'sh': 'סוף זמן קריאת שמע גר״א',
        'ah': 'סוף זמן קריאת שמע גר״א',
    },
    'Sof Zman Krias Shema MGA': {
        'en': 'Sof Zman Krias Shema MGA',
        'he': 'סוף זמן קריאת שמע מג״א',
        's': 'Sof Zman Kriat Shema MGA',  # Sephardic pronunciation
        'a': 'Sof Zman Krias Shema MGA',  # Ashkenazic pronunciation
        'sh': 'סוף זמן קריאת שמע מג״א',
        'ah': 'סוף זמן קריאת שמע מג״א',
    },
    'Sof Zman Tefillah GRA': {
        'en': 'Sof Zman Tefillah GRA',
        'he': 'סוף זמן תפילה גר״א',
        's': 'Sof Zman Tefila GRA',  # Sephardic pronunciation
        'a': 'Sof Zman Tefillah GRA',  # Ashkenazic pronunciation
        'sh': 'סוף זמן תפילה גר״א',
        'ah': 'סוף זמן תפילה גר״א',
    },
    'Sof Zman Tefillah MGA': {
        'en': 'Sof Zman Tefillah MGA',
        'he': 'סוף זמן תפילה מג״א',
        's': 'Sof Zman Tefila MGA',  # Sephardic pronunciation
        'a': 'Sof Zman Tefillah MGA',  # Ashkenazic pronunciation
        'sh': 'סוף זמן תפילה מג״א',
        'ah': 'סוף זמן תפילה מג״א',
    },
    'Candle Lighting': {
        'en': 'Candle Lighting',
        'he': 'הדלקת נרות',
        's': 'Candle Lighting',
        'a': 'Candle Lighting',
        'sh': 'הדלקת נרות',
        'ah': 'הדלקת נרות',
    },

    # Additional Zmanim (12 terms)
    'Sea Level Sunrise': {
        'en': 'Sea Level Sunrise',
        'he': 'זריחה בגובה פני הים',
        's': 'Sea Level Sunrise',  # Sephardic pronunciation
        'a': 'Sea Level Sunrise',  # Ashkenazic pronunciation
        'sh': 'זריחה בגובה פני הים',
        'ah': 'זריחה בגובה פני הים',
    },
    'Sea Level Sunset': {
        'en': 'Sea Level Sunset',
        'he': 'שקיעה בגובה פני הים',
        's': 'Sea Level Sunset',  # Sephardic pronunciation
        'a': 'Sea Level Sunset',  # Ashkenazic pronunciation
        'sh': 'שקיעה בגובה פני הים',
        'ah': 'שקיעה בגובה פני הים',
    },
    'Elevation Adjusted Sunrise': {
        'en': 'Elevation Adjusted Sunrise',
        'he': 'זריחה מותאמת לגובה',
        's': 'Elevation Adjusted Sunrise',  # Sephardic pronunciation
        'a': 'Elevation Adjusted Sunrise',  # Ashkenazic pronunciation
        'sh': 'זריחה מותאמת לגובה',
        'ah': 'זריחה מותאמת לגובה',
    },
    'Elevation Adjusted Sunset': {
        'en': 'Elevation Adjusted Sunset',
        'he': 'שקיעה מותאמת לגובה',
        's': 'Elevation Adjusted Sunset',  # Sephardic pronunciation
        'a': 'Elevation Adjusted Sunset',  # Ashkenazic pronunciation
        'sh': 'שקיעה מותאמת לגובה',
        'ah': 'שקיעה מותאמת לגובה',
    },
    'Alos 16.1°': {
        'en': 'Alos 16.1°',
        'he': 'עלות השחר 16.1°',
        's': 'Alot 16.1°',  # Sephardic pronunciation
        'a': 'Alos 16.1°',  # Ashkenazic pronunciation
        'sh': 'עלות השחר 16.1°',
        'ah': 'עלות השחר 16.1°',
    },
    'Alos 18°': {
        'en': 'Alos 18°',
        'he': 'עלות השחר 18°',
        's': 'Alot 18°',  # Sephardic pronunciation
        'a': 'Alos 18°',  # Ashkenazic pronunciation
        'sh': 'עלות השחר 18°',
        'ah': 'עלות השחר 18°',
    },
    'Alos 19.8°': {
        'en': 'Alos 19.8°',
        'he': 'עלות השחר 19.8°',
        's': 'Alot 19.8°',  # Sephardic pronunciation
        'a': 'Alos 19.8°',  # Ashkenazic pronunciation
        'sh': 'עלות השחר 19.8°',
        'ah': 'עלות השחר 19.8°',
    },
    'Tzais 8.5°': {
        'en': 'Tzais 8.5°',
        'he': 'צאת הכוכבים 8.5°',
        's': 'Tzait 8.5°',  # Sephardic pronunciation
        'a': 'Tzais 8.5°',  # Ashkenazic pronunciation
        'sh': 'צאת הכוכבים 8.5°',
        'ah': 'צאת הכוכבים 8.5°',
    },
    'Tzais 7.083°': {
        'en': 'Tzais 7.083°',
        'he': 'צאת הכוכבים 7.083°',
        's': 'Tzait 7.083°',  # Sephardic pronunciation
        'a': 'Tzais 7.083°',  # Ashkenazic pronunciation
        'sh': 'צאת הכוכבים 7.083°',
        'ah': 'צאת הכוכבים 7.083°',
    },
    'Tzais 5.95°': {
        'en': 'Tzais 5.95°',
        'he': 'צאת הכוכבים 5.95°',
        's': 'Tzait 5.95°',  # Sephardic pronunciation
        'a': 'Tzais 5.95°',  # Ashkenazic pronunciation
        'sh': 'צאת הכוכבים 5.95°',
        'ah': 'צאת הכוכבים 5.95°',
    },
    'Tzais 6.45°': {
        'en': 'Tzais 6.45°',
        'he': 'צאת הכוכבים 6.45°',
        's': 'Tzait 6.45°',  # Sephardic pronunciation
        'a': 'Tzais 6.45°',  # Ashkenazic pronunciation
        'sh': 'צאת הכוכבים 6.45°',
        'ah': 'צאת הכוכבים 6.45°',
    },
    'Sun Transit': {
        'en': 'Sun Transit',
        'he': 'מעבר השמש (חצות החמה)',
        's': 'Sun Transit (Chatzot HaChama)',  # Sephardic pronunciation
        'a': 'Sun Transit (Chatzos HaChamah)',  # Ashkenazic pronunciation
        'sh': 'מעבר השמש (חצות החמה)',
        'ah': 'מעבר השמש (חצות החמה)',
    },

    # Halachic Hours (3 terms)
    'Shaah Zmanis GRA': {
        'en': 'Shaah Zmanis GRA',
        'he': 'שעה זמנית גר״א',
        's': 'Sha\'a Zmanit GRA',  # Sephardic pronunciation
        'a': 'Shaah Zmanis GRA',  # Ashkenazic pronunciation
        'sh': 'שעה זמנית גר״א',
        'ah': 'שעה זמנית גר״א',
    },
    'Shaah Zmanis MGA': {
        'en': 'Shaah Zmanis MGA',
        'he': 'שעה זמנית מג״א',
        's': 'Sha\'a Zmanit MGA',  # Sephardic pronunciation
        'a': 'Shaah Zmanis MGA',  # Ashkenazic pronunciation
        'sh': 'שעה זמנית מג״א',
        'ah': 'שעה זמנית מג״א',
    },
    'Temporal Hour': {
        'en': 'Temporal Hour',
        'he': 'שעה זמנית',
        's': 'Sha\'a Zmanit',  # Sephardic pronunciation
        'a': 'Shaah Zmanis',  # Ashkenazic pronunciation
        'sh': 'שעה זמנית',
        'ah': 'שעה זמנית',
    },
}

# ============================================================================
# LIMUDIM (LEARNING SCHEDULE) TRANSLATIONS
# ============================================================================

LIMUDIM_TRANSLATIONS = {
    'Parsha': {
        'en': 'Parsha',
        'he': 'פרשה',
        's': 'Parasha',  # Sephardic pronunciation
        'a': 'Parsha',  # Ashkenazic pronunciation
        'sh': 'פרשה',
        'ah': 'פרשה',
    },
    'Daf Yomi Bavli': {
        'en': 'Daf Yomi Bavli',
        'he': 'דף יומי בבלי',
        's': 'Daf Yomi Bavli',  # Sephardic pronunciation
        'a': 'Daf Yomi Bavli',  # Ashkenazic pronunciation
        'sh': 'דף יומי בבלי',
        'ah': 'דף יומי בבלי',
    },
    'Daf Yomi Yerushalmi': {
        'en': 'Daf Yomi Yerushalmi',
        'he': 'דף יומי ירושלמי',
        's': 'Daf Yomi Yerushalmi',  # Sephardic pronunciation
        'a': 'Daf Yomi Yerushalmi',  # Ashkenazic pronunciation
        'sh': 'דף יומי ירושלמי',
        'ah': 'דף יומי ירושלמי',
    },
    'Mishna Yomis': {
        'en': 'Mishna Yomis',
        'he': 'משנה יומית',
        's': 'Mishna Yomit',  # Sephardic pronunciation
        'a': 'Mishna Yomis',  # Ashkenazic pronunciation
        'sh': 'משנה יומית',
        'ah': 'משנה יומית',
    },
    'Tehillim Monthly': {
        'en': 'Tehillim Monthly',
        'he': 'תהילים חודשי',
        's': 'Tehillim Chodshi',  # Sephardic pronunciation
        'a': 'Tehillim Monthly',  # Ashkenazic pronunciation
        'sh': 'תהילים חודשי',
        'ah': 'תהילים חודשי',
    },
    'Pirkei Avos': {
        'en': 'Pirkei Avos',
        'he': 'פרקי אבות',
        's': 'Pirkei Avot',  # Sephardic pronunciation
        'a': 'Pirkei Avos',  # Ashkenazic pronunciation
        'sh': 'פרקי אבות',
        'ah': 'פרקי אבות',
    },
    'Daf HaShavua Bavli': {
        'en': 'Daf HaShavua Bavli',
        'he': 'דף השבוע בבלי',
        's': 'Daf HaShavua Bavli',  # Sephardic pronunciation
        'a': 'Daf HaShavua Bavli',  # Ashkenazic pronunciation
        'sh': 'דף השבוע בבלי',
        'ah': 'דף השבוע בבלי',
    },
    'Amud Yomi Bavli Dirshu': {
        'en': 'Amud Yomi Bavli Dirshu',
        'he': 'עמוד יומי בבלי דרשו',
        's': 'Amud Yomi Bavli Dirshu',  # Sephardic pronunciation
        'a': 'Amud Yomi Bavli Dirshu',  # Ashkenazic pronunciation
        'sh': 'עמוד יומי בבלי דרשו',
        'ah': 'עמוד יומי בבלי דרשו',
    },
}

# ============================================================================
# JEWISH CALENDAR TRANSLATIONS
# ============================================================================

JEWISH_CALENDAR_TRANSLATIONS = {
    'Jewish Year': {
        'en': 'Jewish Year',
        'he': 'שנה עברית',
        's': 'Shana Ivrit',  # Sephardic pronunciation
        'a': 'Jewish Year',  # Ashkenazic pronunciation
        'sh': 'שנה עברית',
        'ah': 'שנה עברית',
    },
    'Jewish Month': {
        'en': 'Jewish Month',
        'he': 'חודש עברי',
        's': 'Chodesh Ivri',  # Sephardic pronunciation
        'a': 'Jewish Month',  # Ashkenazic pronunciation
        'sh': 'חודש עברי',
        'ah': 'חודש עברי',
    },
    'Jewish Month Name': {
        'en': 'Jewish Month Name',
        'he': 'שם החודש העברי',
        's': 'Shem HaChodesh',  # Sephardic pronunciation
        'a': 'Jewish Month Name',  # Ashkenazic pronunciation
        'sh': 'שם החודש העברי',
        'ah': 'שם החודש העברי',
    },
    'Jewish Day': {
        'en': 'Jewish Day',
        'he': 'יום עברי',
        's': 'Yom Ivri',  # Sephardic pronunciation
        'a': 'Jewish Day',  # Ashkenazic pronunciation
        'sh': 'יום עברי',
        'ah': 'יום עברי',
    },
    'Day of Week': {
        'en': 'Day of Week',
        'he': 'יום בשבוע',
        's': 'Yom BaShavua',  # Sephardic pronunciation
        'a': 'Day of Week',  # Ashkenazic pronunciation
        'sh': 'יום בשבוע',
        'ah': 'יום בשבוע',
    },
    'Significant Day': {
        'en': 'Significant Day',
        'he': 'יום מיוחד',
        's': 'Yom Meyuchad',  # Sephardic pronunciation
        'a': 'Significant Day',  # Ashkenazic pronunciation
        'sh': 'יום מיוחד',
        'ah': 'יום מיוחד',
    },
    'Day of Omer': {
        'en': 'Day of Omer',
        'he': 'יום בעומר',
        's': 'Yom BaOmer',  # Sephardic pronunciation
        'a': 'Day of Omer',  # Ashkenazic pronunciation
        'sh': 'יום בעומר',
        'ah': 'יום בעומר',
    },
    'Day of Chanukah': {
        'en': 'Day of Chanukah',
        'he': 'יום בחנוכה',
        's': 'Yom BaChanuka',  # Sephardic pronunciation
        'a': 'Day of Chanukah',  # Ashkenazic pronunciation
        'sh': 'יום בחנוכה',
        'ah': 'יום בחנוכה',
    },
    'Is Rosh Chodesh': {
        'en': 'Is Rosh Chodesh',
        'he': 'ראש חודש',
        's': 'Rosh Chodesh',  # Sephardic pronunciation
        'a': 'Rosh Chodesh',  # Ashkenazic pronunciation
        'sh': 'ראש חודש',
        'ah': 'ראש חודש',
    },
    'Is Yom Tov': {
        'en': 'Is Yom Tov',
        'he': 'יום טוב',
        's': 'Yom Tov',  # Sephardic pronunciation
        'a': 'Yom Tov',  # Ashkenazic pronunciation
        'sh': 'יום טוב',
        'ah': 'יום טוב',
    },
    'Is Chol HaMoed': {
        'en': 'Is Chol HaMoed',
        'he': 'חול המועד',
        's': 'Chol HaMoed',  # Sephardic pronunciation
        'a': 'Chol HaMoed',  # Ashkenazic pronunciation
        'sh': 'חול המועד',
        'ah': 'חול המועד',
    },
    'Is Erev Yom Tov': {
        'en': 'Is Erev Yom Tov',
        'he': 'ערב יום טוב',
        's': 'Erev Yom Tov',  # Sephardic pronunciation
        'a': 'Erev Yom Tov',  # Ashkenazic pronunciation
        'sh': 'ערב יום טוב',
        'ah': 'ערב יום טוב',
    },
    'Is Chanukah': {
        'en': 'Is Chanukah',
        'he': 'חנוכה',
        's': 'Chanuka',  # Sephardic pronunciation
        'a': 'Chanukah',  # Ashkenazic pronunciation
        'sh': 'חנוכה',
        'ah': 'חנוכה',
    },
    'Is Fast Day': {
        'en': 'Is Fast Day',
        'he': 'יום צום',
        's': 'Yom Tzom',  # Sephardic pronunciation
        'a': 'Fast Day',  # Ashkenazic pronunciation
        'sh': 'יום צום',
        'ah': 'יום צום',
    },
    'Is Assur Bemelacha': {
        'en': 'Is Assur Bemelacha',
        'he': 'אסור במלאכה',
        's': 'Assur BeMelacha',  # Sephardic pronunciation
        'a': 'Assur Bemelacha',  # Ashkenazic pronunciation
        'sh': 'אסור במלאכה',
        'ah': 'אסור במלאכה',
    },
    'Is Erev Rosh Chodesh': {
        'en': 'Is Erev Rosh Chodesh',
        'he': 'ערב ראש חודש',
        's': 'Erev Rosh Chodesh',  # Sephardic pronunciation
        'a': 'Erev Rosh Chodesh',  # Ashkenazic pronunciation
        'sh': 'ערב ראש חודש',
        'ah': 'ערב ראש חודש',
    },
    'Molad': {
        'en': 'Molad',
        'he': 'מולד',
        's': 'Molad',  # Sephardic pronunciation
        'a': 'Molad',  # Ashkenazic pronunciation
        'sh': 'מולד',
        'ah': 'מולד',
    },
    'Kiddush Levana Earliest (3 Days)': {
        'en': 'Kiddush Levana Earliest (3 Days)',
        'he': 'קידוש לבנה מוקדם (3 ימים)',
        's': 'Kiddush Levana Earliest (3 Days)',  # Sephardic pronunciation
        'a': 'Kiddush Levanah Earliest (3 Days)',  # Ashkenazic pronunciation
        'sh': 'קידוש לבנה מוקדם (3 ימים)',
        'ah': 'קידוש לבנה מוקדם (3 ימים)',
    },
    'Kiddush Levana Earliest (7 Days)': {
        'en': 'Kiddush Levana Earliest (7 Days)',
        'he': 'קידוש לבנה מוקדם (7 ימים)',
        's': 'Kiddush Levana Earliest (7 Days)',  # Sephardic pronunciation
        'a': 'Kiddush Levanah Earliest (7 Days)',  # Ashkenazic pronunciation
        'sh': 'קידוש לבנה מוקדם (7 ימים)',
        'ah': 'קידוש לבנה מוקדם (7 ימים)',
    },
    'Kiddush Levana Latest (15 Days)': {
        'en': 'Kiddush Levana Latest (15 Days)',
        'he': 'קידוש לבנה מאוחר (15 ימים)',
        's': 'Kiddush Levana Latest (15 Days)',  # Sephardic pronunciation
        'a': 'Kiddush Levanah Latest (15 Days)',  # Ashkenazic pronunciation
        'sh': 'קידוש לבנה מאוחר (15 ימים)',
        'ah': 'קידוש לבנה מאוחר (15 ימים)',
    },
}

# ============================================================================
# JEWISH MONTH NAMES
# ============================================================================

JEWISH_MONTH_NAMES = {
    'nissan': {
        'en': 'Nissan',
        'he': 'ניסן',
        's': 'Nissan',  # Sephardic pronunciation
        'a': 'Nissan',  # Ashkenazic pronunciation
        'sh': 'ניסן',
        'ah': 'ניסן',
    },
    'iyar': {
        'en': 'Iyar',
        'he': 'אייר',
        's': 'Iyar',  # Sephardic pronunciation
        'a': 'Iyar',  # Ashkenazic pronunciation
        'sh': 'אייר',
        'ah': 'אייר',
    },
    'sivan': {
        'en': 'Sivan',
        'he': 'סיון',
        's': 'Sivan',  # Sephardic pronunciation
        'a': 'Sivan',  # Ashkenazic pronunciation
        'sh': 'סיון',
        'ah': 'סיון',
    },
    'tammuz': {
        'en': 'Tammuz',
        'he': 'תמוז',
        's': 'Tamuz',  # Sephardic pronunciation
        'a': 'Tammuz',  # Ashkenazic pronunciation
        'sh': 'תמוז',
        'ah': 'תמוז',
    },
    'av': {
        'en': 'Av',
        'he': 'אב',
        's': 'Av',  # Sephardic pronunciation
        'a': 'Av',  # Ashkenazic pronunciation
        'sh': 'אב',
        'ah': 'אב',
    },
    'elul': {
        'en': 'Elul',
        'he': 'אלול',
        's': 'Elul',  # Sephardic pronunciation
        'a': 'Elul',  # Ashkenazic pronunciation
        'sh': 'אלול',
        'ah': 'אלול',
    },
    'tishrei': {
        'en': 'Tishrei',
        'he': 'תשרי',
        's': 'Tishrei',  # Sephardic pronunciation
        'a': 'Tishrei',  # Ashkenazic pronunciation
        'sh': 'תשרי',
        'ah': 'תשרי',
    },
    'cheshvan': {
        'en': 'Cheshvan',
        'he': 'חשון',
        's': 'Cheshvan',  # Sephardic pronunciation
        'a': 'Cheshvan',  # Ashkenazic pronunciation
        'sh': 'חשון',
        'ah': 'חשון',
    },
    'kislev': {
        'en': 'Kislev',
        'he': 'כסלו',
        's': 'Kislev',  # Sephardic pronunciation
        'a': 'Kislev',  # Ashkenazic pronunciation
        'sh': 'כסלו',
        'ah': 'כסלו',
    },
    'teves': {
        'en': 'Teves',
        'he': 'טבת',
        's': 'Tevet',  # Sephardic pronunciation
        'a': 'Teves',  # Ashkenazic pronunciation
        'sh': 'טבת',
        'ah': 'טבת',
    },
    'shevat': {
        'en': 'Shevat',
        'he': 'שבט',
        's': 'Shevat',  # Sephardic pronunciation
        'a': 'Shevat',  # Ashkenazic pronunciation
        'sh': 'שבט',
        'ah': 'שבט',
    },
    'adar': {
        'en': 'Adar',
        'he': 'אדר',
        's': 'Adar',  # Sephardic pronunciation
        'a': 'Adar',  # Ashkenazic pronunciation
        'sh': 'אדר',
        'ah': 'אדר',
    },
    'adar_ii': {
        'en': 'Adar II',
        'he': 'אדר ב׳',
        's': 'Adar Bet',  # Sephardic pronunciation
        'a': 'Adar II',  # Ashkenazic pronunciation
        'sh': 'אדר ב׳',
        'ah': 'אדר ב׳',
    },
}

# ============================================================================
# DAY OF WEEK NAMES
# ============================================================================

DAY_OF_WEEK_NAMES = {
    'Sunday': {
        'en': 'Sunday',
        'he': 'יום ראשון',
        's': 'Yom Rishon',  # Sephardic pronunciation
        'a': 'Sunday',  # Ashkenazic pronunciation
        'sh': 'יום ראשון',
        'ah': 'יום ראשון',
    },
    'Monday': {
        'en': 'Monday',
        'he': 'יום שני',
        's': 'Yom Sheni',  # Sephardic pronunciation
        'a': 'Monday',  # Ashkenazic pronunciation
        'sh': 'יום שני',
        'ah': 'יום שני',
    },
    'Tuesday': {
        'en': 'Tuesday',
        'he': 'יום שלישי',
        's': 'Yom Shlishi',  # Sephardic pronunciation
        'a': 'Tuesday',  # Ashkenazic pronunciation
        'sh': 'יום שלישי',
        'ah': 'יום שלישי',
    },
    'Wednesday': {
        'en': 'Wednesday',
        'he': 'יום רביעי',
        's': 'Yom Revii',  # Sephardic pronunciation
        'a': 'Wednesday',  # Ashkenazic pronunciation
        'sh': 'יום רביעי',
        'ah': 'יום רביעי',
    },
    'Thursday': {
        'en': 'Thursday',
        'he': 'יום חמישי',
        's': 'Yom Chamishi',  # Sephardic pronunciation
        'a': 'Thursday',  # Ashkenazic pronunciation
        'sh': 'יום חמישי',
        'ah': 'יום חמישי',
    },
    'Friday': {
        'en': 'Friday',
        'he': 'יום שישי',
        's': 'Yom Shishi',  # Sephardic pronunciation (Erev Shabbat)
        'a': 'Friday',  # Ashkenazic pronunciation (Erev Shabbos)
        'sh': 'יום שישי',
        'ah': 'יום שישי',
    },
    'Saturday': {
        'en': 'Saturday',
        'he': 'שבת',
        's': 'Shabbat',  # Sephardic pronunciation
        'a': 'Shabbos',  # Ashkenazic pronunciation
        'sh': 'שבת',
        'ah': 'שבת',
    },
}

# ============================================================================
# MESECHTOS (TALMUD TRACTATES) TRANSLATIONS
# ============================================================================

# Map of lowercase tractate names (as returned by library) to translations
# Based on MishnaYomis calculator - includes all Mishna tractates
MESECHTOS_TRANSLATIONS = {
    # Seder Zeraim
    'berachos': {'s': 'Berachot', 'a': 'Berachos', 'he': 'ברכות'},
    'peah': {'s': 'Peah', 'a': 'Peah', 'he': 'פאה'},
    'demai': {'s': 'Demai', 'a': 'Demai', 'he': 'דמאי'},
    'kilayim': {'s': 'Kilayim', 'a': 'Kilayim', 'he': 'כלאים'},
    'sheviis': {'s': 'Shviit', 'a': 'Sheviis', 'he': 'שביעית'},
    'terumos': {'s': 'Terumot', 'a': 'Terumos', 'he': 'תרומות'},
    'maasros': {'s': 'Maasrot', 'a': 'Maasros', 'he': 'מעשרות'},
    'maaser_sheni': {'s': 'Maaser Sheni', 'a': 'Maaser Sheni', 'he': 'מעשר שני'},
    'chalah': {'s': 'Challa', 'a': 'Chalah', 'he': 'חלה'},
    'orlah': {'s': 'Orla', 'a': 'Orlah', 'he': 'ערלה'},
    'bikurim': {'s': 'Bikkurim', 'a': 'Bikurim', 'he': 'ביכורים'},

    # Seder Moed
    'shabbos': {'s': 'Shabbat', 'a': 'Shabbos', 'he': 'שבת'},
    'eruvin': {'s': 'Eruvin', 'a': 'Eruvin', 'he': 'עירובין'},
    'pesachim': {'s': 'Pesachim', 'a': 'Pesachim', 'he': 'פסחים'},
    'shekalim': {'s': 'Shekalim', 'a': 'Shekalim', 'he': 'שקלים'},
    'yoma': {'s': 'Yoma', 'a': 'Yoma', 'he': 'יומא'},
    'sukkah': {'s': 'Sukka', 'a': 'Sukkah', 'he': 'סוכה'},
    'beitzah': {'s': 'Beitza', 'a': 'Beitzah', 'he': 'ביצה'},
    'rosh_hashanah': {'s': 'Rosh HaShana', 'a': 'Rosh Hashanah', 'he': 'ראש השנה'},
    'taanis': {'s': 'Taanit', 'a': 'Taanis', 'he': 'תענית'},
    'megillah': {'s': 'Megilla', 'a': 'Megillah', 'he': 'מגילה'},
    'moed_katan': {'s': 'Moed Katan', 'a': 'Moed Katan', 'he': 'מועד קטן'},
    'chagigah': {'s': 'Chagiga', 'a': 'Chagigah', 'he': 'חגיגה'},

    # Seder Nashim
    'yevamos': {'s': 'Yevamot', 'a': 'Yevamos', 'he': 'יבמות'},
    'kesubos': {'s': 'Ketubot', 'a': 'Kesubos', 'he': 'כתובות'},
    'nedarim': {'s': 'Nedarim', 'a': 'Nedarim', 'he': 'נדרים'},
    'nazir': {'s': 'Nazir', 'a': 'Nazir', 'he': 'נזיר'},
    'sotah': {'s': 'Sota', 'a': 'Sotah', 'he': 'סוטה'},
    'gitin': {'s': 'Gittin', 'a': 'Gittin', 'he': 'גיטין'},
    'kiddushin': {'s': 'Kiddushin', 'a': 'Kiddushin', 'he': 'קידושין'},

    # Seder Nezikin
    'bava_kamma': {'s': 'Bava Kama', 'a': 'Bava Kamma', 'he': 'בבא קמא'},
    'bava_metzia': {'s': 'Bava Metzia', 'a': 'Bava Metzia', 'he': 'בבא מציעא'},
    'bava_basra': {'s': 'Bava Batra', 'a': 'Bava Basra', 'he': 'בבא בתרא'},
    'sanhedrin': {'s': 'Sanhedrin', 'a': 'Sanhedrin', 'he': 'סנהדרין'},
    'makkos': {'s': 'Makkot', 'a': 'Makkos', 'he': 'מכות'},
    'shevuos': {'s': 'Shevuot', 'a': 'Shevuos', 'he': 'שבועות'},
    'eduyos': {'s': 'Eduyot', 'a': 'Eduyos', 'he': 'עדויות'},
    'avodah_zarah': {'s': 'Avoda Zara', 'a': 'Avodah Zarah', 'he': 'עבודה זרה'},
    'avos': {'s': 'Avot', 'a': 'Avos', 'he': 'אבות'},
    'horiyos': {'s': 'Horayot', 'a': 'Horiyos', 'he': 'הוריות'},

    # Seder Kodashim
    'zevachim': {'s': 'Zevachim', 'a': 'Zevachim', 'he': 'זבחים'},
    'menachos': {'s': 'Menachot', 'a': 'Menachos', 'he': 'מנחות'},
    'chullin': {'s': 'Chullin', 'a': 'Chullin', 'he': 'חולין'},
    'bechoros': {'s': 'Bechorot', 'a': 'Bechoros', 'he': 'בכורות'},
    'arachin': {'s': 'Arachin', 'a': 'Arachin', 'he': 'ערכין'},
    'temurah': {'s': 'Temura', 'a': 'Temurah', 'he': 'תמורה'},
    'kerisos': {'s': 'Keritot', 'a': 'Kerisos', 'he': 'כריתות'},
    'meilah': {'s': 'Meila', 'a': 'Meilah', 'he': 'מעילה'},
    'tamid': {'s': 'Tamid', 'a': 'Tamid', 'he': 'תמיד'},
    'midos': {'s': 'Middot', 'a': 'Midos', 'he': 'מידות'},
    'kinnim': {'s': 'Kinnim', 'a': 'Kinnim', 'he': 'קינים'},

    # Seder Taharos
    'keilim': {'s': 'Keilim', 'a': 'Keilim', 'he': 'כלים'},
    'ohalos': {'s': 'Ohalot', 'a': 'Ohalos', 'he': 'אהלות'},
    'negaim': {'s': 'Negaim', 'a': 'Negaim', 'he': 'נגעים'},
    'parah': {'s': 'Para', 'a': 'Parah', 'he': 'פרה'},
    'taharos': {'s': 'Taharot', 'a': 'Taharos', 'he': 'טהרות'},
    'mikvaos': {'s': 'Mikvaot', 'a': 'Mikvaos', 'he': 'מקואות'},
    'niddah': {'s': 'Nidda', 'a': 'Niddah', 'he': 'נדה'},
    'machshirin': {'s': 'Machshirin', 'a': 'Machshirin', 'he': 'מכשירין'},
    'zavim': {'s': 'Zavim', 'a': 'Zavim', 'he': 'זבים'},
    'tevul_yom': {'s': 'Tevul Yom', 'a': 'Tevul Yom', 'he': 'טבול יום'},
    'yadayim': {'s': 'Yadayim', 'a': 'Yadayim', 'he': 'ידיים'},
    'uktzin': {'s': 'Uktzin', 'a': 'Uktzin', 'he': 'עוקצין'},
}

# ============================================================================
# PARSHIYOS (TORAH PORTIONS) TRANSLATIONS
# ============================================================================

# Map of lowercase parsha names (as returned by library) to translations
PARSHIYOS_TRANSLATIONS = {
    # Sefer Bereishis
    'bereishis': {'s': 'Bereshit', 'a': 'Bereishis', 'he': 'בראשית'},
    'noach': {'s': 'Noach', 'a': 'Noach', 'he': 'נח'},
    'lech_lecha': {'s': 'Lech Lecha', 'a': 'Lech Lecha', 'he': 'לך לך'},
    'vayeira': {'s': 'Vayera', 'a': 'Vayeira', 'he': 'וירא'},
    'chayei_sarah': {'s': 'Chayei Sara', 'a': 'Chayei Sarah', 'he': 'חיי שרה'},
    'toldos': {'s': 'Toldot', 'a': 'Toldos', 'he': 'תולדות'},
    'vayeitzei': {'s': 'Vayetzei', 'a': 'Vayeitzei', 'he': 'ויצא'},
    'vayishlach': {'s': 'Vayishlach', 'a': 'Vayishlach', 'he': 'וישלח'},
    'vayeishev': {'s': 'Vayeshev', 'a': 'Vayeishev', 'he': 'וישב'},
    'mikeitz': {'s': 'Miketz', 'a': 'Mikeitz', 'he': 'מקץ'},
    'vayigash': {'s': 'Vayigash', 'a': 'Vayigash', 'he': 'ויגש'},
    'vayechi': {'s': 'Vayechi', 'a': 'Vayechi', 'he': 'ויחי'},

    # Sefer Shemos
    'shemos': {'s': 'Shemot', 'a': 'Shemos', 'he': 'שמות'},
    'vaeirah': {'s': 'Vaera', 'a': 'Vaeirah', 'he': 'וארא'},
    'bo': {'s': 'Bo', 'a': 'Bo', 'he': 'בא'},
    'beshalach': {'s': 'Beshalach', 'a': 'Beshalach', 'he': 'בשלח'},
    'yisro': {'s': 'Yitro', 'a': 'Yisro', 'he': 'יתרו'},
    'mishpatim': {'s': 'Mishpatim', 'a': 'Mishpatim', 'he': 'משפטים'},
    'terumah': {'s': 'Teruma', 'a': 'Terumah', 'he': 'תרומה'},
    'tetzaveh': {'s': 'Tetzaveh', 'a': 'Tetzaveh', 'he': 'תצוה'},
    'ki_sisa': {'s': 'Ki Tisa', 'a': 'Ki Sisa', 'he': 'כי תשא'},
    'vayakheil': {'s': 'Vayakhel', 'a': 'Vayakheil', 'he': 'ויקהל'},
    'pekudei': {'s': 'Pekudei', 'a': 'Pekudei', 'he': 'פקודי'},

    # Sefer Vayikra
    'vayikra': {'s': 'Vayikra', 'a': 'Vayikra', 'he': 'ויקרא'},
    'tzav': {'s': 'Tzav', 'a': 'Tzav', 'he': 'צו'},
    'shemini': {'s': 'Shemini', 'a': 'Shemini', 'he': 'שמיני'},
    'tazria': {'s': 'Tazria', 'a': 'Tazria', 'he': 'תזריע'},
    'metzora': {'s': 'Metzora', 'a': 'Metzora', 'he': 'מצורע'},
    'acharei': {'s': 'Acharei', 'a': 'Acharei', 'he': 'אחרי'},
    'kedoshim': {'s': 'Kedoshim', 'a': 'Kedoshim', 'he': 'קדושים'},
    'emor': {'s': 'Emor', 'a': 'Emor', 'he': 'אמור'},
    'behar': {'s': 'Behar', 'a': 'Behar', 'he': 'בהר'},
    'bechukosai': {'s': 'Bechukotai', 'a': 'Bechukosai', 'he': 'בחוקותי'},

    # Sefer Bamidbar
    'bamidbar': {'s': 'Bamidbar', 'a': 'Bamidbar', 'he': 'במדבר'},
    'naso': {'s': 'Naso', 'a': 'Naso', 'he': 'נשא'},
    'behaalosecha': {'s': 'Behaalotecha', 'a': 'Behaalosecha', 'he': 'בהעלותך'},
    'shelach': {'s': 'Shelach', 'a': 'Shelach', 'he': 'שלח'},
    'korach': {'s': 'Korach', 'a': 'Korach', 'he': 'קרח'},
    'chukas': {'s': 'Chukat', 'a': 'Chukas', 'he': 'חוקת'},
    'balak': {'s': 'Balak', 'a': 'Balak', 'he': 'בלק'},
    'pinchas': {'s': 'Pinchas', 'a': 'Pinchas', 'he': 'פינחס'},
    'matos': {'s': 'Matot', 'a': 'Matos', 'he': 'מטות'},
    'masei': {'s': 'Masei', 'a': 'Masei', 'he': 'מסעי'},

    # Sefer Devarim
    'devarim': {'s': 'Devarim', 'a': 'Devarim', 'he': 'דברים'},
    'vaeschanan': {'s': 'Vaetchanan', 'a': 'Vaeschanan', 'he': 'ואתחנן'},
    'eikev': {'s': 'Ekev', 'a': 'Eikev', 'he': 'עקב'},
    'reei': {'s': 'Reeh', 'a': 'Reei', 'he': 'ראה'},
    'shoftim': {'s': 'Shoftim', 'a': 'Shoftim', 'he': 'שופטים'},
    'ki_seitzei': {'s': 'Ki Teitzei', 'a': 'Ki Seitzei', 'he': 'כי תצא'},
    'ki_savo': {'s': 'Ki Tavo', 'a': 'Ki Savo', 'he': 'כי תבוא'},
    'nitzavim': {'s': 'Nitzavim', 'a': 'Nitzavim', 'he': 'נצבים'},
    'vayeilech': {'s': 'Vayeilech', 'a': 'Vayeilech', 'he': 'וילך'},
    'haazinu': {'s': 'Haazinu', 'a': 'Haazinu', 'he': 'האזינו'},
    'vezos_haberacha': {'s': 'Vezot HaBeracha', 'a': 'Vezos HaBeracha', 'he': 'וזאת הברכה'},
}

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def number_to_gematria(num):
    """
    Convert a number to Hebrew gematria (e.g., 25 -> כ״ה).

    Args:
        num: Integer to convert

    Returns:
        Hebrew gematria string with geresh/gershayim
    """
    if not isinstance(num, int) or num < 1:
        return str(num)

    # Hebrew letter values
    ones = ['', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט']
    tens = ['', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ']
    hundreds = ['', 'ק', 'ר', 'ש', 'ת']

    result = []

    # Handle hundreds
    if num >= 100:
        hundreds_value = (num // 100) * 100
        # For 500+, we need to use ת (400) + remaining hundreds
        if hundreds_value >= 500:
            result.append('ת')  # Add 400
            remaining = hundreds_value - 400
            if remaining >= 300:
                result.append('ש')  # Add 300 for 700+
            elif remaining >= 200:
                result.append('ר')  # Add 200 for 600
            elif remaining >= 100:
                result.append('ק')  # Add 100 for 500
        else:
            hundreds_digit = hundreds_value // 100
            if hundreds_digit > 0:
                result.append(hundreds[hundreds_digit])

    # Handle tens and ones
    remainder = num % 100

    # Special cases for 15 and 16 (avoid using God's name)
    if remainder == 15:
        result.append('טו')
    elif remainder == 16:
        result.append('טז')
    else:
        tens_digit = remainder // 10
        ones_digit = remainder % 10

        if tens_digit > 0:
            result.append(tens[tens_digit])
        if ones_digit > 0:
            result.append(ones[ones_digit])

    gematria_str = ''.join(result)

    # Add geresh/gershayim according to Hebrew convention
    if len(gematria_str) == 1:
        # Single letter: add geresh after
        return gematria_str + '׳'
    elif len(gematria_str) > 1:
        # Multiple letters: add gershayim before last letter
        return gematria_str[:-1] + '״' + gematria_str[-1]

    return gematria_str


def translate_amud_yomi(amud_string, language='en'):
    """
    Translate Amud Yomi string (e.g., "zevachim 25a" or "zevachim 25 a") to the specified language.

    Args:
        amud_string: String like "tractate_name page_number[a|b]" or "tractate_name page_number [a|b]"
        language: Language code (s, a, he, sh, ah)

    Returns:
        Translated string with proper amud formatting:
        - Hebrew: "זבחים כ״ה." (a becomes .) or "זבחים כ״ה:" (b becomes :)
        - Others: "Zevachim 25A" or "Zevachim 25B"
    """
    if not amud_string:
        return amud_string

    import re

    # Parse the amud string - handle both "tractate 25a" and "tractate 25 a" formats
    # Match: tractate_name + number + optional space + amud letter (a or b)
    match = re.match(r'^(.+?)\s+(\d+)\s*([ab])$', amud_string.strip(), re.IGNORECASE)

    if not match:
        # Fallback to regular daf yomi translation if format doesn't match
        return translate_daf_yomi(amud_string, language)

    tractate_name = match.group(1).lower()
    page_number = int(match.group(2))
    amud = match.group(3).lower()

    # Look up translation
    translated_tractate = tractate_name.title()
    if tractate_name in MESECHTOS_TRANSLATIONS:
        translations = MESECHTOS_TRANSLATIONS[tractate_name]
        lang_key = language
        if language in ['sh', 'ah']:
            lang_key = 'he'
        elif language not in ['s', 'a', 'he']:
            lang_key = 'a'
        translated_tractate = translations.get(lang_key, tractate_name.title())

    # Format based on language
    if language in ['he', 'sh', 'ah']:
        # Hebrew: use gematria and . for a, : for b
        page_gematria = number_to_gematria(page_number)
        amud_symbol = '.' if amud == 'a' else ':'
        # Add RLM after symbol to anchor it to the gematria in RTL context
        return f"{translated_tractate} {page_gematria}{amud_symbol}\u200f"
    else:
        # Non-Hebrew: use uppercase A or B
        return f"{translated_tractate} {page_number}{amud.upper()}"


def translate_daf_yomi(daf_string, language='en'):
    """
    Translate Daf Yomi string (e.g., "zevachim 25") to the specified language.

    Args:
        daf_string: String like "tractate_name page_number"
        language: Language code (s, a, he, sh, ah)

    Returns:
        Translated string like "Zevachim 25" or "זבחים כה"
    """
    if not daf_string:
        return daf_string

    # Parse the daf string (format: "tractate_name page_number")
    parts = daf_string.strip().split()
    if len(parts) < 2:
        return daf_string

    # Last part is the page number, everything else is tractate name
    page_number_str = parts[-1]
    tractate_name = ' '.join(parts[:-1]).lower()

    # Look up translation
    if tractate_name in MESECHTOS_TRANSLATIONS:
        translations = MESECHTOS_TRANSLATIONS[tractate_name]

        # Map language codes to translation keys
        lang_key = language
        if language in ['sh', 'ah']:
            lang_key = 'he'
        elif language not in ['s', 'a', 'he']:
            lang_key = 'a'  # Default to Ashkenazic

        translated_tractate = translations.get(lang_key, tractate_name.title())

        # For Hebrew languages, convert page number to gematria
        if language in ['he', 'sh', 'ah']:
            try:
                page_num = int(page_number_str)
                page_number_str = number_to_gematria(page_num)
            except (ValueError, TypeError):
                pass  # Keep original if conversion fails

        return f"{translated_tractate} {page_number_str}"

    # If not found, return title case
    return f"{tractate_name.title()} {page_number_str}"


def translate_mishna_yomis(mishna_string, language='en'):
    """
    Translate Mishna Yomis string (e.g., "menachos 11:1-2") to the specified language.

    Args:
        mishna_string: String like "tractate_name chapter:mishna" or "tractate_name chapter:mishna-mishna"
        language: Language code (s, a, he, sh, ah)

    Returns:
        Translated string with gematria for Hebrew languages
    """
    if not mishna_string:
        return mishna_string

    # Parse the string (format: "tractate_name chapter:mishna" or "tractate_name chapter:mishna-mishna")
    parts = mishna_string.strip().split()
    if len(parts) < 2:
        return mishna_string

    # Last part is the chapter:mishna reference
    reference = parts[-1]
    tractate_name = ' '.join(parts[:-1]).lower()

    # Look up translation
    translated_tractate = tractate_name.title()
    if tractate_name in MESECHTOS_TRANSLATIONS:
        translations = MESECHTOS_TRANSLATIONS[tractate_name]
        lang_key = language
        if language in ['sh', 'ah']:
            lang_key = 'he'
        elif language not in ['s', 'a', 'he']:
            lang_key = 'a'
        translated_tractate = translations.get(lang_key, tractate_name.title())

    # For Hebrew languages, convert numbers in reference to gematria
    if language in ['he', 'sh', 'ah']:
        import re
        # Replace all numbers in the reference with gematria
        def replace_number(match):
            try:
                num = int(match.group(0))
                return number_to_gematria(num)
            except (ValueError, TypeError):
                return match.group(0)

        reference = re.sub(r'\d+', replace_number, reference)

    return f"{translated_tractate} {reference}"


def translate_tehillim(tehillim_string, language='en'):
    """
    Translate Tehillim Monthly string (e.g., "Day 17 of Tehillim") to the specified language.

    Args:
        tehillim_string: String like "Day X of Tehillim" or similar format
        language: Language code (s, a, he, sh, ah)

    Returns:
        Translated string with gematria for Hebrew languages
    """
    if not tehillim_string:
        return tehillim_string

    # Try to extract the day number
    import re
    match = re.search(r'(\d+)', tehillim_string)
    if not match:
        return tehillim_string

    day_num = int(match.group(1))

    # For Hebrew languages, format with gematria
    if language in ['he', 'sh', 'ah']:
        day_hebrew = number_to_gematria(day_num)
        return f"יום {day_hebrew} תהלים"
    else:
        # For non-Hebrew, return as "Day X Tehillim"
        return f"Day {day_num} Tehillim"


def translate_parsha(parsha_string, language='en'):
    """
    Translate Parsha string (e.g., "bereishis") to the specified language.

    Args:
        parsha_string: String like "parsha_name"
        language: Language code (s, a, he, sh, ah)

    Returns:
        Translated string like "Bereishis" or "בראשית"
    """
    if not parsha_string:
        return parsha_string

    # Convert to lowercase for lookup
    parsha_name = parsha_string.strip().lower()

    # Look up translation
    if parsha_name in PARSHIYOS_TRANSLATIONS:
        translations = PARSHIYOS_TRANSLATIONS[parsha_name]

        # Map language codes to translation keys
        lang_key = language
        if language in ['sh', 'ah']:
            lang_key = 'he'
        elif language not in ['s', 'a', 'he']:
            lang_key = 'a'  # Default to Ashkenazic

        return translations.get(lang_key, parsha_name.title())

    # If not found, return title case
    return parsha_name.title()


def translate_term(term, language='en', translation_dict=None):
    """
    Translate a term to the specified language.

    Args:
        term: The English term to translate
        language: Language code (en, he, s, a, sh, ah, etc.)
        translation_dict: Optional specific translation dictionary to use

    Returns:
        Translated term, or original term if translation not found
    """
    if translation_dict is None:
        # Try all translation dictionaries
        for trans_dict in [ZMANIM_TRANSLATIONS, LIMUDIM_TRANSLATIONS,
                          JEWISH_CALENDAR_TRANSLATIONS, JEWISH_MONTH_NAMES,
                          DAY_OF_WEEK_NAMES]:
            if term in trans_dict:
                return trans_dict[term].get(language, term)
    else:
        if term in translation_dict:
            return translation_dict[term].get(language, term)

    return term


def translate_dict_keys(data_dict, language='en'):
    """
    Translate all keys in a dictionary based on the language.

    Args:
        data_dict: Dictionary with English keys
        language: Language code

    Returns:
        New dictionary with translated keys
    """
    translated = {}
    for key, value in data_dict.items():
        # Translate the key
        translated_key = translate_term(key, language)

        # If value is also a month name or day name, translate it
        if isinstance(value, str):
            value_lower = value.lower().replace(' ', '_')
            translated_value = translate_term(value_lower, language, JEWISH_MONTH_NAMES)
            if translated_value == value_lower:
                # Try day of week
                translated_value = translate_term(value, language, DAY_OF_WEEK_NAMES)
                if translated_value == value:
                    translated_value = value
            else:
                translated[translated_key] = translated_value
                continue

        translated[translated_key] = value

    return translated
