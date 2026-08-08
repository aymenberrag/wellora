
from io import BytesIO
from reportlab.graphics.charts.linecharts import HorizontalLineChart
from reportlab.graphics.shapes import Drawing, String
from reportlab.graphics import renderPDF
from reportlab.lib.colors import HexColor
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)
def create_line_chart(
    data,
    value_key,
    title,
    y_label,
):
    drawing = Drawing(
        700,
        230,
    )

    chart = HorizontalLineChart()

    chart.x = 55
    chart.y = 45

    chart.width = 610
    chart.height = 150

    values = []

    for item in data:
        value = item.get(value_key, 0)

        if value is None:
            value = 0

        values.append(float(value))

    if not values:
        values = [0]

    chart.data = [values]

    if data:
        chart.categoryAxis.categoryNames = [
            str(item.get("date", ""))
            for item in data
        ]
    else:
        chart.categoryAxis.categoryNames = [
            "No data"
        ]

    chart.categoryAxis.labels.fontSize = 7
    chart.categoryAxis.labels.angle = 45

    chart.valueAxis.labels.fontSize = 7

    chart.valueAxis.valueMin = 0

    max_value = max(values)

    if max_value > 0:
        chart.valueAxis.valueMax = max_value * 1.15
    else:
        chart.valueAxis.valueMax = 1

    chart.valueAxis.valueStep = (
        chart.valueAxis.valueMax / 5
    )

    chart.lines[0].strokeWidth = 2
    chart.lines[0].strokeColor = HexColor(
        "#2563eb"
    )

    chart.joinedLines = True

    drawing.add(chart)

    drawing.add(
        String(
            55,
            205,
            title,
            fontSize=12,
            fontName="Helvetica-Bold",
        )
    )

    drawing.add(
        String(
            55,
            25,
            y_label,
            fontSize=8,
            fillColor=colors.grey,
        )
    )

    return drawing

