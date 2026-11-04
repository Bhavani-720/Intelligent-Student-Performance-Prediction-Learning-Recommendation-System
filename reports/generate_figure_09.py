"""
TREKVERSE AI — Figure 09 Generator (Academic Grade Trajectories)
Visualizes empirical academic trajectory progression across exam milestones:
Midterm 1 -> Midterm 2 -> Final Exam, stratified by student support cohorts.
"""

import os
os.environ["MPLCONFIGDIR"] = os.environ.get("TEMP", ".")
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

DARK_BG = "#0f172a"
INDIGO_ACCENT = "#4f46e5"
CYAN_ACCENT = "#06b6d4"
EMERALD_GREEN = "#10b981"
AMBER_WARNING = "#f59e0b"
ROSE_DANGER = "#f43f5e"
BORDER_COLOR = "#e2e8f0"

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "figures")
os.makedirs(OUTPUT_DIR, exist_ok=True)
DATA_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "processed", "student_performance_cleaned.csv"))

def generate_grade_trajectory_chart():
    """Generates publication-quality Academic Grade Trajectory Visualization."""
    if not os.path.exists(DATA_PATH):
        print(f"Dataset not found at {DATA_PATH}")
        return

    df = pd.read_csv(DATA_PATH)
    exam_cols = ["midterm1Score", "midterm2Score", "finalExamScore"]
    milestones = ["Midterm 1 (M1)", "Midterm 2 (M2)", "Final Exam (Final)"]
    x_coords = [0, 1, 2]

    cohort_colors = {
        "Low Support": EMERALD_GREEN,
        "Medium Support": AMBER_WARNING,
        "High Support": ROSE_DANGER
    }

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6.5), dpi=300)
    fig.patch.set_facecolor("#ffffff")
    ax1.set_facecolor("#ffffff")
    ax2.set_facecolor("#ffffff")

    # Panel 1: Longitudinal Milestone Trajectories with Cohort Envelopes
    for cohort, color in cohort_colors.items():
        subset = df[df["support_group"] == cohort]
        # Plot individual faint trajectories (sample 35 for clarity)
        sample_subset = subset.sample(n=min(35, len(subset)), random_state=42)
        for _, row in sample_subset.iterrows():
            ax1.plot(x_coords, [row[c] for c in exam_cols], color=color, alpha=0.12, lw=1.0, zorder=2)

        # Compute cohort mean & standard deviation
        means = [subset[c].mean() for c in exam_cols]
        stds = [subset[c].std() for c in exam_cols]

        ax1.plot(x_coords, means, color=color, lw=3.2, marker="o", markersize=8,
                 label=f"{cohort} (N={len(subset)}, Mean Final={means[-1]:.1f})", zorder=4)
        ax1.fill_between(x_coords,
                         [m - s * 0.5 for m, s in zip(means, stds)],
                         [m + s * 0.5 for m, s in zip(means, stds)],
                         color=color, alpha=0.15, zorder=3)

    ax1.set_xticks(x_coords)
    ax1.set_xticklabels(milestones, fontsize=10.5, fontweight="bold", color=DARK_BG)
    ax1.set_ylabel("Academic Score (Marks / Percentage)", fontsize=10.5, fontweight="bold", color=DARK_BG, labelpad=8)
    ax1.set_title("Longitudinal Academic Milestone Progression\nMean Cohort Trajectories ±0.5 SD Confidence Envelopes (N = 395)",
                  fontsize=11.5, fontweight="bold", color=DARK_BG, pad=12)
    ax1.set_ylim([20, 105])
    ax1.axhline(60, color=DARK_BG, linestyle=":", lw=1.2, alpha=0.7, label="Institutional At-Risk Threshold (60 Marks)")
    ax1.grid(True, linestyle="--", alpha=0.5, zorder=0)
    ax1.legend(frameon=True, facecolor="#ffffff", edgecolor=BORDER_COLOR, loc="lower left", fontsize=8.5)

    # Panel 2: Midterm Momentum (Delta M1->M2) vs Final Performance
    delta_midterms = df["midterm2Score"] - df["midterm1Score"]
    final_score = df["finalExamScore"]

    for cohort, color in cohort_colors.items():
        idx = df["support_group"] == cohort
        ax2.scatter(delta_midterms[idx], final_score[idx], color=color, alpha=0.75, s=48,
                    edgecolors="#ffffff", lw=0.5, label=f"{cohort}", zorder=3)

    # Trendline for overall momentum
    z = np.polyfit(delta_midterms, final_score, 1)
    p = np.poly1d(z)
    x_range = np.linspace(delta_midterms.min(), delta_midterms.max(), 100)
    ax2.plot(x_range, p(x_range), color=INDIGO_ACCENT, linestyle="--", lw=2.2,
             label=f"Momentum Trendline (Slope = +{z[0]:.2f})", zorder=4)

    ax2.set_xlabel("Mid-Semester Score Momentum ($\Delta$ = Midterm 2 - Midterm 1)", fontsize=10.5, fontweight="bold", color=DARK_BG, labelpad=8)
    ax2.set_ylabel("Final Examination Score", fontsize=10.5, fontweight="bold", color=DARK_BG, labelpad=8)
    ax2.set_title("Mid-Semester Momentum vs. Final Examination Outcome\nPositive $\Delta$ Demonstrates Strong Intervention Recovery",
                  fontsize=11.5, fontweight="bold", color=DARK_BG, pad=12)
    ax2.axvline(0, color=DARK_BG, linestyle="-", lw=1.0, alpha=0.4)
    ax2.axhline(60, color=ROSE_DANGER, linestyle=":", lw=1.2, alpha=0.7, label="Passing Threshold (60 Marks)")
    ax2.grid(True, linestyle="--", alpha=0.5, zorder=0)
    ax2.legend(frameon=True, facecolor="#ffffff", edgecolor=BORDER_COLOR, loc="upper left", fontsize=8.5)

    plt.suptitle("Trekverse AI — Academic Grade Trajectory & Longitudinal Performance Progression",
                 fontsize=13.5, fontweight="bold", color=DARK_BG, y=0.98)
    plt.tight_layout()
    out_path = os.path.join(OUTPUT_DIR, "09_academic_grade_trajectories.png")
    plt.savefig(out_path, dpi=300)
    plt.close()
    print(f"Saved: {out_path}")

if __name__ == "__main__":
    generate_grade_trajectory_chart()

