# Viva & Technical Defense Preparation Guide
## Trekverse AI — Comprehensive Answers to Mandatory Review Questions

**Assignment Standard:** Fulfills Assignment Requirements § 13 (*"Viva and Review Questions — 10 Mandatory Questions"*) and § 15 (*"The team can explain every major design decision during the viva"*).

---

### Question 1: Why did you choose this problem and dataset?
**Answer:**
Educational institutions collect vast amounts of continuous telemetry (attendance, midterm tests, LMS submissions), yet this data often remains siloed in passive archives until final exam failures have already occurred. We chose this problem to build an active, early-warning decision-support system that alerts faculty and guides students toward timely remediation while final outcomes can still be altered. We selected the **UCI Student Performance Benchmark** because it contains a clean, multi-dimensional feature set combining academic metrics (Midterm 1, Midterm 2), engagement variables (attendance, study hours, absences), and behavioral vectors across 395 verified student instances, allowing rigorous multi-model comparisons and explainability validation.

---

### Question 2: What is the target variable, and how was it defined?
**Answer:**
We formulated two complementary prediction targets:
1. **Continuous Regression Target:** `finalExamScore` ($G_3$ on a 0–20 standard grading scale or 0–100%), representing summative semester academic performance.
2. **Support Group Classification Target:** A 3-class support tier based on holistic risk:
   - **High Support:** Final score $< 55$ OR attendance $< 70\%$ OR past backlogs $\ge 2$. Requires mandatory faculty advising and tutoring.
   - **Medium Support:** Final score between $55$ and $69$. Requires targeted clinics and habit coaching.
   - **Low Support:** Final score $\ge 70$ and attendance $\ge 75\%$. Self-directed enrichment and honors research.

---

### Question 3: How did you prevent data leakage?
**Answer:**
We enforced three strict architectural boundaries:
1. **Target Segregation:** The target column `finalExamScore` is strictly excluded from predictor matrices ($X$).
2. **Split-Before-Transform:** The dataset was split into an 80% training partition ($N=316$) and a 20% held-out test partition ($N=79$) *before* any feature scaling. `StandardScaler` was fitted strictly on $X_{\text{train}}$ via `.fit_transform()` and applied to $X_{\text{test}}$ via `.transform()`.
3. **Unsupervised Clustering Isolation:** K-Means behavioral clustering ($K=4$) was executed strictly without the final grade label, preventing target leakage into student engagement archetypes.

---

### Question 4: Why is your selected evaluation metric suitable?
**Answer:**
- **For Regression:** We report **$R^2$** (variance explained), **MAE** (Mean Absolute Error, robust to outliers and directly interpretable in raw marks: $3.55\text{ marks}$ on average), and **RMSE** (penalizes large catastrophic prediction errors).
- **For Early-Warning Classification:** We prioritize **Recall (Sensitivity)** over raw accuracy. In academic triage, a False Negative (failing to identify an at-risk student) is far more detrimental than a False Positive (offering tutoring to a student who might have passed on their own). Our classifier achieved **100.00% Recall** (0 False Negatives on the held-out test split).
- **Macro vs Weighted F1:** We evaluate Macro F1 to ensure the minority risk classes (Moderate and Critical) are treated with equal algorithmic importance rather than masked by the majority Low-Risk class.

---

### Question 5: What happens when the dataset is imbalanced?
**Answer:**
In educational cohorts, failing students typically represent a smaller proportion ($15 - 25\%$) of the student body. Without intervention, standard classifiers optimize for majority class accuracy and produce high false-negative rates for vulnerable students. We mitigated class imbalance through:
1. **Stratified Splitting:** Enforcing identical class proportions across train, validation, and test splits.
2. **Cost-Sensitive Learning:** Passing `class_weight='balanced'` in Random Forest and Logistic Regression, which scales the loss penalty inversely proportional to class frequencies.
3. **Threshold Tuning:** Calibrating probability decision thresholds to maximize Recall for the High Support group.

---

### Question 6: Which features influence predictions most strongly, and how do you know?
**Answer:**
We know the exact feature contributions through **Lundberg's Shapley Additive Explanations (`shap.TreeExplainer`)**, rooted in cooperative game theory.
- **Top Feature:** `midterm2Score` accounts for **$81.98\%$** of aggregate predictive weight.
- **Second Feature:** `midterm1Score` accounts for **$10.13\%$**.
- **Third Feature:** `attendanceRate` accounts for **$2.65\%$**.
Together, continuous assessment tracking drives $>92\%$ of predictive power, validating the educational principle that continuous performance is the most reliable precursor to final exam success.

---

### Question 7: How does your system handle uncertainty and incorrect predictions?
**Answer:**
1. **Confidence Intervals:** Continuous predictions are never presented as single point estimates; they include an empirical 95% Confidence Interval ($\hat{y} \pm 3.5\text{ marks}$).
2. **Explicit Disclaimers:** Every simulation card prominently states: *"Hypothetical Academic Simulation — Does not guarantee exam outcomes."*
3. **Decision-Support Framing:** The UI advises faculty that predictions are decision-support indicators requiring human clinical context.
4. **Follow-Up Assessment Logging:** Faculty can log post-intervention test scores in the database, allowing risk levels to update dynamically based on fresh data.

---

### Question 8: What ethical and privacy risks exist in predicting student performance?
**Answer:**
1. **Self-Fulfilling Prophecies / Algorithmic Bias:** If a student is labeled "High Risk," educators might inadvertently lower expectations. We counter this by framing categories as **Support Groups** linked to constructive study resources rather than deficit labels.
2. **Privacy Violations:** Storing sensitive personal identifiers exposes students to data leaks. Trekverse AI operates exclusively with synthetic de-identified tokens (`STU1024`).
3. **Punitive Misuse:** We establish strict governance forbidding automated academic sanctions based solely on AI outputs.

---

### Question 9: How would you monitor model drift after deployment?
**Answer:**
1. **Data Drift Monitoring:** Track Kolmogorov-Smirnov (K-S) tests on incoming continuous features (e.g. shifts in midterm grade distributions due to changes in curriculum or instructor grading strictness).
2. **Concept Drift Tracking:** Calculate Population Stability Index (PSI) and compare predicted exam distribution versus actual end-of-term results once semester marks are published.
3. **Automated Retraining Triggers:** If test set $R^2$ degrades below $0.75$ or classification F1 drops by $> 10\%$, trigger pipeline re-ingestion and hyperparameter re-tuning.

---

### Question 10: How could the system be improved using deep learning or an LLM-based assistant?
**Answer:**
1. **Recurrent / Transformer Architecture (LSTM / Time-Series Transformer):** Instead of aggregating attendance and LMS clicks into static summary averages, sequential neural networks could process temporal event sequences (weekly quiz fluctuations, timestamped homework submissions) to detect rapid mid-term learning drop-offs.
2. **Generative LLM Study Coach:** Integrate a retrieval-augmented (RAG) conversational agent (using Gemini or open-source Llama) that ingests the student's identified weak subject (e.g. "Linear Algebra - Matrix Inversion") and automatically generates customized practice problems, step-by-step diagnostic explanations, and interactive quizzes.