def generate_production_pdf(
    report_data,
):
    buffer = BytesIO()

    document = SimpleDocTemplate(
        buffer,
        pagesize=landscape(A4),
        rightMargin=15 * mm,
        leftMargin=15 * mm,
        topMargin=15 * mm,
        bottomMargin=15 * mm,
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "ReportTitle",
        parent=styles["Title"],
        alignment=TA_CENTER,
        fontSize=20,
        spaceAfter=8,
    )

    subtitle_style = ParagraphStyle(
        "ReportSubtitle",
        parent=styles["Normal"],
        alignment=TA_CENTER,
        fontSize=10,
        textColor=colors.grey,
        spaceAfter=15,
    )

    heading_style = ParagraphStyle(
        "ReportHeading",
        parent=styles["Heading2"],
        fontSize=13,
        spaceBefore=10,
        spaceAfter=8,
    )

    story = []

    # -----------------------------
    # Header
    # -----------------------------

    story.append(
        Paragraph(
            "WELLORA",
            title_style,
        )
    )

    story.append(
        Paragraph(
            "Production Report",
            subtitle_style,
        )
    )

    # -----------------------------
    # Filters
    # -----------------------------

    filters = report_data.get(
        "filters",
        {},
    )

    filter_data = [
        [
            "Field",
            filters.get("field") or "All",
            "Well",
            filters.get("well") or "All",
            "From",
            filters.get("date_from") or "All",
            "To",
            filters.get("date_to") or "All",
        ]
    ]

    filter_table = Table(
        filter_data,
        colWidths=[
            18 * mm,
            25 * mm,
            18 * mm,
            25 * mm,
            18 * mm,
            30 * mm,
            18 * mm,
            30 * mm,
        ],
    )

    filter_table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, -1),
                    colors.whitesmoke,
                ),
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.lightgrey,
                ),
                (
                    "FONTNAME",
                    (0, 0),
                    (-1, -1),
                    "Helvetica",
                ),
                (
                    "FONTSIZE",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "MIDDLE",
                ),
            ]
        )
    )

    story.append(filter_table)
    story.append(Spacer(1, 12))

    # -----------------------------
    # Summary
    # -----------------------------

    story.append(
        Paragraph(
            "Production Summary",
            heading_style,
        )
    )

    summary = report_data.get(
        "summary",
        {},
    )

    summary_data = [
        [
            "Metric",
            "Value",
            "Unit",
        ],
        [
            "Total Oil",
            f"{summary.get('total_oil', 0):,.2f}",
            "BOPD",
        ],
        [
            "Total Gas",
            f"{summary.get('total_gas', 0):,.2f}",
            "MSCFD",
        ],
        [
            "Total Water",
            f"{summary.get('total_water', 0):,.2f}",
            "BWPD",
        ],
        [
            "Average Oil",
            f"{summary.get('average_oil', 0):,.2f}",
            "BOPD",
        ],
        [
            "Average Gas",
            f"{summary.get('average_gas', 0):,.2f}",
            "MSCFD",
        ],
        [
            "Average Water",
            f"{summary.get('average_water', 0):,.2f}",
            "BWPD",
        ],
        [
            "Production Records",
            str(summary.get("total_records", 0)),
            "",
        ],
    ]

    summary_table = Table(
        summary_data,
        colWidths=[
            55 * mm,
            45 * mm,
            30 * mm,
        ],
    )

    summary_table.setStyle(
        TableStyle(
            [
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
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.lightgrey,
                ),
                (
                    "FONTNAME",
                    (0, 0),
                    (-1, 0),
                    "Helvetica-Bold",
                ),
                (
                    "FONTSIZE",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
                (
                    "ALIGN",
                    (1, 1),
                    (-1, -1),
                    "RIGHT",
                ),
            ]
        )
    )

    story.append(summary_table)

    # -----------------------------
    # Daily production
    # -----------------------------

    story.append(
        Paragraph(
            "Daily Production",
            heading_style,
        )
    )

    daily_production = report_data.get(
        "daily_production",
        [],
    )
    # -----------------------------
    # Production Charts
    # -----------------------------

    story.append(
        Spacer(1, 12)
    )

    story.append(
        create_line_chart(
            daily_production,
            "oil",
            "Oil Production",
            "BOPD",
        )
    )

    story.append(
        Spacer(1, 12)
    )

    story.append(
        create_line_chart(
            daily_production,
            "gas",
            "Gas Production",
            "MSCFD",
        )
    )

    story.append(
        Spacer(1, 12)
    )

    story.append(
        create_line_chart(
            daily_production,
            "water",
            "Water Production",
            "BWPD",
        )
    )

    story.append(
        Spacer(1, 15)
    )
    daily_data = [
        [
            "Date",
            "Oil (BOPD)",
            "Gas (MSCFD)",
            "Water (BWPD)",
        ]
    ]

    for item in daily_production:
        daily_data.append(
            [
                str(item.get("date", "")),
                f"{item.get('oil', 0):,.2f}",
                f"{item.get('gas', 0):,.2f}",
                f"{item.get('water', 0):,.2f}",
            ]
        )

    daily_table = Table(
        daily_data,
        repeatRows=1,
        colWidths=[
            45 * mm,
            45 * mm,
            45 * mm,
            45 * mm,
        ],
    )

    daily_table.setStyle(
        TableStyle(
            [
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
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.lightgrey,
                ),
                (
                    "FONTSIZE",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
                (
                    "ALIGN",
                    (1, 1),
                    (-1, -1),
                    "RIGHT",
                ),
            ]
        )
    )

    story.append(daily_table)

    # -----------------------------
    # Top wells
    # -----------------------------

    story.append(
        Paragraph(
            "Top Producing Wells",
            heading_style,
        )
    )

    top_wells = report_data.get(
        "top_wells",
        [],
    )

    wells_data = [
        [
            "Well Code",
            "Well Name",
            "Oil (BOPD)",
            "Gas (MSCFD)",
            "Water (BWPD)",
        ]
    ]

    for well in top_wells:
        wells_data.append(
            [
                well.get("well_code", ""),
                well.get("well_name", ""),
                f"{well.get('oil', 0):,.2f}",
                f"{well.get('gas', 0):,.2f}",
                f"{well.get('water', 0):,.2f}",
            ]
        )

    wells_table = Table(
        wells_data,
        repeatRows=1,
        colWidths=[
            35 * mm,
            55 * mm,
            40 * mm,
            40 * mm,
            40 * mm,
        ],
    )

    wells_table.setStyle(
        TableStyle(
            [
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
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.lightgrey,
                ),
                (
                    "FONTSIZE",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
            ]
        )
    )

    story.append(wells_table)

    # -----------------------------
    # Build PDF
    # -----------------------------

    document.build(story)

    buffer.seek(0)

    return buffer

