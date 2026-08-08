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
from reportlab.platypus import Image, PageBreak, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


def _chart(labels, values, title, series=None):
    buffer = BytesIO()
    figure, axis = plt.subplots(figsize=(9, 4.5))
    if series:
        for name, data, color in series:
            axis.plot(labels, data, marker="o", linewidth=2, label=name, color=color)
        axis.legend()
        axis.set_ylabel("Production")
    elif labels:
        axis.bar(labels, values, color="#2563eb")
        axis.set_ylabel("Count")
    else:
        axis.text(0.5, 0.5, "No data available", ha="center", va="center", fontsize=12)
        axis.set_axis_off()
    if labels:
        axis.tick_params(axis="x", labelrotation=45)
        for label in axis.get_xticklabels():
            label.set_horizontalalignment("right")
        axis.grid(axis="y", linestyle="--", alpha=0.3)
    axis.set_title(title, fontsize=14, fontweight="bold")
    figure.tight_layout()
    figure.savefig(buffer, format="png", dpi=180, bbox_inches="tight")
    plt.close(figure)
    buffer.seek(0)
    return buffer


def generate_field_pdf(report_data):
    buffer = BytesIO()
    document = SimpleDocTemplate(
        buffer, pagesize=landscape(A4), rightMargin=12 * mm,
        leftMargin=12 * mm, topMargin=12 * mm, bottomMargin=12 * mm,
    )
    styles = getSampleStyleSheet()
    title = ParagraphStyle("FieldTitle", parent=styles["Title"], alignment=TA_CENTER, fontSize=22, spaceAfter=8)
    section = ParagraphStyle("FieldSection", parent=styles["Heading2"], fontSize=14, spaceBefore=8, spaceAfter=8)
    normal = ParagraphStyle("FieldNormal", parent=styles["Normal"], fontSize=9, leading=12)
    story = [
        Paragraph("FIELD REPORT", title),
        Paragraph(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}", normal),
        Spacer(1, 8),
    ]

    filters = report_data.get("filters", {})
    filter_data = [["Filter", "Value"]] + [
        [label, filters.get(key) or "All"]
        for key, label in [
            ("operator", "Operator"), ("status", "Status"),
            ("location", "Location"), ("date_from", "Date From"),
            ("date_to", "Date To"),
        ]
    ]
    filter_table = Table(filter_data, colWidths=[50 * mm, 140 * mm])
    filter_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2563EB")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.grey),
        ("PADDING", (0, 0), (-1, -1), 5),
    ]))
    story += [Paragraph("Applied Filters", section), filter_table, Spacer(1, 10)]

    summary = report_data.get("summary", {})
    summary_data = [["Total Fields", "Active Fields", "Total Wells", "Producing Wells", "Total Operators"], [
        summary.get("total_fields", 0), summary.get("active_fields", 0),
        summary.get("total_wells", 0), summary.get("producing_wells", 0),
        summary.get("total_operators", 0),
    ]]
    summary_table = Table(summary_data, colWidths=[40 * mm] * 5)
    summary_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1F2937")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.grey),
        ("PADDING", (0, 0), (-1, -1), 6),
    ]))
    story += [Paragraph("Executive Summary", section), summary_table, PageBreak()]

    distributions = [
        ("Fields by Status", report_data.get("status_distribution", []), "status"),
        ("Fields by Operator", report_data.get("operator_distribution", []), "operator"),
        ("Wells by Field", report_data.get("well_distribution", []), "field"),
        ("Well Type Distribution", report_data.get("well_type_distribution", []), "well_type"),
    ]
    for title_text, rows, key in distributions:
        story += [
            Paragraph(title_text, section),
            Image(_chart([row.get(key, "Unknown") for row in rows], [row.get("count", 0) for row in rows], title_text), width=250 * mm, height=105 * mm),
        ]

    production = report_data.get("production_by_field", [])
    if production:
        labels = [item.get("field", "") for item in production]
        story += [PageBreak(), Paragraph("Production by Field", section), Image(_chart(
            labels, [], "Production by Field", series=[
                ("Oil", [item.get("oil", 0) for item in production], "#16a34a"),
                ("Gas", [item.get("gas", 0) for item in production], "#2563eb"),
                ("Water", [item.get("water", 0) for item in production], "#0891b2"),
            ]
        ), width=250 * mm, height=110 * mm)]

    story += [PageBreak(), Paragraph("Field Inventory", section)]
    history = report_data.get("history", [])
    table_data = [["Field", "Code", "Operator", "Country", "State", "City", "Status", "Wells", "Producing", "Shut In", "Drilling"]]
    for item in history:
        table_data.append([
            item.get("name", ""), item.get("code", ""), item.get("operator", ""),
            item.get("country", ""), item.get("state", ""), item.get("city", ""),
            item.get("status", ""), item.get("well_count", 0),
            item.get("producing_wells", 0), item.get("shut_in_wells", 0),
            item.get("drilling_wells", 0),
        ])
    inventory = Table(table_data, repeatRows=1, colWidths=[35 * mm, 20 * mm, 30 * mm, 22 * mm, 22 * mm, 22 * mm, 22 * mm, 15 * mm, 20 * mm, 18 * mm, 18 * mm])
    inventory.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2563EB")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 7),
        ("GRID", (0, 0), (-1, -1), 0.3, colors.grey),
        ("PADDING", (0, 0), (-1, -1), 3),
    ]))
    story.append(inventory)
    document.build(story)
    buffer.seek(0)
    return buffer
