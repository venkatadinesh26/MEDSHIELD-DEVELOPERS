"""
Smart Care: A Healthy Archive - FastAPI Backend
Developed by MedShield Developers
"""

import os
import random
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr

app = FastAPI(
    title="Smart Care: A Healthy Archive API",
    description="Centralized, secure, patient-controlled digital healthcare record archive developed by MedShield Developers.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- SCHEMAS -----------------

class PatientRegisterRequest(BaseModel):
    name: str
    email: EmailStr
    dob: str
    gender: str
    blood_group: str
    phone: str
    address: str

class ConsentRequestModel(BaseModel):
    patient_health_id: str
    doctor_id: str
    purpose: str
    requested_scope: str
    duration_hours: int = 24

class ConsentResponseModel(BaseModel):
    consent_id: str
    decision: str  # 'approve' or 'reject'
    duration_hours: Optional[int] = 24

class DuplicateCheckRequest(BaseModel):
    patient_health_id: str
    test_names: List[str]

class ConsultationCreate(BaseModel):
    patient_health_id: str
    doctor_id: str
    chief_complaint: str
    diagnoses: List[str]
    medications: List[dict]
    clinical_notes: str

# ----------------- IN-MEMORY STATE FOR DEMO / UNIT TESTS -----------------

mock_health_ids = {"SC-7821-4902"}
mock_consents = {
    "cns_1": {
        "id": "cns_1",
        "patient_health_id": "SC-7821-4902",
        "doctor_id": "doc_1",
        "status": "approved",
        "expires_at": (datetime.utcnow() + timedelta(hours=24)).isoformat(),
    }
}
mock_timeline = [
    {
        "id": "rec_102",
        "patient_id": "SC-7821-4902",
        "title": "HbA1c & Fasting Glycemic Comprehensive Profile",
        "test_name": "hba1c",
        "date": "2026-09-22",
        "doctor_name": "Dr. Aisha Rao, MD",
        "facility": "Apex Diagnostic & Molecular Laboratories",
        "summary": "HbA1c 5.4%. Normal glycemic control.",
    },
    {
        "id": "rec_103",
        "patient_id": "SC-7821-4902",
        "title": "Advanced Lipid Panel",
        "test_name": "lipid panel",
        "date": "2026-09-14",
        "doctor_name": "Dr. Marcus Chen, MD",
        "facility": "Apex Diagnostic & Molecular Laboratories",
        "summary": "Total Cholesterol: 182 mg/dL. LDL: 104 mg/dL.",
    },
]

# ----------------- ROUTES -----------------

@app.get("/")
def health_check():
    return {
        "status": "online",
        "project": "Smart Care: A Healthy Archive",
        "team": "MedShield Developers",
        "version": "1.0.0",
        "architecture": "FastAPI + PostgreSQL + Cloud Storage",
    }

@app.post("/api/patients/register", status_code=status.HTTP_201_CREATED)
def register_patient(payload: PatientRegisterRequest):
    # Non-sequential Unique Health ID generation: SC-XXXX-XXXX
    p1 = random.randint(1000, 9999)
    p2 = random.randint(1000, 9999)
    health_id = f"SC-{p1}-{p2}"
    while health_id in mock_health_ids:
        p1 = random.randint(1000, 9999)
        p2 = random.randint(1000, 9999)
        health_id = f"SC-{p1}-{p2}"

    mock_health_ids.add(health_id)
    return {
        "message": "Patient registered successfully",
        "health_id": health_id,
        "name": payload.name,
        "email": payload.email,
        "blood_group": payload.blood_group,
    }

@app.get("/api/patients/{health_id}/records")
def get_patient_records(health_id: str, doctor_id: Optional[str] = None):
    if health_id not in mock_health_ids:
        raise HTTPException(status_code=404, detail="Patient health ID not found.")

    # Authorization Check: Doctors must possess active consent
    if doctor_id:
        active = any(
            c["patient_health_id"] == health_id
            and c["doctor_id"] == doctor_id
            and c["status"] == "approved"
            for c in mock_consents.values()
        )
        if not active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="ACCESS_RESTRICTED: Explicit patient consent is required to access medical records.",
            )

    return {
        "health_id": health_id,
        "records": [r for r in mock_timeline if r["patient_id"] == health_id],
    }

@app.post("/api/consents/request")
def request_consent(payload: ConsentRequestModel):
    if payload.patient_health_id not in mock_health_ids:
        raise HTTPException(status_code=404, detail="Patient health ID not found.")

    cid = f"cns_{random.randint(1000, 9999)}"
    mock_consents[cid] = {
        "id": cid,
        "patient_health_id": payload.patient_health_id,
        "doctor_id": payload.doctor_id,
        "purpose": payload.purpose,
        "status": "pending",
        "requested_at": datetime.utcnow().isoformat(),
    }
    return {"message": "Consent request sent", "consent_id": cid}

@app.post("/api/consents/respond")
def respond_consent(payload: ConsentResponseModel):
    consent = mock_consents.get(payload.consent_id)
    if not consent:
        raise HTTPException(status_code=404, detail="Consent request not found.")

    if payload.decision == "approve":
        consent["status"] = "approved"
        consent["expires_at"] = (datetime.utcnow() + timedelta(hours=payload.duration_hours or 24)).isoformat()
    else:
        consent["status"] = "rejected"

    return {"message": f"Consent {consent['status']}", "consent": consent}

@app.post("/api/consents/revoke")
def revoke_consent(consent_id: str):
    consent = mock_consents.get(consent_id)
    if not consent:
        raise HTTPException(status_code=404, detail="Consent not found.")

    consent["status"] = "revoked"
    consent["revoked_at"] = datetime.utcnow().isoformat()
    return {"message": "Consent successfully revoked. Immediate access termination enforced."}

@app.post("/api/duplicate-test-check")
def duplicate_test_check(payload: DuplicateCheckRequest):
    alerts = []
    patient_records = [r for r in mock_timeline if r["patient_id"] == payload.patient_health_id]

    for requested in payload.test_names:
        req_norm = requested.lower().strip()
        for rec in patient_records:
            if req_norm in rec.get("test_name", "") or req_norm in rec.get("title", "").lower():
                alerts.append({
                    "test_name": requested,
                    "previous_date": rec["date"],
                    "previous_doctor": rec["doctor_name"],
                    "facility": rec["facility"],
                    "advisory": f"A previous report may be available for review ({rec['title']} conducted on {rec['date']}). Avoid unnecessary repeat tests.",
                })
                break

    return {"has_duplicates": len(alerts) > 0, "alerts": alerts}
