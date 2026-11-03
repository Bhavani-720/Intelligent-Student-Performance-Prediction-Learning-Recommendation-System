# Trekverse AI — System Architecture & Workflows

## Tagline: Predict. Understand. Improve. Succeed.

This document details the architectural blueprints, subsystem interaction topologies, machine learning inference lifecycles, and security boundary enforcement within **Trekverse AI — Student Academic Intelligence & Early-Warning System**.

---

## 1. High-Level System Architecture

```mermaid
graph TD
    subgraph ClientLayer["Frontend Layer (React 18 + Vite + Tailwind CSS)"]
        UI["Modern Enterprise UI (13 Modules)"]
        AuthCtx["AuthContext (JWT + RBAC State)"]
        AppCtx["AppContext (Data Sync & State)"]
        PDFGen["jsPDF Multi-Page Executive Engine"]
        UI --> AuthCtx
        UI --> AppCtx
        UI --> PDFGen
    end

    subgraph GatewayLayer["API & Application Gateway (Express 4 + Node.js)"]
        Router["RESTful API Router (/api/*)"]
        JWTMiddleware["JWT Authentication & Token Verifier"]
        RBACMiddleware["Role-Based Access Control Guard (Admin/Faculty/Student)"]
        AuditLogger["Audit & Request Logger"]
        Router --> JWTMiddleware --> RBACMiddleware --> AuditLogger
    end

    subgraph ServiceLayer["Core Services & ML Bridge"]
        AuthService["Auth & BCrypt Security Service"]
        StudentService["Student Academic Service (FERPA Isolated)"]
        InterventionService["Intervention Tracking & Remediation Service"]
        MLBridge["Python ML Bridge & Subprocess Controller"]
    end

    subgraph DataAndML["Persistence & ML Model Store"]
        StudentStore[("student_records.json (395 Authentic Instances)")]
        UserStore[("users.json (BCrypt Salted Credentials)")]
        MLModels[("Scikit-Learn Model Artifacts (*.joblib, metrics.json)")]
        PythonScripts["ml/train_all_models.py (Pipelines, SHAP, K-Means)"]
    end

    ClientLayer -- "HTTPS / JSON Payload + Bearer JWT" --> GatewayLayer
    AuditLogger --> AuthService
    AuditLogger --> StudentService
    AuditLogger --> InterventionService
    AuditLogger --> MLBridge

    AuthService --> UserStore
    StudentService --> StudentStore
    InterventionService --> StudentStore
    MLBridge --> MLModels
    PythonScripts --> MLModels
```

---

## 2. Frontend / Backend Communication Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as User (Admin / Faculty / Student)
    participant Client as React SPA (Vite)
    participant Gateway as Express Server (:3000)
    participant Auth as BCrypt / JWT Engine
    participant Store as JSON Data Store
    participant ML as ML Inference Engine

    User->>Client: Enter Credentials (Email & Password)
    Client->>Gateway: POST /api/auth/login { email, password }
    Gateway->>Auth: Verify BCrypt Hash against users.json
    Auth-->>Gateway: Verified (User Role & Permissions)
    Gateway-->>Client: HTTP 200 { token, user: { id, email, role, studentId } }
    Note over Client: Store JWT in secure localStorage session

    User->>Client: Navigate to Module (e.g. Risk, Prediction, Student Profile)
    Client->>Gateway: GET /api/students/:id (Header: Authorization Bearer JWT)
    Gateway->>Gateway: Verify JWT Signature & Expiration
    Gateway->>Gateway: Evaluate RBAC (Students can ONLY access their own studentId)
    alt Access Permitted
        Gateway->>Store: Read student record
        Store-->>Gateway: Return authentic record
        Gateway-->>Client: HTTP 200 { student: data }
        Client-->>User: Render Academic Intelligence & Intervention Panel
    else Access Denied (Unauthorized Access Attempt)
        Gateway-->>Client: HTTP 403 Forbidden { error: "Access denied" }
        Client-->>User: Show FERPA Security Guard Modal
    end

    User->>Client: Trigger Real-time Performance Prediction
    Client->>Gateway: POST /api/predict { features: [...] }
    Gateway->>ML: Run Random Forest inference & TreeExplainer
    ML-->>Gateway: Return predicted score, CI, risk tier, SHAP impacts
    Gateway-->>Client: HTTP 200 { prediction, riskTier, topDrivers }
    Client-->>User: Display Score, What-If Simulator & Explainability
