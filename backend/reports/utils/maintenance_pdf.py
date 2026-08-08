from datetime import datetime
from io import BytesIO

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


def _bar_chart(labels, values, title):
    buffer = BytesIO()
    figure, axis = plt.subplots(figsize=(9, 4.5))

    if labels:
        axis.bar(labels, values, color="#2563eb")
        axis.set_ylabel("Count")
        axis.tick_params(axis="x", labelrotation=45)
        for label in axis.get_xticklabels():
            label.set_horizontalalignment("right")
        axis.grid(axis="y", linestyle="--", alpha=0.3)
    else:
        axis.text(
            0.5,
            0.5,
            "No data available",
            ha="center",
            va="center",
            fontsize=12,
        )
        axis.set_axis_off()

    axis.set_title(title, fontsize=14, fontweight="bold")
    figure.tight_layout()
    figure.savefig(buffer, format="png", dpi=180, bbox_inches="tight")
    plt.close(figure)
    buffer.seek(0)
    return buffer


def _comparison_chart(timeline, title):
    buffer = BytesIO()
    figure, axis = plt.subplots(figsize=(9, 4.5))
    labels = [item.get("date", "") for item in timeline]
    completed = [item.get("completed", 0) for item in timeline]
    pending = [item.get("pending", 0) for item in timeline]

    if labels:
        axis.plot(labels, completed, marker="o", label="Completed", color="#16a34a")
        axis.plot(labels, pending, marker="o", label="Pending", color="#2563eb")
        axis.set_ylabel("Count")
        axis.tick_params(axis="x", labelrotation=45)
        for label in axis.get_xticklabels():
            label.set_horizontalalignment("right")
        axis.legend()
        axis.grid(axis="y", linestyle="--", alpha=0.3)
    else:
        axis.text(
            0.5,
            0.5,
            "No data available",
            ha="center",
            va="center",
            fontsize=12,
        )
        axis.set_axis_off()

    axis.set_title(title, fontsize=14, fontweight="bold")
    figure.tight_layout()
    figure.savefig(buffer, format="png", dpi=180, bbox_inches="tight")
    plt.close(figure)
    buffer.seek(0)
    return buffer


def generate_maintenance_pdf(report_data):
    buffer = BytesIO()
    document = SimpleDocTemplate(
        buffer,
        pagesize=landscape(A4),
        rightMargin=12 * mm,
        leftMargin=12 * mm,
        topMargin=12 * mm,
        bottomMargin=12 * mm,
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "MaintenanceReportTitle",
        parent=styles["Title"],
        alignment=TA_CENTER,
        fontSize=22,
        leading=26,
        spaceAfter=8,
    )
    section_style = ParagraphStyle(
        "MaintenanceReportSection",
        parent=styles["Heading2"],
        fontSize=14,
        leading=18,
        spaceBefore=8,
        spaceAfter=8,
    )
    normal_style = ParagraphStyle(
        "MaintenanceReportNormal",
        parent=styles["Normal"],
        fontSize=9,
        leading=12,
    )

    story = [
        Paragraph("MAINTENANCE REPORT", title_style),
        Paragraph(
            f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}",
            normal_style,
        ),
        Spacer(1, 8),
    ]

    filters = report_data.get("filters", {})
    filter_data = [
        ["Filter", "Value"],
        ["Field", filters.get("field") or "All"],
        ["Well", filters.get("well") or "All"],
        ["Maintenance Type", filters.get("maintenance_type") or "All"],
        ["Status", filters.get("status") or "All"],
        ["Date From", filters.get("date_from") or "All"],
        ["Date To", filters.get("date_to") or "All"],
    ]
    filter_table = Table(filter_data, colWidths=[50 * mm, 140 * mm])
    filter_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2563EB")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
        ("PADDING", (0, 0), (-1, -1), 5),
    ]))
    story.extend([
        Paragraph("Applied Filters", section_style),
        filter_table,
        Spacer(1, 10),
    ])

    summary = report_data.get("summary", {})
    summary_data = [
        ["Total Maintenance", "Completed", "In Progress", "Planned", "Cancelled"],
        [
            summary.get("total_maintenance", 0),
            summary.get("completed", 0),
            summary.get("in_progress", 0),
            summary.get("planned", 0),
            summary.get("cancelled", 0),
        ],
    ]
    summary_table = Table(summary_data, colWidths=[42 * mm] * 5)
    summary_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1F2937")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.grey),
        ("PADDING", (0, 0), (-1, -1), 6),
    ]))
    story.extend([
        Paragraph("Executive Summary", section_style),
        summary_table,
        PageBreak(),
    ])

    distributions = [
        ("Maintenance by Type", report_data.get("type_distribution", []), "type"),
        ("Maintenance by Status", report_data.get("status_distribution", []), "status"),
        ("Maintenance by Well", report_data.get("well_distribution", []), "well"),
        ("Maintenance by Field", report_data.get("field_distribution", []), "field"),
    ]
    for title, data, label_key in distributions:
        labels = [item.get(label_key, "Unknown") for item in data]
        values = [item.get("count", 0) for item in data]
        story.extend([
            Paragraph(title, section_style),
            Image(_bar_chart(labels, values, title), width=250 * mm, height=105 * mm),
        ])

    story.extend([
        PageBreak(),
        Paragraph("Maintenance Trends", section_style),
    ])
    timeline = report_data.get("timeline", [])
    story.append(Image(
        _bar_chart(
            [item.get("date", "") for item in timeline],
            [item.get("count", 0) for item in timeline],
            "Maintenance Over Time",
        ),
        width=250 * mm,
        height=105 * mm,
    ))

    completed_vs_pending = report_data.get("completed_vs_pending", [])
    if completed_vs_pending:
        story.extend([
            Paragraph("Completed vs Pending", section_style),
            Image(
                _comparison_chart(completed_vs_pending, "Completed vs Pending"),
                width=250 * mm,
                height=105 * mm,
            ),
        ])

    story.extend([
        PageBreak(),
        Paragraph("Maintenance History", section_style),
    ])
    history_data = [[
        "Well",
        "Field",
        "Type",
        "Title",
        "Service Company",
        "Assigned To",
        "Start",
        "End",
        "Status",
        "Estimated Cost",
        "Actual Cost",
    ]]
    for item in report_data.get("history", []):
        history_data.append([
            item.get("well", ""),
            item.get("field", ""),
            item.get("maintenance_type", ""),
            item.get("title", ""),
            item.get("service_company", ""),
            item.get("assigned_to", ""),
            item.get("start_date", ""),
            item.get("end_date", ""),
            item.get("status", ""),
            item.get("estimated_cost", ""),
            item.get("actual_cost", ""),
        ])

    history_table = Table(
        history_data,
        repeatRows=1,
        colWidths=[
            25 * mm,
            30 * mm,
            25 * mm,
            40 * mm,
            30 * mm,
            30 * mm,
            25 * mm,
            25 * mm,
            25 * mm,
            25 * mm,
            25 * mm,
        ],
    )
    history_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2563EB")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 7),
        ("GRID", (0, 0), (-1, -1), 0.3, colors.grey),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("PADDING", (0, 0), (-1, -1), 3),
    ]))
    story.append(history_table)

    document.build(story)
    buffer.seek(0)
    return buffer
