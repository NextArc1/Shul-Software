from django.db import models


class ShulSettings(models.Model):
    # Location Fields
    zip_code = models.CharField(max_length=10)
    country = models.CharField(max_length=50)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    timezone = models.CharField(max_length=100, null=True, blank=True)  # Add timezone field

    language = models.CharField(max_length=50)

    # Zmanim Fields
    alos = models.TimeField(null=True, blank=True)  # Alos HaShachar (source: alos)
    hanetz = models.TimeField(null=True, blank=True)  # Neitz HaChamah / Hanetz (source: hanetz)
    chatzos = models.TimeField(null=True, blank=True)  # Chatzos (source: chatzos)
    mincha_gedola = models.TimeField(null=True, blank=True)  # Mincha Gedola (source: mincha_gedola)
    mincha_ketana = models.TimeField(null=True, blank=True)  # Mincha Ketana (source: mincha_ketana)
    plag_hamincha = models.TimeField(null=True, blank=True)  # Plag HaMincha (source: plag_hamincha)
    shkia = models.TimeField(null=True, blank=True)  # Shkiah (source: shkia)
    tzais = models.TimeField(null=True, blank=True)  # Tzais (source: tzais)
    tzais_72 = models.TimeField(null=True, blank=True)  # Tzais 72 minutes (source: tzais_72)

    # Sof Zman Krias Shema (GRA and MGA)
    sof_zman_krias_shema_gra = models.TimeField(null=True,
                                                blank=True)  # Sof Zman Krias Shema GRA (source: sof_zman_shma_gra)
    sof_zman_krias_shema_mga = models.TimeField(null=True,
                                                blank=True)  # Sof Zman Krias Shema MGA (source: sof_zman_shma_mga)

    # Sof Zman Tefillah (GRA and MGA)
    sof_zman_tfila_gra = models.TimeField(null=True, blank=True)  # Sof Zman Tefillah GRA (source: sof_zman_tfila_gra)
    sof_zman_tfila_mga = models.TimeField(null=True, blank=True)  # Sof Zman Tefillah MGA (source: sof_zman_tfila_mga)

    # Additional Times
    candle_lighting = models.TimeField(null=True, blank=True)  # Candle Lighting (source: candle_lighting)
    parsha = models.CharField(max_length=100, null=True, blank=True)  # Correct field
    # Learning Fields
    dafyomibavli = models.CharField(max_length=100, null=True, blank=True)
    mishnayomis = models.CharField(max_length=100, null=True, blank=True)
    pirkeiavos = models.CharField(max_length=100, null=True, blank=True)
    tanakh_yomi = models.CharField(max_length=100, null=True, blank=True)
    tehillimmonthly = models.CharField(max_length=100, null=True, blank=True)
    AmudYomiBavliDirshu = models.CharField(max_length=100, null=True, blank=True)
    DafYomiYerushalmi = models.CharField(max_length=100, null=True, blank=True)
    yerushalmi_yomi = models.CharField(max_length=100, null=True, blank=True)
    DafHashavuaBavli = models.CharField(max_length=100, null=True, blank=True)

    # New fields for language and time format settings
    language = models.CharField(max_length=20, choices=[
        ('s', 'Sephardic'),
        ('a', 'Ashkenazic'),
        ('he', 'Hebrew'),
        ('de', 'German'),
        ('es', 'Spanish'),
        ('fr', 'French'),
        ('ru', 'Russian'),
        ('pl', 'Polish'),
        ('fi', 'Finnish'),
        ('hu', 'Hungarian'),
        ('ro', 'Romanian'),
        ('ashkenazi_romanian', 'Romanian (Ashk.)'),
        ('uk', 'Ukrainian'),
        ('sh', 'Sephardic + Hebrew'),
        ('ah', 'Ashkenazic + Hebrew'),
    ], default='s')

    time_format = models.CharField(max_length=10, choices=[
        ('12h', '12-hour'),
        ('24h', '24-hour'),
    ], default='12h')

    show_seconds = models.BooleanField(default=False)

    def __str__(self):
        return f"ShulSettings for {self.country} - {self.zip_code if self.zip_code else 'Manual Coordinates'}"

