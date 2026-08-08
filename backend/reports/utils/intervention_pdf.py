from io import BytesIO
from datetime import datetime

import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import (
    getSampleStyleSheet,
    ParagraphStyle,
)
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    Image,
    PageBreak,
)


def create_chart(
    labels,
    values,
    title,
    chart_type="bar",
):
    """
    Create a chart in memory and return
    a BytesIO object.
    """

    buffer = BytesIO()

    fig, ax = plt.subplots(
        figsize=(9, 4.5)
    )

    if not labels:
        ax.text(
            0.5,
            0.5,
            "No data available",
            ha="center",
            va="center",
            fontsize=14,
        )

        ax.set_axis_off()

    elif chart_type == "line":

        ax.plot(
            labels,
            values,
            marker="o",
            linewidth=2,
        )

        ax.set_xlabel("Date")
        ax.set_ylabel("Interventions")

        plt.xticks(
            rotation=45,
            ha="right",
        )

    else:

        ax.bar(
            labels,
            values,
        )

        ax.set_ylabel("Interventions")

        plt.xticks(
            rotation=45,
            ha="right",
        )

    ax.set_title(
        title,
        fontsize=14,
        fontweight="bold",
    )

    ax.grid(
        axis="y",
        linestyle="--",
        alpha=0.3,
    )

    fig.tight_layout()

    fig.savefig(
        buffer,
        format="png",
        dpi=180,
        bbox_inches="tight",
    )

    plt.close(fig)

    buffer.seek(0)

    return buffer


def add_page_number(canvas, doc):
    canvas.saveState()

    canvas.setFont(
        "Helvetica",
        8,
    )

    canvas.drawRightString(
        285 * mm,
        10 * mm,
        f"Page {doc.page}",
    )

    canvas.restoreState()


