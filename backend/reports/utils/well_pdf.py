from io import BytesIO
from datetime import datetime

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    Image,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


def create_chart(labels, values, title, chart_type="bar"):
    buffer = BytesIO()

    fig, ax = plt.subplots(figsize=(9, 4.5))

    if not labels:
        ax.text(
            0.5,
            0.5,
            "No data available",
            ha="center",
            va="center",
            fontsize=12,
        )
        ax.set_axis_off()
    elif chart_type == "line":
        ax.plot(labels, values, marker="o", linewidth=2, color="#2563eb")
        ax.set_xlabel("Month")
        ax.set_ylabel("Count")
        plt.xticks(rotation=45, ha="right")
    elif chart_type == "scatter":
        ax.scatter(labels[0], labels[1], color="#2563eb", edgecolor="#1d4ed8")
        ax.set_xlabel("Longitude")
        ax.set_ylabel("Latitude")
        ax.grid(True, linestyle="--", alpha=0.3)
    else:
        ax.bar(labels, values, color="#2563eb")
        ax.set_ylabel("Count")
        plt.xticks(rotation=45, ha="right")

    ax.set_title(title, fontsize=14, fontweight="bold")
    ax.grid(axis="y", linestyle="--", alpha=0.3)
    fig.tight_layout()
    fig.savefig(buffer, format="png", dpi=180, bbox_inches="tight")
    plt.close(fig)
    buffer.seek(0)

    return buffer


def create_timeline_chart(timeline):
    buffer = BytesIO()

    fig, ax = plt.subplots(figsize=(9, 4.5))

    labels = [item.get("month") for item in timeline]
    spud = [item.get("spud", 0) for item in timeline]
    completed = [item.get("completed", 0) for item in timeline]
    first_production = [item.get("first_production", 0) for item in timeline]

    if not labels:
        ax.text(
            0.5,
            0.5,
            "No timeline data available",
            ha="center",
            va="center",
            fontsize=12,
        )
        ax.set_axis_off()
    else:
        ax.plot(labels, spud, marker="o", label="Spud Wells")
        ax.plot(labels, completed, marker="o", label="Completed Wells")
        ax.plot(labels, first_production, marker="o", label="First Production")
        ax.set_xlabel("Month")
        ax.set_ylabel("Wells")
        plt.xticks(rotation=45, ha="right")
        ax.legend()

    ax.set_title("Well Timeline", fontsize=14, fontweight="bold")
    ax.grid(axis="y", linestyle="--", alpha=0.3)
    fig.tight_layout()
    fig.savefig(buffer, format="png", dpi=180, bbox_inches="tight")
    plt.close(fig)
    buffer.seek(0)

    return buffer


