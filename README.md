# Smart Care: A Healthy Archive
### Developed by MedShield Developers | AI-Powered Digital Healthcare Platform

**Smart Care: A Healthy Archive** is a centralized, secure, patient-controlled digital healthcare platform designed to solve the chronic problem of fragmented medical histories, repeated case-taking, missing previous reports, and avoidable duplicate diagnostic testing.

---

## 1. Core Problem Statement Solved

1. **Scattered Records:** Patients' medical histories are traditionally siloed across multiple clinics, laboratories, and hospitals.
2. **Repeated Case-Taking:** Patients repeatedly recount complex medical histories, allergies, and prior procedures from memory.
3. **Missing Previous Reports:** Past prescriptions and laboratory results are lost or left at home.
4. **Duplicate Tests:** Doctors inadvertently re-order expensive lab panels (e.g. HbA1c, lipid profiles) already completed days earlier.
5. **Treatment Gaps:** Unrecorded drug allergies (e.g. Penicillin) and concurrent prescriptions risk severe adverse interactions.
6. **Time & Cost Waste:** Billions of dollars and clinical hours are spent searching for past documents.

---

## 2. Core Architectural Innovations

- **Non-Sequential Unique Health ID (SC-XXXX-XXXX):** Non-sequential, cryptographic citizen identifier paired with a Zero-Exposure QR code. QR scanning identifies the patient but never exposes records without active patient consent.
- **Longitudinal Medical Timeline:** Unites consultations, prescriptions, lab reports, radiology scans, and patient documents in strict chronological order from earliest to latest.
- **Doctor-Wise Medical History:** Filters and isolates clinical encounters by physician (e.g., Dr. Aisha Rao, Dr. Marcus Chen) and accredited healthcare organization while preserving institutional authorship.
- **Duplicate-Test Awareness Engine:** Analyzes requested diagnostic tests and automatically detects overlapping tests conducted within 90 days. Displays an advisory with previous dates, attending physician, and exact lab results.
- **Granular Patient Consent Management:** Patients approve or decline doctor access requests with custom scope (Full Records, Labs Only, Prescriptions Only) and timed duration (1h, 24h, 7d). Immediate one-click revocation terminates access instantaneously.
- **Immutable Security Audit Trail:** Logs every view, request, approval, rejection, and blocked access attempt with actor role, IP address, and timestamp.

---

## 3. Project Folder Structure

```
├── .env.example                     # Environment variables configuration template
├── backend_fastapi/                 # Python FastAPI Backend Architecture
│   ├── main.py                      # FastAPI application with REST endpoints & routers
│   ├── requirements.txt             # Python dependencies (FastAPI, Pydantic, SQLAlchemy)
│   └── tests/
│       └── test_smart_care.py       # Automated test suite for core invariants
├── database/                        # PostgreSQL Relational Database Architecture
│   └── schema.sql                   # Comprehensive DDL schema with 14 tables, indexes, & FKs
├── server.ts                        # Full-Stack Express Server mounting Vite dev middleware
├── src/
│   ├── App.tsx                      # Primary application orchestrator & state manager
│   ├── components/
│   │   ├── AutomatedTestsView.tsx   # In-app runner for 14 Section 12 automated compliance tests
│   │   ├── AuditLogView.tsx         # Tamper-evident access history audit table
│   │   ├── ConsentManager.tsx       # Patient consent approval, decline & instant revoke engine
│   │   ├── DemoGuideBanner.tsx      # Step-by-step hackathon demo walkthrough helper
│   │   ├── DoctorDashboard.tsx      # Physician patient lookup, consent gate & consultation entry
│   │   ├── HospitalAdminView.tsx    # Facility directory, physician roster & assisted onboarding
│   │   ├── MedicalTimeline.tsx      # Chronological longitudinal timeline with document previews
│   │   ├── Navbar.tsx               # Top Bar Contract navigation with active role switcher
│   │   ├── OverviewHub.tsx          # Problem vs Solution overview & architecture matrix
│   │   ├── PatientDashboard.tsx     # Digital Health ID card, QR code, vitals & regimens
│   │   ├── PresentationScriptModal.tsx # 4-minute Hackathon presentation pitch script
│   │   ├── QrCodeModal.tsx          # High-density patient QR card view
│   │   └── UploadDocumentModal.tsx  # Document archive modal with duplicate test detection
│   ├── types/
│   │   └── healthcare.ts            # TypeScript interfaces & domain models
│   ├── assets/images/               # High-fidelity domain assets generated for the platform
│   └── main.tsx                     # React 19 entry point
├── package.json                     # Node.js project manifest & scripts
└── tsconfig.json                    # TypeScript compiler configuration
```