```

---

## 3. Machine Learning Training & Inference Lifecycle

```mermaid
flowchart LR
    subgraph DataPrep["Data Ingestion & Hygiene"]
        UCI["UCI Machine Learning Benchmark\n(395 Student Instances)"]
        Clean["Data Quality Assertions:\n- 0 Missing Cells\n- 0 Duplicate Rows\n- Range Bounds Validation"]
        Encode["One-Hot & Ordinal Encoding\nStandardScaler Normalization"]
        UCI --> Clean --> Encode
    end

    subgraph Split["Evaluation Rigor"]
        SplitData["80/20 Stratified Holdout Split\nTrain: 316 | Test: 79"]
        CV["5-Fold Cross-Validation\nPer-Fold Variance Tracking"]
        Encode --> SplitData
        SplitData --> CV
    end

    subgraph Modeling["Model Training & Benchmarking"]
        M1["Gradient Boosting (GBM)\nTest R² = 87.4%"]
        M2["Random Forest (Production)\nTest R² = 86.4%"]
        M3["Ridge Regularized L2\nTest R² = 85.9%"]
        M4["Linear Regression (OLS)\nTest R² = 85.8%"]
        M5["SVR / KNN / DecisionTree"]
        M6["Zero-Skill Dummy Regressor\nR² = 0.00% (Baseline Floor)"]
        CV --> M1 & M2 & M3 & M4 & M5 & M6
    end

    subgraph ProductionSelection["Deployment Selection"]
        Select["Production Choice: Random Forest Regressor\nRationale:\n- 4.2x Faster Exact SHAP Calculation\n- Lower Cross-Validation Variance (0.023 vs 0.028)\n- Robust against Outliers & Perturbations"]
        M1 & M2 --> Select
    end

    subgraph XAI["Explainability & Diagnostics"]
        SHAP["SHAP TreeExplainer:\n- Midterm 2: 81.98%\n- Midterm 1: 10.13%\n- Past Failures: 2.59%\n- Weekly Study: 1.87%"]
        KMeans["K-Means Behavioral Personas (K=3):\n- High Achievers\n- Diligent Improvers\n- At-Risk Vulnerable"]
        CM["Confusion Matrix (N=79):\nTP=77, FP=1, FN=0, TN=1\nAccuracy=98.73%, Recall=100%"]
        Select --> SHAP & KMeans & CM
    end