def generate_well_pdf(report_data):
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
        fontSize=22,
        leading=28,
        spaceAfter=8,
    )

    subtitle_style = ParagraphStyle(
        "ReportSubtitle",
        parent=styles["Normal"],
        alignment=TA_CENTER,
        fontSize=10,
        textColor=colors.grey,
        spaceAfter=12,
    )

    section_style = ParagraphStyle(
        "Section",
        parent=styles["Heading2"],
        fontSize=13,
        leading=16,
        spaceBefore=10,
        spaceAfter=10,
    )

    normal_style = ParagraphStyle(
        "NormalReport",
        parent=styles["Normal"],
        fontSize=9,
        leading=12,
    )

    story = []

    story.append(Paragraph("WELL REPORT", title_style))
    story.append(
        Paragraph(
            f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}",
            normal_style,
        )
    )
    story.append(Spacer(1, 8))

    filters = report_data.get("filters", {})
    story.append(Paragraph("Applied Filters", section_style))

    filter_data = [
        ["Filter", "Value"],
        ["Field", filters.get("field") or "All"],
        ["Operator", filters.get("operator") or "All"],
        ["Well Type", filters.get("well_type") or "All"],
        ["Status", filters.get("status") or "All"],
        ["Artificial Lift", filters.get("artificial_lift") or "All"],
        ["Active", filters.get("is_active") or "All"],
    ]

    filter_table = Table(filter_data, colWidths=[60 * mm, 120 * mm])
    filter_table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2563EB")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("PADDING", (0, 0), (-1, -1), 4),
        ])
    )

    story.append(filter_table)
    story.append(Spacer(1, 12))

    story.append(Paragraph("Executive Summary", section_style))
    summary = report_data.get("summary", {})
    summary_data = [
        [
            "Total Wells",
            "Active Wells",
            "Producing Wells",
            "Drilling Wells",
            "Shut In Wells",
            "Abandoned Wells",
        ],
        [
            str(summary.get("total_wells", 0)),
            str(summary.get("active_wells", 0)),
            str(summary.get("producing_wells", 0)),
            str(summary.get("drilling_wells", 0)),
            str(summary.get("shut_in_wells", 0)),
            str(summary.get("abandoned_wells", 0)),
        ],
    ]

    summary_table = Table(summary_data, colWidths=[35 * mm] * 6)
    summary_table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1F2937")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 8),
            ("ALIGN", (0, 0), (-1, -1), "CENTER"),
            ("GRID", (0, 0), (-1, -1), 0.4, colors.grey),
            ("PADDING", (0, 0), (-1, -1), 5),
        ])
    )

    story.append(summary_table)
    story.append(PageBreak())

    story.append(Paragraph("Well Distribution", section_style))
    distribution_sections = [
        ("Well Type Distribution", report_data.get("well_type_distribution", [])),
        ("Well Status Distribution", report_data.get("status_distribution", [])),
        ("Wells by Field", report_data.get("field_distribution", [])),
        ("Wells by Operator", report_data.get("operator_distribution", [])),
    ]

    for title, distribution in distribution_sections:
        labels = [item.get(list(item.keys())[0]) for item in distribution]
        values = [item.get(list(item.keys())[1], 0) for item in distribution]
        chart = create_chart(labels, values, title)
        story.append(Paragraph(title, normal_style))
        story.append(Image(chart, width=250 * mm, height=100 * mm))
        story.append(Spacer(1, 10))

    story.append(PageBreak())

    story.append(Paragraph("Technical Overview", section_style))
    averages = [
        ["Average Total Depth", summary.get("average_total_depth", 0)],
        ["Average True Vertical Depth", summary.get("average_true_vertical_depth", 0)],
    ]
    average_table = Table(averages, colWidths=[80 * mm, 80 * mm])
    average_table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.whitesmoke),
            ("GRID", (0, 0), (-1, -1), 0.4, colors.grey),
            ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
            ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("ALIGN", (1, 0), (-1, -1), "RIGHT"),
        ])
    )
    story.append(average_table)
    story.append(Spacer(1, 12))

    technical_sections = [
        ("Artificial Lift Distribution", report_data.get("artificial_lift_distribution", [])),
        ("Reservoir Distribution", report_data.get("reservoir_distribution", [])),
        ("Formation Distribution", report_data.get("formation_distribution", [])),
    ]

    for title, distribution in technical_sections:
        labels = [item.get(list(item.keys())[0]) for item in distribution]
        values = [item.get(list(item.keys())[1], 0) for item in distribution]
        chart = create_chart(labels, values, title)
        story.append(Paragraph(title, normal_style))
        story.append(Image(chart, width=250 * mm, height=100 * mm))
        story.append(Spacer(1, 10))

    story.append(PageBreak())

    story.append(Paragraph("Well Timeline", section_style))
    timeline_chart = create_timeline_chart(report_data.get("timeline", []))
    story.append(Image(timeline_chart, width=250 * mm, height=120 * mm))
    story.append(PageBreak())

    story.append(Paragraph("Well Location", section_style))
    locations = report_data.get("locations", [])
    if locations:
        longitudes = [item.get("longitude") for item in locations]
        latitudes = [item.get("latitude") for item in locations]
        scatter_chart = create_chart([longitudes, latitudes], [], "Well Location Scatter", chart_type="scatter")
        story.append(Image(scatter_chart, width=250 * mm, height=120 * mm))
        story.append(Spacer(1, 10))
    else:
        story.append(Paragraph("No well location data available.", normal_style))

    story.append(PageBreak())

    story.append(Paragraph("Well Inventory Table", section_style))
    history = report_data.get("history", [])
    history_data = [
        [
            "Code",
            "Name",
            "Field",
            "Operator",
            "Well Type",
            "Status",
            "Spud Date",
            "Completion Date",
            "First Production",
            "Total Depth",
            "True Vertical Depth",
            "Tubing Size",
            "Casing Size",
            "Artificial Lift",
            "Reservoir",
            "Formation",
            "Latitude",
            "Longitude",
            "Active",
        ]
    ]

    for item in history:
        history_data.append([
            item.get("code", ""),
            item.get("name", ""),
            item.get("field", ""),
            item.get("operator", ""),
            item.get("well_type", ""),
            item.get("status", ""),
            item.get("spud_date", ""),
            item.get("completion_date", ""),
            item.get("first_production_date", ""),
            item.get("total_depth", ""),
            item.get("true_vertical_depth", ""),
            item.get("tubing_size", ""),
            item.get("casing_size", ""),
            item.get("artificial_lift", ""),
            item.get("reservoir", ""),
            item.get("formation", ""),
            item.get("latitude", ""),
            item.get("longitude", ""),
            "Yes" if item.get("is_active") else "No",
        ])

    history_table = Table(history_data, repeatRows=1, colWidths=[
        20 * mm,
        30 * mm,
        25 * mm,
        25 * mm,
        20 * mm,
        20 * mm,
        18 * mm,
        18 * mm,
        18 * mm,
        18 * mm,
        20 * mm,
        20 * mm,
        18 * mm,
        22 * mm,
        22 * mm,
        22 * mm,
        18 * mm,
        18 * mm,
        15 * mm,
    ])

    history_table.setStyle(
        TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2563EB")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTSIZE", (0, 0), (-1, -1), 7),
            ("GRID", (0, 0), (-1, -1), 0.2, colors.grey),
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("ALIGN", (0, 0), (-1, 0), "CENTER"),
            ("PADDING", (0, 0), (-1, -1), 3),
        ])
    )

    story.append(history_table)

    document.build(story)
    buffer.seek(0)

    return buffer
