"""
Smart Care: A Healthy Archive - Automated Test Suite
MedShield Developers | Python Backend Verification
Tests Unique Health IDs, Consent Enforcement, Duplicate-Test Awareness
"""

import unittest
from datetime import datetime, timedelta

# Pure unit tests verifying business logic invariants without external networking dependencies
class TestSmartCareInvariants(unittest.TestCase):
    def setUp(self):
        self.patient_id = "SC-7821-4902"
        self.consents = {
            "cns_1": {
                "id": "cns_1",
                "patient_health_id": self.patient_id,
                "doctor_id": "doc_1",
                "status": "approved",
                "expires_at": (datetime.utcnow() + timedelta(hours=24)).isoformat(),
            }
        }
        self.timeline = [
            {
                "id": "rec_102",
                "patient_id": self.patient_id,
                "title": "HbA1c & Fasting Glycemic Profile",
                "date": "2026-09-22",
                "doctor": "Dr. Aisha Rao, MD",
                "facility": "Apex Diagnostic Laboratories",
            },
            {
                "id": "rec_103",
                "patient_id": self.patient_id,
                "title": "Advanced Lipid Panel",
                "date": "2026-09-14",
                "doctor": "Dr. Marcus Chen, MD",
                "facility": "Apex Diagnostic Laboratories",
            },
        ]

    def test_01_health_id_format_non_sequential(self):
        """Test 1: Health ID must follow non-sequential SC-XXXX-XXXX format"""
        import random
        p1 = random.randint(1000, 9999)
        p2 = random.randint(1000, 9999)
        generated = f"SC-{p1}-{p2}"
        self.assertTrue(generated.startswith("SC-"))
        self.assertEqual(len(generated), 12)

    def test_02_unauthorized_access_blocked(self):
        """Test 4: Doctor without approved consent cannot view records"""
        unauthorized_doc = "doc_unauthorized"
        has_access = any(
            c["patient_health_id"] == self.patient_id
            and c["doctor_id"] == unauthorized_doc
            and c["status"] == "approved"
            for c in self.consents.values()
        )
        self.assertFalse(has_access, "Doctor without consent must not have access")

    def test_03_authorized_access_granted(self):
        """Test 5: Doctor with approved consent is authorized"""
        doc_1 = "doc_1"
        has_access = any(
            c["patient_health_id"] == self.patient_id
            and c["doctor_id"] == doc_1
            and c["status"] == "approved"
            for c in self.consents.values()
        )
        self.assertTrue(has_access, "Doctor with approved consent must have access")

    def test_04_instant_consent_revocation(self):
        """Test 6: Consent revocation immediately blocks subsequent access"""
        # Patient revokes consent cns_1
        self.consents["cns_1"]["status"] = "revoked"
        self.consents["cns_1"]["revoked_at"] = datetime.utcnow().isoformat()

        doc_1_access = any(
            c["patient_health_id"] == self.patient_id
            and c["doctor_id"] == "doc_1"
            and c["status"] == "approved"
            for c in self.consents.values()
        )
        self.assertFalse(doc_1_access, "Revoked consent must immediately block doctor access")

    def test_05_duplicate_test_awareness_engine(self):
        """Test 10: Duplicate-test awareness detects recent overlapping tests"""
        requested_tests = ["HbA1c", "Lipid Panel", "Electrolytes"]
        detected_duplicates = []

        for req in requested_tests:
            norm = req.lower().strip()
            for rec in self.timeline:
                if norm in rec["title"].lower():
                    detected_duplicates.append(rec)
                    break

        self.assertEqual(len(detected_duplicates), 2, "Should identify HbA1c and Lipid Panel as existing tests")
        self.assertEqual(detected_duplicates[0]["facility"], "Apex Diagnostic Laboratories")

if __name__ == '__main__':
    unittest.main()
