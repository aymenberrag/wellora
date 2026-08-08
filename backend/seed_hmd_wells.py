from datetime import date

from companies.models import Company
from fields.models import Field
from wells.models import Well


operator = Company.objects.get(name="Sonatrach")
field = Field.objects.get(code="HMD")

wells = [
    {
        "code": "HMD-001",
        "name": "Hassi Messaoud 001",
        "well_type": "Oil",
        "status": "Producing",
        "spud_date": date(2018, 3, 15),
        "completion_date": date(2018, 6, 28),
        "first_production_date": date(2018, 7, 5),
        "total_depth": 3425.50,
        "true_vertical_depth": 3350.20,
        "tubing_size": "3.5 in",
        "casing_size": '9⅝ in',
        "artificial_lift": "ESP",
        "reservoir": "Cambrian",
        "formation": "Ra",
        "latitude": 31.658300,
        "longitude": 6.072600,
        "description": "Primary oil producer in Hassi Messaoud.",
    },
    {
        "code": "HMD-014",
        "name": "Hassi Messaoud 014",
        "well_type": "Oil",
        "status": "Producing",
        "spud_date": date(2016, 9, 12),
        "completion_date": date(2017, 1, 30),
        "first_production_date": date(2017, 2, 15),
        "total_depth": 3568.00,
        "true_vertical_depth": 3492.80,
        "tubing_size": "3.5 in",
        "casing_size": '9⅝ in',
        "artificial_lift": "Gas Lift",
        "reservoir": "Cambrian",
        "formation": "Ra",
        "latitude": 31.661000,
        "longitude": 6.080500,
        "description": "High-rate oil producer.",
    },
    {
        "code": "HMD-032",
        "name": "Hassi Messaoud 032",
        "well_type": "Oil",
        "status": "Workover",
        "spud_date": date(2008, 5, 18),
        "completion_date": date(2008, 9, 1),
        "first_production_date": date(2008, 9, 14),
        "total_depth": 3490.00,
        "true_vertical_depth": 3418.00,
        "tubing_size": "2⅞ in",
        "casing_size": '9⅝ in',
        "artificial_lift": "Rod Pump",
        "reservoir": "Cambrian",
        "formation": "Ra",
        "latitude": 31.664500,
        "longitude": 6.087000,
        "description": "Currently under workover.",
    },
    {
        "code": "HMD-041",
        "name": "Hassi Messaoud 041",
        "well_type": "Water Injector",
        "status": "Producing",
        "spud_date": date(2012, 4, 20),
        "completion_date": date(2012, 8, 17),
        "first_production_date": date(2012, 9, 1),
        "total_depth": 3380.40,
        "true_vertical_depth": 3310.00,
        "tubing_size": "4.5 in",
        "casing_size": '9⅝ in',
        "artificial_lift": "Natural Flow",
        "reservoir": "Cambrian",
        "formation": "Ra",
        "latitude": 31.669800,
        "longitude": 6.091200,
        "description": "Water injection support well.",
    },
    {
        "code": "HMD-055",
        "name": "Hassi Messaoud 055",
        "well_type": "Oil",
        "status": "Drilling",
        "spud_date": date(2025, 11, 10),
        "completion_date": None,
        "first_production_date": None,
        "total_depth": None,
        "true_vertical_depth": None,
        "tubing_size": None,
        "casing_size": '13⅜ in',
        "artificial_lift": None,
        "reservoir": "Cambrian",
        "formation": "Ra",
        "latitude": 31.672000,
        "longitude": 6.095000,
        "description": "Development well currently drilling.",
    },
]

for data in wells:
    Well.objects.update_or_create(
        code=data["code"],
        defaults={
            **data,
            "field": field,
            "operator": operator,
            "is_active": True,
        },
    )

print(f"✅ {len(wells)} wells imported successfully.")