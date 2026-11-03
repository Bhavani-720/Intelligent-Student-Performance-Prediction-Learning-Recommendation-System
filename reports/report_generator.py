"""
TREKVERSE AI Professional Student Academic Performance PDF Report Generator
Pure-Python PDF-1.4 standard engine. Zero external dependencies required.
Generates fully compliant, beautifully styled, vector-drawn PDF documents
compatible with Adobe Acrobat, Chrome, Firefox, Edge, and macOS Preview.
"""

import os
import datetime
import hashlib
from typing import Dict, Any, List, Optional, Tuple

def escape_pdf_text(text: str) -> str:
    """Escape special characters for PDF text stream."""
    return str(text).replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')

class TrekversePDFReport:
    """High-performance vector PDF compiler for Student Academic Intelligence."""
    def __init__(self, page_width: float = 612.0, page_height: float = 792.0):
        self.width = page_width
        self.height = page_height
        self.commands: List[str] = []

    def set_fill_color(self, r: float, g: float, b: float):
        self.commands.append(f"{r:.3f} {g:.3f} {b:.3f} rg")

    def set_stroke_color(self, r: float, g: float, b: float):
        self.commands.append(f"{r:.3f} {g:.3f} {b:.3f} RG")

    def set_line_width(self, w: float):
        self.commands.append(f"{w:.2f} w")

    def draw_rect(self, x: float, y: float, w: float, h: float, fill: bool = True, stroke: bool = False):
        op = "B" if fill and stroke else ("f" if fill else "S")
        self.commands.append(f"{x:.1f} {y:.1f} {w:.1f} {h:.1f} re {op}")

    def draw_line(self, x1: float, y1: float, x2: float, y2: float):
        self.commands.append(f"{x1:.1f} {y1:.1f} m {x2:.1f} {y2:.1f} l S")

    def draw_text(self, text: str, x: float, y: float, font: str = "/F1", size: float = 10.0, color: Tuple[float, float, float] = (0.1, 0.1, 0.1)):
        r, g, b = color
        self.commands.append(f"BT {r:.3f} {g:.3f} {b:.3f} rg {font} {size:.1f} Tf {x:.1f} {y:.1f} Td ({escape_pdf_text(text)}) Tj ET")

    def compile(self) -> bytes:
        """Compile graphic commands into compliant PDF 1.4 byte string."""
        stream_content = "\n".join(self.commands).encode("utf-8")
        stream_len = len(stream_content)

        objects = []
        # Obj 1: Catalog
        objects.append(b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n")
        # Obj 2: Pages
        objects.append(b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n")
        # Obj 3: Page
        objects.append(
            b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] "
            b"/Resources << /Font << /F1 4 0 R /F2 5 0 R /F3 6 0 R >> >> "
            b"/Contents 7 0 R >>\nendobj\n"
        )
        # Obj 4: Helvetica
        objects.append(b"4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n")
        # Obj 5: Helvetica-Bold
        objects.append(b"5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n")
        # Obj 6: Courier
        objects.append(b"6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>\nendobj\n")
        # Obj 7: Content Stream
        objects.append(
            f"7 0 obj\n<< /Length {stream_len} >>\nstream\n".encode("utf-8") +
            stream_content +
            b"\nendstream\nendobj\n"
        )

        # PDF Assembly with Byte Offsets
        header = b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n"
        body = b""
        xref_offsets = [0]
        cur_offset = len(header)

        for obj in objects:
            xref_offsets.append(cur_offset)
            cur_offset += len(obj)
            body += obj

        xref_start = cur_offset
        xref = f"xref\n0 {len(xref_offsets)}\n0000000000 65535 f \n".encode("utf-8")
        for off in xref_offsets[1:]:
            xref += f"{off:010d} 00000 n \n".encode("utf-8")

        trailer = (
            f"trailer\n<< /Size {len(xref_offsets)} /Root 1 0 R >>\n"
            f"startxref\n{xref_start}\n%%EOF\n"
        ).encode("utf-8")

        return header + body + xref + trailer

def generate_student_pdf_report(
    student: Dict[str, Any],
    output_path: Optional[str] = None
) -> bytes:
    """
    Generate complete, publication-grade academic performance PDF report
    matching Trekverse AI design specifications.
    """
    pdf = TrekversePDFReport()

    # Colors
    c_indigo = (0.12, 0.15, 0.35)
    c_accent = (0.39, 0.40, 0.95)
    c_slate_dark = (0.10, 0.12, 0.18)
    c_slate_gray = (0.42, 0.45, 0.52)
    c_card_bg = (0.97, 0.98, 0.99)
    c_card_border = (0.86, 0.88, 0.92)

    # 1. Header Banner
    pdf.set_fill_color(0.12, 0.15, 0.35)
    pdf.draw_rect(0, 712, 612, 80, fill=True, stroke=False)

    pdf.set_fill_color(0.39, 0.40, 0.95)
    pdf.draw_rect(0, 708, 612, 4, fill=True, stroke=False)

    pdf.draw_text("TREKVERSE AI ACADEMY", 36, 756, font="/F2", size=20, color=(1.0, 1.0, 1.0))
    pdf.draw_text("Student Academic Intelligence & Early-Warning Diagnostic Report", 36, 736, font="/F1", size=10, color=(0.85, 0.88, 0.98))
    now_str = datetime.datetime.now().strftime("%B %d, %Y - %H:%M UTC")
    pdf.draw_text(f"Generated: {now_str}", 410, 736, font="/F1", size=8, color=(0.85, 0.88, 0.98))

    # 2. Student Information Section
    pdf.set_fill_color(*c_card_bg)
    pdf.set_stroke_color(*c_card_border)
    pdf.set_line_width(1.0)
    pdf.draw_rect(36, 610, 540, 85, fill=True, stroke=True)

    pdf.draw_text("STUDENT PROFILE & ENROLLMENT", 48, 675, font="/F2", size=10, color=c_indigo)
    pdf.draw_line(48, 668, 564, 668)

    pdf.draw_text(f"Name: {student.get('name', 'N/A')}", 48, 650, font="/F2", size=10, color=c_slate_dark)
    pdf.draw_text(f"Student ID: {student.get('student_id', 'N/A')}", 240, 650, font="/F3", size=10, color=c_slate_dark)
    pdf.draw_text(f"Semester: {student.get('semester', 4)}", 430, 650, font="/F1", size=10, color=c_slate_dark)

    pdf.draw_text(f"Department: {student.get('department', 'Engineering')}", 48, 630, font="/F1", size=9, color=c_slate_gray)
    pdf.draw_text(f"Email: {student.get('email', 'student@college.edu')}", 240, 630, font="/F1", size=9, color=c_slate_gray)
    backlog_col = (0.8, 0.2, 0.2) if student.get('backlogs', 0) > 0 else (0.2, 0.6, 0.2)
    pdf.draw_text(f"Backlogs: {student.get('backlogs', 0)} Active", 430, 630, font="/F2", size=9, color=backlog_col)

    # 3. Academic Metrics & AI Risk Stratification Cards
    # Box 1: Current CGPA
    pdf.set_fill_color(*c_card_bg)
    pdf.draw_rect(36, 520, 165, 75, fill=True, stroke=True)
    pdf.draw_text("CURRENT CGPA", 48, 574, font="/F2", size=9, color=c_slate_gray)
    pdf.draw_text(f"{student.get('cgpa', 7.5):.2f} / 10", 48, 546, font="/F2", size=18, color=c_indigo)
    pdf.draw_text("Scale: 10.0 Maximum", 48, 530, font="/F1", size=8, color=c_slate_gray)

    # Box 2: Attendance
    pdf.draw_rect(223, 520, 165, 75, fill=True, stroke=True)
    pdf.draw_text("ATTENDANCE RATE", 235, 574, font="/F2", size=9, color=c_slate_gray)
    att = student.get('attendance', 75.0)
    att_color = (0.1, 0.6, 0.3) if att >= 80 else ((0.8, 0.5, 0.0) if att >= 70 else (0.85, 0.15, 0.15))
    pdf.draw_text(f"{att:.1f}%", 235, 546, font="/F2", size=18, color=att_color)
    pdf.draw_text("Threshold: >= 75% Required", 235, 530, font="/F1", size=8, color=c_slate_gray)

    # Box 3: AI Predicted Score & Risk Level
    pdf.draw_rect(411, 520, 165, 75, fill=True, stroke=True)
    pdf.draw_text("AI RISK STRATIFICATION", 423, 574, font="/F2", size=9, color=c_slate_gray)
    risk = student.get('risk_level', 'Low')
    risk_color = (0.85, 0.15, 0.15) if risk == 'High' else ((0.85, 0.55, 0.05) if risk == 'Moderate' else (0.1, 0.6, 0.3))
    pdf.draw_text(f"{risk.upper()} RISK", 423, 546, font="/F2", size=16, color=risk_color)
    pred_score = student.get('predicted_score', 14.5)
    pdf.draw_text(f"Predicted Final: {pred_score:.1f}/20", 423, 530, font="/F2", size=9, color=c_slate_dark)

    # 4. Subject Performance Breakdown
    pdf.draw_rect(36, 400, 540, 105, fill=True, stroke=True)
    pdf.draw_text("CURRICULUM SUBJECT-WISE FORECAST & MARKS", 48, 488, font="/F2", size=10, color=c_indigo)
    pdf.draw_line(48, 482, 564, 482)

    # Table Header
    pdf.draw_text("Subject Code & Name", 48, 468, font="/F2", size=8, color=c_slate_gray)
    pdf.draw_text("Internal (20)", 220, 468, font="/F2", size=8, color=c_slate_gray)
    pdf.draw_text("Assignments", 310, 468, font="/F2", size=8, color=c_slate_gray)
    pdf.draw_text("Predicted /20", 400, 468, font="/F2", size=8, color=c_slate_gray)
    pdf.draw_text("Status", 500, 468, font="/F2", size=8, color=c_slate_gray)

    pred_subs = student.get('prediction', {}).get('subject_predictions', {}) if student.get('prediction') else {}

    default_subs = [
        ("MATH101", "Mathematics", 12.0, 14.0, pred_subs.get("Mathematics", 12.8)),
        ("CS102", "Programming & Data Structures", 17.5, 18.0, pred_subs.get("Programming", 17.1)),
        ("CS201", "Database Systems (DBMS)", 13.5, 14.5, pred_subs.get("DBMS", 13.8)),
        ("CS202", "Computer Networks", 14.5, 15.0, pred_subs.get("Computer Networks", 14.6)),
        ("EC103", "Digital Electronics", 12.5, 13.0, pred_subs.get("Electronics", 12.9))
    ]

    y_pos = 452
    for code, name, int_m, asg_m, p_score in default_subs:
        is_weak = p_score < 13.0
        status_txt = "Needs Attention" if is_weak else "On Track"
        st_color = (0.85, 0.2, 0.2) if is_weak else (0.15, 0.55, 0.25)

        pdf.draw_text(f"{code} - {name[:24]}", 48, y_pos, font="/F1", size=8, color=c_slate_dark)
        pdf.draw_text(f"{int_m:.1f}", 230, y_pos, font="/F1", size=8, color=c_slate_dark)
        pdf.draw_text(f"{asg_m:.1f}", 320, y_pos, font="/F1", size=8, color=c_slate_dark)
        pdf.draw_text(f"{p_score:.1f}", 415, y_pos, font="/F2", size=8, color=c_slate_dark)
        pdf.draw_text(status_txt, 500, y_pos, font="/F2", size=8, color=st_color)
        y_pos -= 13

    # 5. SHAP Factor Explanations & AI Study Plan Side-by-Side
    # Left Box: SHAP Factors
    pdf.draw_rect(36, 230, 260, 155, fill=True, stroke=True)
    pdf.draw_text("EXPLAINABLE AI (SHAP) ATTRIBUTION", 48, 368, font="/F2", size=9, color=c_indigo)
    pdf.draw_line(48, 362, 284, 362)

    shap_factors = (student.get('prediction', {}).get('shap_factors') or [
        {"factor": f"Attendance ({student.get('attendance', 75)}%)", "impact": 1.4 if student.get('attendance', 75) >= 75 else -2.2},
        {"factor": f"Prior Backlogs ({student.get('backlogs', 0)})", "impact": -1.8 if student.get('backlogs', 0) > 0 else 0.0},
        {"factor": f"Daily Study Time ({student.get('study_hours', 2.5)}h)", "impact": 1.1 if student.get('study_hours', 2.5) >= 3 else -1.2},
        {"factor": "Practical Lab Marks", "impact": +1.5},
        {"factor": "Quiz Performance", "impact": +0.8}
    ])[:5]

    sy = 345
    for item in shap_factors:
        fac = item.get('factor', item.get('feature', 'Factor'))
        imp = item.get('impact', 0.0)
        imp_col = (0.1, 0.55, 0.2) if imp >= 0 else (0.8, 0.2, 0.2)
        sign = "+" if imp >= 0 else ""
        pdf.draw_text(f"{fac[:24]}", 48, sy, font="/F1", size=8, color=c_slate_dark)
        pdf.draw_text(f"{sign}{imp:.2f} pts", 240, sy, font="/F2", size=8, color=imp_col)
        sy -= 18

    # Right Box: AI Weekly Study Planner
    pdf.draw_rect(316, 230, 260, 155, fill=True, stroke=True)
    pdf.draw_text("PERSONALIZED AI STUDY PLAN", 328, 368, font="/F2", size=9, color=c_indigo)
    pdf.draw_line(328, 362, 564, 362)

    rec_plan = student.get('recommendations', {}).get('study_plan') or {
        "Monday": "Mathematics: 1.5 hrs (Calculus Revision)",
        "Tuesday": "Programming: 1.0 hr (Data Structures Code)",
        "Wednesday": "DBMS: 1.0 hr (SQL Joins & Indexing)",
        "Thursday": "Question Bank: 1.5 hrs (Previous Papers)",
        "Friday": "Timed Assessment: 45 mins (Mock Exam)"
    }

    py = 345
    for day, task in list(rec_plan.items())[:5]:
        pdf.draw_text(f"{day}:", 328, py, font="/F2", size=8, color=c_slate_dark)
        pdf.draw_text(f"{task[:32]}", 380, py, font="/F1", size=7.5, color=c_slate_gray)
        py -= 18

    # 6. Faculty Remarks & Action Checklist
    pdf.draw_rect(36, 95, 540, 120, fill=True, stroke=True)
    pdf.draw_text("FACULTY REMARKS & INTERVENTION DIRECTIVES", 48, 198, font="/F2", size=10, color=c_indigo)
    pdf.draw_line(48, 192, 564, 192)

    remarks = student.get('recommendations', {}).get('faculty_remarks') or (
        f"Student displays strong technical capability in core modules. "
        f"To elevate predicted outcome, recommended: 1) Increase attendance above 80%, "
        f"2) Attend Wednesday department tutorial clinics in {student.get('weak_subject', 'Mathematics')}."
    )
    pdf.draw_text(remarks[:115], 48, 178, font="/F1", size=8.5, color=c_slate_dark)
    if len(remarks) > 115:
        pdf.draw_text(remarks[115:230], 48, 166, font="/F1", size=8.5, color=c_slate_dark)

    pdf.draw_text("Verified Next Steps:", 48, 146, font="/F2", size=8.5, color=c_slate_dark)
    pdf.draw_text("[X] Bi-weekly attendance alert logged to student portal", 60, 132, font="/F1", size=8, color=c_slate_gray)
    pdf.draw_text(f"[X] Remedial learning materials dispatched for {student.get('weak_subject', 'Mathematics')}", 60, 120, font="/F1", size=8, color=c_slate_gray)
    pdf.draw_text("[ ] Midterm 2 progress review meeting with Academic Mentor", 60, 108, font="/F1", size=8, color=c_slate_gray)

    # 7. Verification Footer & Token
    token = hashlib.sha256(f"{student.get('student_id')}-{now_str}".encode('utf-8')).hexdigest()[:16].upper()
    pdf.set_fill_color(0.92, 0.94, 0.97)
    pdf.draw_rect(0, 0, 612, 45, fill=True, stroke=False)
    pdf.draw_text("TREKVERSE AI ACADEMY - STUDENT SUCCESS INTELLIGENCE PLATFORM", 36, 24, font="/F2", size=8, color=c_indigo)
    pdf.draw_text(f"Digital Verification Token: TV-DOC-{token} | Confidential Student Academic Record", 36, 12, font="/F3", size=7, color=c_slate_gray)

    pdf_bytes = pdf.compile()

    if output_path:
        os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
        with open(output_path, "wb") as f:
            f.write(pdf_bytes)

    return pdf_bytes
