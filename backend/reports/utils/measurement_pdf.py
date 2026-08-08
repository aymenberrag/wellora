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


def _chart(data, title, series, ylabel):
    buffer = BytesIO()
    figure, axis = plt.subplots(figsize=(9, 4.5))
    labels = [item.get("date", "") for item in data]
    if labels and series:
        for key, name, color in series:
            axis.plot(labels, [item.get(key) if item.get(key) is not None else float("nan") for item in data], marker="o", linewidth=2, label=name, color=color)
        axis.legend()
        axis.set_ylabel(ylabel)
        axis.tick_params(axis="x", labelrotation=45)
        for label in axis.get_xticklabels():
            label.set_horizontalalignment("right")
        axis.grid(axis="y", linestyle="--", alpha=0.3)
    else:
        axis.text(0.5, 0.5, "No data available", ha="center", va="center", fontsize=12)
        axis.set_axis_off()
    axis.set_title(title, fontsize=14, fontweight="bold")
    figure.tight_layout()
    figure.savefig(buffer, format="png", dpi=180, bbox_inches="tight")
    plt.close(figure)
    buffer.seek(0)
    return buffer


def _distribution_chart(data, key, title):
    buffer = BytesIO()
    figure, axis = plt.subplots(figsize=(9, 4.5))
    labels = [item.get(key, "Unknown") for item in data]
    values = [item.get("count", 0) for item in data]
    if labels:
        axis.bar(labels, values, color="#2563eb")
        axis.set_ylabel("Count")
        axis.tick_params(axis="x", labelrotation=45)
        for label in axis.get_xticklabels():
            label.set_horizontalalignment("right")
        axis.grid(axis="y", linestyle="--", alpha=0.3)
    else:
        axis.text(0.5, 0.5, "No data available", ha="center", va="center", fontsize=12)
        axis.set_axis_off()
    axis.set_title(title, fontsize=14, fontweight="bold")
    figure.tight_layout()
    figure.savefig(buffer, format="png", dpi=180, bbox_inches="tight")
    plt.close(figure)
    buffer.seek(0)
    return buffer


def generate_measurement_pdf(report_data):
    buffer = BytesIO()
    document = SimpleDocTemplate(buffer, pagesize=landscape(A4), rightMargin=12 * mm, leftMargin=12 * mm, topMargin=12 * mm, bottomMargin=12 * mm)
    styles = getSampleStyleSheet()
    title = ParagraphStyle("MeasurementTitle", parent=styles["Title"], alignment=TA_CENTER, fontSize=22, spaceAfter=8)
    section = ParagraphStyle("MeasurementSection", parent=styles["Heading2"], fontSize=14, spaceBefore=8, spaceAfter=8)
    normal = ParagraphStyle("MeasurementNormal", parent=styles["Normal"], fontSize=9, leading=12)
    story = [Paragraph("MEASUREMENT REPORT", title), Paragraph(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M')}", normal), Spacer(1, 8)]

    filters = report_data.get("filters", {})
    filter_data = [["Filter", "Value"]] + [[label, filters.get(key) or "All"] for key, label in [
        ("field", "Field"), ("well", "Well"), ("date_from", "Date From"),
        ("date_to", "Date To"), ("shift", "Shift"), ("operating_status", "Operating Status"),
    ]]
    filter_table = Table(filter_data, colWidths=[55 * mm, 135 * mm])
    filter_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2563EB")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.grey),
        ("PADDING", (0, 0), (-1, -1), 5),
    ]))
    story += [Paragraph("Applied Filters", section), filter_table, Spacer(1, 10)]

    summary = report_data.get("summary", {})
    summary_data = [["Total Measurements", "Avg WHP", "Avg Casing", "Avg Temperature", "Avg Choke", "Avg ESP", "Avg Motor Current"], [
        summary.get("total_measurements", 0), summary.get("average_wellhead_pressure", 0), summary.get("average_casing_pressure", 0), summary.get("average_temperature", 0), summary.get("average_choke_size", 0), summary.get("average_esp_frequency", 0), summary.get("average_motor_current", 0),
    ]]
    summary_table = Table(summary_data, colWidths=[29 * mm] * 7)
    summary_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1F2937")), ("TEXTCOLOR", (0, 0), (-1, 0), colors.white), ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"), ("ALIGN", (0, 0), (-1, -1), "CENTER"), ("FONTSIZE", (0, 0), (-1, -1), 7), ("GRID", (0, 0), (-1, -1), 0.4, colors.grey), ("PADDING", (0, 0), (-1, -1), 5),
    ]))
    story += [Paragraph("Executive Summary", section), summary_table, PageBreak()]

    chart_specs = [
        ("Pressure Analysis", report_data.get("pressure_history", []), [("wellhead_pressure", "Wellhead Pressure", "#2563eb"), ("casing_pressure", "Casing Pressure", "#dc2626")], "psi"),
        ("Temperature Analysis", report_data.get("temperature_history", []), [("wellhead_temperature", "Wellhead Temperature", "#f97316"), ("flowline_temperature", "Flowline Temperature", "#eab308")], "°C"),
        ("Choke Analysis", report_data.get("choke_history", []), [("choke_size", "Choke Size", "#7c3aed")], "1/64 in"),
        ("Artificial Lift Performance", report_data.get("esp_history", []), [("esp_frequency", "ESP Frequency", "#16a34a"), ("motor_current", "Motor Current", "#0891b2")], "Value"),
    ]
    for title_text, data, series, ylabel in chart_specs:
        story += [Paragraph(title_text, section), Image(_chart(data, title_text, series, ylabel), width=250 * mm, height=105 * mm)]
        if title_text == "Artificial Lift Performance":
            story.append(PageBreak())

    story += [Paragraph("Operating Status", section), Image(_distribution_chart(report_data.get("status_distribution", []), "status", "Operating Status Distribution"), width=250 * mm, height=105 * mm), Paragraph("Shift Analysis", section), Image(_distribution_chart(report_data.get("shift_distribution", []), "shift", "Measurements by Shift"), width=250 * mm, height=105 * mm), PageBreak(), Paragraph("Measurement History", section)]

    history = report_data.get("history", [])
    table_data = [["Date", "Well", "Field", "Shift", "Status", "WHP", "Casing", "Temp", "Choke", "ESP", "Motor", "Recorded By"]]
    for item in history:
        table_data.append([item.get("date", ""), item.get("well", ""), item.get("field", ""), item.get("shift", ""), item.get("operating_status", ""), item.get("wellhead_pressure", ""), item.get("casing_pressure", ""), item.get("wellhead_temperature", ""), item.get("choke_size", ""), item.get("esp_frequency", ""), item.get("motor_current", ""), item.get("recorded_by", "")])
    table = Table(table_data, repeatRows=1, colWidths=[20 * mm, 22 * mm, 28 * mm, 16 * mm, 24 * mm, 18 * mm, 18 * mm, 18 * mm, 16 * mm, 16 * mm, 16 * mm, 28 * mm])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2563EB")), ("TEXTCOLOR", (0, 0), (-1, 0), colors.white), ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"), ("FONTSIZE", (0, 0), (-1, -1), 7), ("GRID", (0, 0), (-1, -1), 0.3, colors.grey), ("PADDING", (0, 0), (-1, -1), 3),
    ]))
    story.append(table)
    document.build(story)
    buffer.seek(0)
    return buffer