```

---

## 4. Database Entity-Relationship Diagram

```mermaid
erDiagram
    USER ||--o| STUDENT_RECORD : "associates (Student Role)"
    USER {
        string id PK "Unique User UUID"
        string email UK "User Login Email"
        string passwordHash "Argon2id / BCrypt Hashed Password"
        string role "Admin | Faculty | Student"
        string studentId FK "Optional link to student record"
        timestamp createdAt "Registration Timestamp"
        timestamp lastLogin "Last Authentication Session"
    }

    STUDENT_RECORD ||--o{ INTERVENTION : "receives"
    STUDENT_RECORD {
        string id PK "Unique Student ID (e.g., STU-001)"
        string name "Student Full Name"
        string email UK "Student Institutional Email"
        string department "Academic Department"
        string course "Enrolled Degree Course"
        int semester "Current Academic Semester"
        float midterm1Score "Continuous Internal 1 (0-100)"
        float midterm2Score "Continuous Internal 2 (0-100)"
        float finalExamScore "Target Assessment (0-100)"
        float attendanceRate "Class Attendance Percentage"
        int pastFailures "Accumulated Historical Backlogs"
        int studyTimeWeeklyHours "Independent Study Hours"
        float sleepHours "Average Nightly Sleep"
        string stressLevel "Low | Medium | High"
        string riskCategory "Low | Moderate | High | Critical"
    }

    INTERVENTION {
        string id PK "Intervention UUID"
        string studentId FK "Foreign Key to STUDENT_RECORD"
        string facultyId FK "Foreign Key to USER (Faculty)"
        string type "Tutorial | Mentorship | Attendance Advisory | Study Group"
        string status "Pending | Active | Awaiting Follow-up Assessment | Completed"
        string notes "Faculty Observation Notes"
        timestamp scheduledAt "Scheduled Session Timestamp"
        timestamp updatedAt "Last Status Modification"
    }

    AUDIT_LOG {
        string id PK "Log UUID"
        string userId FK "Foreign Key to USER"
        string action "LOGIN | RECORD_VIEW | MODEL_TRAIN | REPORT_GENERATE"
        string ipAddress "Request Source IP"
        timestamp timestamp "UTC Timestamp"
    }
```

---

## 5. Role-Based Access Control (RBAC) Flow

```mermaid
flowchart TD
    Req[Incoming HTTP Request to /api/*] --> AuthToken{Has Authorization Header?}
    AuthToken -- No --> Reject401[Return 401 Unauthorized]
    AuthToken -- Yes --> VerifyJWT{Is JWT Signature Valid & Unexpired?}
    VerifyJWT -- No --> Reject401
    VerifyJWT -- Yes --> RoleExtract[Extract User Role: Admin / Faculty / Student]

    RoleExtract --> CheckRoute{Route Resource Type}

    CheckRoute -- "/api/admin/*" --> AdminGuard{Is Role == 'Admin'?}
    AdminGuard -- Yes --> Allow[Execute Handler]
    AdminGuard -- No --> Deny403[Return 403 Forbidden: Admin privileges required]

    CheckRoute -- "/api/faculty/*" --> FacultyGuard{Is Role in ['Admin', 'Faculty']?}
    FacultyGuard -- Yes --> Allow
    FacultyGuard -- No --> Deny403

    CheckRoute -- "/api/students/:id" --> StudentGuard{Is Student Accessing Own ID?}
    StudentGuard -- Role is Admin/Faculty --> Allow
    StudentGuard -- Role is Student AND TargetID == User.studentId --> Allow
    StudentGuard -- Role is Student AND TargetID != User.studentId --> Deny403FERPA[Return 403 Forbidden: FERPA Privacy Violation Blocked]

    CheckRoute -- Public / Common Routes --> Allow
```

---

## 6. Early-Warning & Remediation Pipeline

```mermaid
stateDiagram-v2
    [*] --> Ingestion: Continuous Assessment Ingestion (Midterm 1, Midterm 2, Attendance)
    Ingestion --> Scoring: Scikit-Learn Model Prediction & Risk Partitioning

    state Scoring {
        [*] --> Partition
        Partition --> LowRisk: Score >= 70% & Attendance >= 75% (219 Students)
        Partition --> ModerateRisk: Score 60-69% (21 Students)
        Partition --> HighRisk: Score 50-59% with Failures (87 Students)
        Partition --> CriticalRisk: Score < 50% or Attendance < 65% (68 Students)
    }

    LowRisk --> StandardMonitoring: Standard Track + Peer Mentorship
    ModerateRisk --> StudyGroup: Bi-Weekly Study Group & Diagnostic Exercises
    HighRisk --> RemedialTutorial: Enrolled in Mandatory Remedial Tutorial Batch
    CriticalRisk --> FacultyMentorship: Immediate Faculty Alert & Dean Advisory

    RemedialTutorial --> InterventionTracking: Status: "Awaiting Follow-up Assessment"
    FacultyMentorship --> InterventionTracking: Status: "Awaiting Follow-up Assessment"
    StudyGroup --> InterventionTracking: Status: "Awaiting Follow-up Assessment"

    InterventionTracking --> FollowUpCycle: Next Midterm Examination Cycle
    FollowUpCycle --> Scoring: Re-evaluate Trajectory
```