def generate_intervention_pdf(
    queryset,
    filters,
):
    buffer = BytesIO()

    document = SimpleDocTemplate(
        buffer,
        pagesize=landscape(A4),
        rightMargin=12 * mm,
        leftMargin=12 * mm,
        topMargin=12 * mm,
        bottomMargin=15 * mm,
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        "ReportTitle",
        parent=styles["Title"],
        fontSize=22,
        leading=26,
        alignment=TA_CENTER,
        spaceAfter=8,
    )

    section_style = ParagraphStyle(
        "Section",
        parent=styles["Heading2"],
        fontSize=15,
        leading=18,
        spaceBefore=8,
        spaceAfter=8,
    )

    normal_style = ParagraphStyle(
        "NormalReport",
        parent=styles["Normal"],
        fontSize=9,
        leading=12,
    )

    small_style = ParagraphStyle(
        "SmallReport",
        parent=styles["Normal"],
        fontSize=7,
        leading=9,
    )

    story = []

    # ==================================================
    # TITLE
    # ==================================================

    story.append(
        Paragraph(
            "INTERVENTION REPORT",
            title_style,
        )
    )

    story.append(
        Paragraph(
            f"Generated: "
            f"{datetime.now().strftime('%Y-%m-%d %H:%M')}",
            normal_style,
        )
    )

    story.append(Spacer(1, 8))

    # ==================================================
    # FILTERS
    # ==================================================

    story.append(
        Paragraph(
            "Applied Filters",
            section_style,
        )
    )

    filter_data = [
        ["Filter", "Value"],
        [
            "Field",
            filters.get("field") or "All",
        ],
        [
            "Well",
            filters.get("well") or "All",
        ],
        [
            "Intervention Type",
            filters.get(
                "intervention_type"
            ) or "All",
        ],
        [
            "Status",
            filters.get("status") or "All",
        ],
        [
            "Date From",
            filters.get("date_from") or "All",
        ],
        [
            "Date To",
            filters.get("date_to") or "All",
        ],
    ]

    filter_table = Table(
        filter_data,
        colWidths=[
            45 * mm,
            90 * mm,
        ],
    )

    filter_table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.HexColor(
                        "#2563EB"
                    ),
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
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.grey,
                ),
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "MIDDLE",
                ),
                (
                    "PADDING",
                    (0, 0),
                    (-1, -1),
                    5,
                ),
            ]
        )
    )

    story.append(filter_table)

    story.append(
        Spacer(1, 12)
    )

    # ==================================================
    # SUMMARY
    # ==================================================

    total = queryset.count()

    completed = queryset.filter(
        status="Completed"
    ).count()

    in_progress = queryset.filter(
        status="In Progress"
    ).count()

    planned = queryset.filter(
        status="Planned"
    ).count()

    cancelled = queryset.filter(
        status="Cancelled"
    ).count()

    summary_data = [
        [
            "Total",
            "Completed",
            "In Progress",
            "Planned",
            "Cancelled",
        ],
        [
            str(total),
            str(completed),
            str(in_progress),
            str(planned),
            str(cancelled),
        ],
    ]

    summary_table = Table(
        summary_data,
        colWidths=[
            42 * mm,
            42 * mm,
            42 * mm,
            42 * mm,
            42 * mm,
        ],
    )

    summary_table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.HexColor(
                        "#1E293B"
                    ),
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
                    "FONTSIZE",
                    (0, 0),
                    (-1, -1),
                    9,
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
                    "PADDING",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
            ]
        )
    )

    story.append(
        Paragraph(
            "Executive Summary",
            section_style,
        )
    )

    story.append(summary_table)

    story.append(
        Spacer(1, 15)
    )

    # ==================================================
    # CHART 1 - INTERVENTION TYPE
    # ==================================================

    type_counts = {}

    for item in queryset:
        key = (
            item.intervention_type
            or "Unknown"
        )

        type_counts[key] = (
            type_counts.get(key, 0) + 1
        )

    type_labels = list(
        type_counts.keys()
    )

    type_values = list(
        type_counts.values()
    )

    type_chart = create_chart(
        type_labels,
        type_values,
        "Interventions by Type",
    )

    story.append(
        Paragraph(
            "Interventions by Type",
            section_style,
        )
    )

    story.append(
        Image(
            type_chart,
            width=250 * mm,
            height=110 * mm,
        )
    )

    story.append(PageBreak())

    # ==================================================
    # CHART 2 - STATUS
    # ==================================================

    status_counts = {
        "Completed": completed,
        "In Progress": in_progress,
        "Planned": planned,
        "Cancelled": cancelled,
    }

    status_labels = list(
        status_counts.keys()
    )

    status_values = list(
        status_counts.values()
    )

    status_chart = create_chart(
        status_labels,
        status_values,
        "Intervention Status",
    )

    story.append(
        Paragraph(
            "Intervention Status",
            section_style,
        )
    )

    story.append(
        Image(
            status_chart,
            width=250 * mm,
            height=110 * mm,
        )
    )

    story.append(
        Spacer(1, 10)
    )

    # ==================================================
    # CHART 3 - OVER TIME
    # ==================================================

    date_counts = {}

    for item in queryset:
        date_key = item.start_date

        if date_key:
            date_key = date_key.strftime(
                "%Y-%m-%d"
            )

            date_counts[date_key] = (
                date_counts.get(
                    date_key,
                    0,
                )
                + 1
            )

    date_labels = sorted(
        date_counts.keys()
    )

    date_values = [
        date_counts[label]
        for label in date_labels
    ]

    time_chart = create_chart(
        date_labels,
        date_values,
        "Interventions Over Time",
        chart_type="line",
    )

    story.append(
        Paragraph(
            "Interventions Over Time",
            section_style,
        )
    )

    story.append(
        Image(
            time_chart,
            width=250 * mm,
            height=110 * mm,
        )
    )

    story.append(PageBreak())

    # ==================================================
    # CHART 4 - WELL PERFORMANCE
    # ==================================================

    well_counts = {}

    for item in queryset:

        if item.well:
            code = item.well.code

            well_counts[code] = (
                well_counts.get(
                    code,
                    0,
                )
                + 1
            )

    sorted_wells = sorted(
        well_counts.items(),
        key=lambda x: x[1],
        reverse=True,
    )

    well_labels = [
        item[0]
        for item in sorted_wells
    ]

    well_values = [
        item[1]
        for item in sorted_wells
    ]

    well_chart = create_chart(
        well_labels,
        well_values,
        "Wells with Most Interventions",
    )

    story.append(
        Paragraph(
            "Well Performance",
            section_style,
        )
    )

    story.append(
        Image(
            well_chart,
            width=250 * mm,
            height=110 * mm,
        )
    )

    story.append(PageBreak())

    # ==================================================
    # INTERVENTION HISTORY
    # ==================================================

    story.append(
        Paragraph(
            "Intervention History",
            section_style,
        )
    )

    history_data = [
        [
            "Well",
            "Field",
            "Type",
            "Title",
            "Company",
            "Start",
            "End",
            "Status",
        ]
    ]

    for intervention in queryset:

        well_code = (
            intervention.well.code
            if intervention.well
            else ""
        )

        field_name = ""

        if (
            intervention.well
            and intervention.well.field
        ):
            field_name = (
                intervention.well.field.name
            )

        company = ""

        if intervention.service_company:
            company = (
                intervention
                .service_company
                .short_name
            )

        start = ""

        if intervention.start_date:
            start = (
                intervention.start_date
                .strftime("%Y-%m-%d")
            )

            if intervention.start_time:
                start += (
                    " "
                    + intervention.start_time.strftime(
                        "%H:%M"
                    )
                )

        end = ""

        if intervention.end_date:
            end = (
                intervention.end_date
                .strftime("%Y-%m-%d")
            )

            if intervention.end_time:
                end += (
                    " "
                    + intervention.end_time.strftime(
                        "%H:%M"
                    )
                )

        history_data.append(
            [
                well_code,
                field_name,
                intervention.intervention_type,
                intervention.title,
                company,
                start,
                end,
                intervention.status,
            ]
        )

    history_table = Table(
        history_data,
        repeatRows=1,
        colWidths=[
            25 * mm,
            32 * mm,
            35 * mm,
            45 * mm,
            30 * mm,
            32 * mm,
            32 * mm,
            28 * mm,
        ],
    )

    history_table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.HexColor(
                        "#2563EB"
                    ),
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
                    "FONTSIZE",
                    (0, 0),
                    (-1, -1),
                    7,
                ),
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.4,
                    colors.grey,
                ),
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "TOP",
                ),
                (
                    "PADDING",
                    (0, 0),
                    (-1, -1),
                    4,
                ),
            ]
        )
    )

    story.append(history_table)

    # ==================================================
    # BUILD PDF
    # ==================================================

    document.build(
        story,
        onFirstPage=add_page_number,
        onLaterPages=add_page_number,
    )

    buffer.seek(0)

    return buffer