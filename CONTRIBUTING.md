# Contributing to Trekverse AI

Thank you for your interest in contributing to **Trekverse AI — Student Academic Intelligence & Early-Warning System**!

Tagline: *Predict. Understand. Improve. Succeed.*

This project is built with high standards of software engineering, algorithmic transparency, and educational privacy. Please follow these guidelines when proposing changes.

---

## 1. Development Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Python**: v3.10 or v3.11 with `pip`
- **Git**: v2.30+

---

## 2. Local Setup & Workflow

1. **Fork & Clone**:
   ```bash
   git clone https://github.com/Bhavani-720/Intelligent-Student-Performance-Prediction-Learning-Recommendation-System.git
   cd Intelligent-Student-Performance-Prediction-Learning-Recommendation-System
   ```

2. **Install Node.js Dependencies**:
   ```bash
   npm install
   ```

3. **Install Python ML Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment**:
   ```bash
   cp .env.example .env
   ```

5. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to interact with the platform.

---

## 3. Branching & Commit Conventions

- Use standard branch naming prefixes:
  - `feat/feature-name` (New functionality or UI capability)
  - `fix/bug-description` (Bug fixes, security patches)
  - `ml/model-improvement` (Machine learning pipeline changes)
  - `docs/doc-update` (Architecture or documentation updates)
  - `test/test-addition` (New automated unit or integration tests)

- Follow Conventional Commits:
  - `feat: add what-if simulator subject disclaimer`
  - `fix: resolve confusion matrix precision calculation`
  - `docs: update system architecture mermaid diagram`

---

## 4. Coding Standards

- **TypeScript / React**:
  - Strict typing (`noImplicitAny`). Avoid `any` whenever explicit interfaces exist.
  - Tailwind CSS classes for consistent dark-navy theme (`#070D18`/`#091122`).
  - No fake data or hardcoded mock student records. Use verified JSON stores or authenticated APIs.

- **Python / Machine Learning**:
  - Strict PEP8 compliance.
  - Reproducible random seeds (`random_state=42`) across cross-validation and splits.
  - All features must pass automated unit assertions in `tests/test_pipeline.py`.

---

## 5. Verification Checklist Before Pull Requests

Before submitting a Pull Request, verify that all three automated suites pass without errors:

```bash
# 1. Typecheck & Build
npm run build

# 2. Linting
npm run lint

# 3. Python ML Pipeline Unit Tests
pytest tests/test_pipeline.py
```

Thank you for helping empower students and educators worldwide!
