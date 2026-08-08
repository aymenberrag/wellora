
from io import BytesIO

from django.http import HttpResponse
from django.db.models import Avg, Count
import matplotlib.pyplot as plt
from reportlab.platypus import Image
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


def create_chart(
    dates,
    values,
    title,
    ylabel,
):
    buffer = BytesIO()

    plt.figure(figsize=(10, 3.5))

    plt.plot(
        dates,
        values,
        marker="o",
        linewidth=2,
    )

    plt.title(title)
    plt.xlabel("Date")
    plt.ylabel(ylabel)

    plt.xticks(
        rotation=45,
        ha="right",
    )

    plt.grid(
        True,
        linestyle="--",
        alpha=0.3,
    )

    plt.tight_layout()

    plt.savefig(
        buffer,
        format="png",
        dpi=150,
        bbox_inches="tight",
    )

    plt.close()

    buffer.seek(0)

    return Image(
        buffer,
        width=9.5 * inch,
        height=3.2 * inch,
    )



def export_well_test_pdf(queryset, filters,well_performance):
    buffer = BytesIO()

    document = SimpleDocTemplate(
        buffer,
        pagesize=landscape(A4),
        rightMargin=10 * mm,
        leftMargin=10 * mm,
        topMargin=10 * mm,
        bottomMargin=10 * mm,
    )

    styles = getSampleStyleSheet()
    elements = []

    # -----------------------------
    # Title
    # -----------------------------

    elements.append(
        Paragraph(
            "Well Test Report",
            styles["Title"],
        )
    )

    elements.append(
        Spacer(1, 8)
    )

    # -----------------------------
    # Filters
    # -----------------------------

    filter_text = (
        f"Field: {filters.get('field') or 'All'} | "
        f"Well: {filters.get('well') or 'All'} | "
        f"From: {filters.get('date_from') or 'All'} | "
        f"To: {filters.get('date_to') or 'All'}"
    )

    elements.append(
        Paragraph(
            filter_text,
            styles["Normal"],
        )
    )

    elements.append(
        Spacer(1, 12)
    )

    # -----------------------------
    # Summary
    # -----------------------------

    summary = queryset.aggregate(
        total_tests=Count("id"),
        average_oil_rate=Avg("oil_rate"),
        average_gas_rate=Avg("gas_rate"),
        average_water_rate=Avg("water_rate"),
        average_wellhead_pressure=Avg(
            "wellhead_pressure"
        ),
        average_bottomhole_pressure=Avg(
            "bottomhole_pressure"
        ),
        average_water_cut=Avg("water_cut"),
        average_gor=Avg("gor"),
    )

    summary_data = [
        [
            "Total Tests",
            "Avg Oil",
            "Avg Gas",
            "Avg Water",
            "Avg WHP",
            "Avg BHP",
            "Avg Water Cut",
            "Avg GOR",
        ],
        [
            summary["total_tests"] or 0,

            round(
                float(
                    summary["average_oil_rate"] or 0
                ),
                2,
            ),

            round(
                float(
                    summary["average_gas_rate"] or 0
                ),
                2,
            ),

            round(
                float(
                    summary["average_water_rate"] or 0
                ),
                2,
            ),

            round(
                float(
                    summary[
                        "average_wellhead_pressure"
                    ] or 0
                ),
                2,
            ),

            round(
                float(
                    summary[
                        "average_bottomhole_pressure"
                    ] or 0
                ),
                2,
            ),

            round(
                float(
                    summary["average_water_cut"]
                    or 0
                ),
                2,
            ),

            round(
                float(
                    summary["average_gor"]
                    or 0
                ),
                2,
            ),
        ],
    ]

    summary_table = Table(
        summary_data,
        repeatRows=1,
    )

    summary_table.setStyle(
        TableStyle([
            (
                "BACKGROUND",
                (0, 0),
                (-1, 0),
                colors.HexColor("#1f2937"),
            ),
            (
                "TEXTCOLOR",
                (0, 0),
                (-1, 0),
                colors.white,
            ),
            (
                "FONTNAME",
                (0, 0),
                (-1, 0),
                "Helvetica-Bold",
            ),
            (
                "ALIGN",
                (0, 0),
                (-1, -1),
                "CENTER",
            ),
            (
                "GRID",
                (0, 0),
                (-1, -1),
                0.5,
                colors.grey,
            ),
            (
                "BACKGROUND",
                (0, 1),
                (-1, 1),
                colors.whitesmoke,
            ),
            (
                "TOPPADDING",
                (0, 0),
                (-1, -1),
                7,
            ),
            (
                "BOTTOMPADDING",
                (0, 0),
                (-1, -1),
                7,
            ),
        ])
    )

    elements.append(summary_table)

    elements.append(
        Spacer(1, 15)
    )

    # -----------------------------
    # Charts
    # -----------------------------

    dates = [
        str(test.test_date)
        for test in queryset
    ]

    oil_values = [
        float(test.oil_rate or 0)
        for test in queryset
    ]

    gas_values = [
        float(test.gas_rate or 0)
        for test in queryset
    ]

    water_values = [
        float(test.water_rate or 0)
        for test in queryset
    ]

    water_cut_values = [
        float(test.water_cut or 0)
        for test in queryset
    ]

    gor_values = [
        float(test.gor or 0)
        for test in queryset
    ]

    choke_values = [
        float(test.choke_size or 0)
        for test in queryset
    ]

    whp_values = [
        (
            float(test.wellhead_pressure)
            if test.wellhead_pressure is not None
            else 0
        )
        for test in queryset
    ]

    bhp_values = [
        (
            float(test.bottomhole_pressure)
            if test.bottomhole_pressure is not None
            else 0
        )
        for test in queryset
    ]


    # Production
    elements.append(
        Paragraph(
            "Production Trends",
            styles["Heading2"],
        )
    )

    elements.append(
        Spacer(1, 6)
    )

    elements.append(
        create_chart(
            dates,
            oil_values,
            "Oil Production",
            "BOPD",
        )
    )

    elements.append(
        create_chart(
            dates,
            gas_values,
            "Gas Production",
            "MSCFD",
        )
    )

    elements.append(
        create_chart(
            dates,
            water_values,
            "Water Production",
            "BWPD",
        )
    )


    # Pressure
    elements.append(
        Paragraph(
            "Pressure Analysis",
            styles["Heading2"],
        )
    )

    elements.append(
        Spacer(1, 6)
    )

    elements.append(
        create_chart(
            dates,
            whp_values,
            "Wellhead Pressure",
            "psi",
        )
    )

    elements.append(
        create_chart(
            dates,
            bhp_values,
            "Bottomhole Pressure",
            "psi",
        )
    )


    # Performance
    elements.append(
        Paragraph(
            "Performance Analysis",
            styles["Heading2"],
        )
    )

    elements.append(
        Spacer(1, 6)
    )

    elements.append(
        create_chart(
            dates,
            water_cut_values,
            "Water Cut",
            "%",
        )
    )

    elements.append(
        create_chart(
            dates,
            gor_values,
            "Gas-Oil Ratio",
            "scf/STB",
        )
    )

    elements.append(
        create_chart(
            dates,
            choke_values,
            "Choke Size",
            "1/64 in",
        )
    )

    elements.append(
        Spacer(1, 15)
    )

    # -----------------------------
    # Well Performance
    # -----------------------------

    elements.append(
        Paragraph(
            "Well Performance",
            styles["Heading2"],
        )
    )

    elements.append(
        Spacer(1, 6)
    )

    performance_data = [[
        "Well",
        "Avg Oil",
        "Avg Gas",
        "Avg Water",
        "Tests",
    ]]

    for well in well_performance[:10]:
        performance_data.append([
            well["well"],
            f'{well["average_oil_rate"]:.2f}',
            f'{well["average_gas_rate"]:.2f}',
            f'{well["average_water_rate"]:.2f}',
            well["test_count"],
        ])

    performance_table = Table(
        performance_data,
        repeatRows=1,
    )

    performance_table.setStyle(
        TableStyle([
            (
                "BACKGROUND",
                (0, 0),
                (-1, 0),
                colors.HexColor("#2563eb"),
            ),
            (
                "TEXTCOLOR",
                (0, 0),
                (-1, 0),
                colors.white,
            ),
            (
                "FONTNAME",
                (0, 0),
                (-1, 0),
                "Helvetica-Bold",
            ),
            (
                "ALIGN",
                (0, 0),
                (-1, -1),
                "CENTER",
            ),
            (
                "GRID",
                (0, 0),
                (-1, -1),
                0.5,
                colors.grey,
            ),
            (
                "ROWBACKGROUNDS",
                (0, 1),
                (-1, -1),
                [
                    colors.white,
                    colors.HexColor("#f3f4f6"),
                ],
            ),
        ])
    )

    elements.append(
        performance_table
    )

    elements.append(
        Spacer(1, 15)
    )
    # -----------------------------
    # Test History
    # -----------------------------

    elements.append(
        Paragraph(
            "Test History",
            styles["Heading2"],
        )
    )

    elements.append(
        Spacer(1, 6)
    )

    table_data = [[
        "Date",
        "Well",
        "Oil",
        "Gas",
        "Water",
        "WHP",
        "BHP",
        "Choke",
        "Water Cut",
        "GOR",
    ]]

    for test in queryset:

        table_data.append([
            str(test.test_date),

            test.well.code,

            f"{float(test.oil_rate or 0):.2f}",

            f"{float(test.gas_rate or 0):.2f}",

            f"{float(test.water_rate or 0):.2f}",

            (
                f"{float(test.wellhead_pressure):.2f}"
                if test.wellhead_pressure is not None
                else "-"
            ),

            (
                f"{float(test.bottomhole_pressure):.2f}"
                if test.bottomhole_pressure is not None
                else "-"
            ),

            (
                f"{float(test.choke_size):.2f}"
                if test.choke_size is not None
                else "-"
            ),

            (
                f"{float(test.water_cut):.2f}%"
                if test.water_cut is not None
                else "-"
            ),

            (
                f"{float(test.gor):.2f}"
                if test.gor is not None
                else "-"
            ),
        ])

    history_table = Table(
        table_data,
        repeatRows=1,
    )

    history_table.setStyle(
        TableStyle([
            (
                "BACKGROUND",
                (0, 0),
                (-1, 0),
                colors.HexColor("#2563eb"),
            ),
            (
                "TEXTCOLOR",
                (0, 0),
                (-1, 0),
                colors.white,
            ),
            (
                "FONTNAME",
                (0, 0),
                (-1, 0),
                "Helvetica-Bold",
            ),
            (
                "ALIGN",
                (0, 0),
                (-1, -1),
                "CENTER",
            ),
            (
                "GRID",
                (0, 0),
                (-1, -1),
                0.5,
                colors.grey,
            ),
            (
                "ROWBACKGROUNDS",
                (0, 1),
                (-1, -1),
                [
                    colors.white,
                    colors.HexColor("#f3f4f6"),
                ],
            ),
            (
                "FONTSIZE",
                (0, 0),
                (-1, -1),
                8,
            ),
            (
                "TOPPADDING",
                (0, 0),
                (-1, -1),
                5,
            ),
            (
                "BOTTOMPADDING",
                (0, 0),
                (-1, -1),
                5,
            ),
        ])
    )

    elements.append(history_table)

    # -----------------------------
    # Build PDF
    # -----------------------------

    document.build(elements)

    buffer.seek(0)

    response = HttpResponse(
        buffer.getvalue(),
        content_type="application/pdf",
    )

    response["Content-Disposition"] = (
        'attachment; '
        'filename="well_test_report.pdf"'
    )

    return response