---

## 4. Database Schema (PostgreSQL)

The relational schema is defined in `/database/schema.sql` and includes:
- `users`: Base identity records with roles (`patient`, `doctor`, `hospital_admin`).
- `patient_health_ids`: Enforces non-sequential format (`SC-XXXX-XXXX`) and checksum validation.
- `patient_profiles`: Demographics, blood group, emergency contacts, insurance numbers.
- `doctor_profiles`: Medical licenses, verified specialty, affiliated hospital organization.
- `healthcare_organizations`: Hospital network nodes, state licenses, accredited dates.
- `consent_requests`: Purpose, requested scope, expiration timestamps, approval states.
- `consultations`: Chief complaints, vital signs, physical exam notes, follow-up dates.
- `diagnoses`: ICD-10 aligned diagnostic codes linked to consultations.
- `prescriptions` & `medication_entries`: e-Rx drugs, dosages, frequencies, and durations.
- `allergies`: Substance, severity rating (Mild/Moderate/Severe/Critical), and reactions.
- `laboratory_reports`: Test names, reference intervals, observed values, normal/abnormal flags.
- `medical_documents`: Private cloud storage metadata, SHA-256 checksums, and mime-types.
- `access_audit_logs`: Immutable ledger recording every actor, action, IP, and outcome.

---

## 5. Live Hackathon Demonstration Workflow

Use the top **Hackathon Demo Guide** bar to step through the sequence:

1. **Step 1: Patient Health ID & QR Code:** Open the Patient Portal. View Priya Sharma's ID `SC-7821-4902` and click "Scan QR" to demonstrate zero-exposure identification.
2. **Step 2: Doctor Lookup & Unauthorized Gate:** Switch to Doctor mode (Dr. Marcus Chen). Look up `SC-7821-4902`. The security firewall intercepts the request and blocks access with HTTP 403 Forbidden.
3. **Step 3: Patient Grants Consent:** Switch to Patient view -> Consent Control. Review Dr. Chen's incoming request and click "Grant 24h Access".
4. **Step 4: Unlocked Timeline & Duplicate-Test Alert:** Return to Doctor view. The timeline is decrypted. When ordering diagnostic panels, the Duplicate-Test Awareness engine triggers an alert for HbA1c and Lipid profiles tested recently.
5. **Step 5: Record Consultation & Prescriptions:** Enter chief complaint, ICD-10 diagnoses, and medications. Commit to archive.
6. **Step 6: Revoke Access & Audit Trail:** Switch to Patient view and click "Revoke Access Immediately". Inspect the Audit Trail to confirm the revocation and immediate access block.
7. **Step 7: Verify 14 Automated Tests:** Click "14 Tests" in the top bar to run all compliance tests with empirical evidence.

---

## 6. How to Run the Project

### Running the Live Full-Stack App:
```bash
npm run dev
# Starts full-stack Express server on port 3000 mounting Vite SPA
```

### Running the Python Unit Tests:
```bash
python3 -m unittest -v backend_fastapi/tests/test_smart_care.py
# Runs 5 business invariant unit tests in < 0.01s
```

### Running the Python FastAPI Server:
```bash
cd backend_fastapi
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 7. Compliance & Security Guarantees

- **Zero-Exposure QR Codes:** QR codes do not encode raw clinical data; they serve solely as authenticated identity tokens.
- **Explicit Consent Expirations:** All authorizations are bounded by duration (1h, 24h, 48h, 7d).
- **Least-Privilege Administrative Boundary:** Hospital administrators have zero read access to private clinical encounters.
- **Audit Logging:** Every view event is recorded with client IP and timestamps.

**MedShield Developers** | *Better healthcare continuity through secure, accessible digital medical records.*
