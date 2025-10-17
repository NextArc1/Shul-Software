from zmanim.hebrew_calendar.jewish_date import JewishDate
from zmanim.limudim.calculators.daf_yomi_bavli import DafYomiBavli
from zmanim.limudim.calculators.mishna_yomis import MishnaYomis
from zmanim.limudim.calculators.parsha import Parsha
from zmanim.limudim.calculators.daf_yomi_yerushalmi import DafYomiYerushalmi
from zmanim.limudim.calculators.pirkei_avos import PirkeiAvos
from zmanim.limudim.calculators.daf_hashavua_bavli import DafHashavuaBavli
from .amud_yomi_bavli_dirshu import AmudYomiBavliDirshu


def get_limud_description(calculator, date):
    try:
        limud = calculator.limud(JewishDate(date))
        return limud.description() if limud else ""
    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        calculator_name = calculator.__class__.__name__
        logger.error(f"Error in {calculator_name} for {date}: {str(e)}")
        return ""


def get_daf_yomi_bavli(date):
    return get_limud_description(DafYomiBavli(), date)


def get_mishna_yomis(date):
    return get_limud_description(MishnaYomis(), date)


def get_parsha(date, in_israel=False):
    return get_limud_description(Parsha(in_israel), date)


def get_daf_yomi_yerushalmi(date):
    return get_limud_description(DafYomiYerushalmi(), date)


def get_pirkei_avos(date):
    return get_limud_description(PirkeiAvos(), date)


def get_daf_hashavua_bavli(date):
    return get_limud_description(DafHashavuaBavli(), date)


def get_amud_yomi_bavli_dirshu(date):
    return get_limud_description(AmudYomiBavliDirshu(), date)


def get_tehillim_monthly(date):
    jewish_date = JewishDate(date)
    return f"Day {jewish_date.jewish_day} of Tehillim"


def get_custom_zmanim(current_date, in_israel=False):
    return {
        'dafyomibavli': get_daf_yomi_bavli(current_date),
        'mishnayomis': get_mishna_yomis(current_date),
        'parsha': get_parsha(current_date, in_israel),
        'tehillimmonthly': get_tehillim_monthly(current_date),
        'DafYomiYerushalmi': get_daf_yomi_yerushalmi(current_date),
        'pirkeiavos': get_pirkei_avos(current_date),
        'dafhashavuabavli': get_daf_hashavua_bavli(current_date),
        'amudyomibavlidirshu': get_amud_yomi_bavli_dirshu(current_date),
    }
