# Deliverable 2: Dataset Source, License Details & Data Dictionary
## Trekverse AI — Data Engineering & Feature Documentation

**Assignment Standard:** Fulfills Assignment Requirements § 5 (*"Dataset Requirements"*) and § 11.2 (*"Dataset source links, license details, and data dictionary"*).

---

## 1. Dataset Source & Attribution
- **Dataset Reference:** UCI Machine Learning Repository — Student Performance Dataset
- **Authors / Curators:** Paulo Cortez and Alice Silva (University of Minho, Guimarães, Portugal, 2008)
- **Official UCI Source Link:** [https://archive.ics.uci.edu/dataset/320/student+performance](https://archive.ics.uci.edu/dataset/320/student+performance)
- **License:** Creative Commons Attribution 4.0 International (CC BY 4.0). Freely usable for educational, research, and commercial evaluation with appropriate attribution.
- **Sample Cohort Size:** $N = 395$ verified student evaluation records.

---

## 2. Privacy Protection & PII Exclusion
In compliance with ethical educational guidelines and FERPA-like data protection standards:
- **No Real Names or Student IDs:** Real student names, government IDs, and contact numbers are entirely excluded from the training corpus.
- **De-Identification:** All records are indexed via synthetic surrogate tokens (`STU1001` through `STU1395`).
- **Demo Accounts:** All demonstration profiles (`admin`, `faculty`, `stu1024`) use fictitious demonstration personas (`@trekverse.ai`).

---

## 3. Comprehensive Data Dictionary

| # | Feature Name | Variable Type | Valid Range / Categories | Description & Educational Justification | Data Limitations |
| :-: | :--- | :---: | :---: | :--- | :--- |
| **01** | `studentId` | Identifier | String (`STUxxxx`) | Synthetic anonymized key for entity linkage. | Non-predictive; excluded from ML inputs. |
| **02** | `attendanceRate` | Numeric (Ratio) | $0.0\% - 100.0\%$ | Classroom attendance percentage. Captures direct instructional engagement. | Self-reported vs automated sensor variations. |
| **03** | `studyTimeWeeklyHours`| Numeric (Ratio) | $0.5 - 35.0\text{ hrs}$ | Self-reported weekly independent study time outside scheduled classes. | Vulnerable to student recall bias. |
| **04** | `absences` | Integer (Count) | $0 - 75\text{ days}$ | Cumulative unexcused class absences throughout academic term. | Non-linear impact at extreme values. |
| **05** | `pastFailures` | Integer (Count) | $0 - 4\text{ courses}$ | Number of prior subject backlogs or failed course modules. | Ceiling effect at 4+ failures. |
| **06** | `midterm1Score` | Numeric (Score) | $0.0 - 20.0\text{ marks}$ | Continuous assessment 1 internal exam mark (or 0–100 scale). | Early syllabus coverage only. |
| **07** | `midterm2Score` | Numeric (Score) | $0.0 - 20.0\text{ marks}$ | Continuous assessment 2 internal exam mark. Primary trajectory predictor. | Assesses mid-semester mastery. |
| **08** | `parentalEducation` | Categorical | None, Primary, Secondary, Higher | Highest educational qualification achieved by primary guardian. | Socioeconomic proxy; handled ethically. |
| **09** | `extracurricular` | Binary (Boolean) | True / False | Participation in university athletic, cultural, or coding clubs. | Binary granularity loses time commitment detail. |
| **10** | `internetAccess` | Binary (Boolean) | True / False | Stable home internet connectivity for online LMS access. | Does not measure connection bandwidth. |
| **11** | `travelTimeMinutes` | Numeric (Interval) | $5 - 120\text{ mins}$ | Daily one-way transit commute time to campus. | Commute fatigue indicator. |
| **12** | `sleepHours` | Numeric (Ratio) | $3.0 - 12.0\text{ hrs}$ | Self-reported average nightly sleep duration. | Non-linear optimal window (7–8 hours). |
| **13** | `stressLevel` | Categorical | Low, Medium, High | Student self-assessed cognitive and academic stress load. | Subjective perceptual measure. |
| **14** | `assessment_trend` | Numeric (Derived) | $-10.0 \text{ to } +10.0$ | Derived momentum metric: $\text{Midterm 2} - \text{Midterm 1}$. | Indicates positive recovery or learning drift. |
| **15** | `engagement_consistency`| Numeric (Derived)| $0.0 - 100.0$ | Composite indicator: $0.6 \times \text{Attendance} + 0.4 \times (100 - 5 \times \text{Absences})$. | Normalized holistic classroom consistency. |
| **16** | `finalExamScore` | Target (Numeric) | $0.0 - 20.0\text{ marks}$ | Final summative semester examination outcome. | Primary regression target variable. |
| **17** | `support_group` | Target (Category)| Low, Medium, High Support | 3-Class support tier defined by comprehensive academic risk. | Primary classification target variable. |

---

## 4. Data Leakage Prevention Architecture
1. **Target Segregation:** The target label `finalExamScore` is strictly excluded from all training feature matrices ($X$).
2. **Preprocessor Fitting Boundary:**
   `StandardScaler` and any categorical encoders are fitted **exclusively on the training split** ($X_{\text{train}}$) via `.fit_transform()`. Test partitions ($X_{\text{test}}$) are processed strictly via `.transform()`.
3. **Unsupervised Clustering Isolation:** K-Means clustering ($K=4$) is executed strictly without the target label, ensuring cluster assignments represent authentic behavioral patterns rather than grade groupings.

