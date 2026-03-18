
import asyncio
import os
import sys
from datetime import datetime, timezone

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.core.database import async_session_maker
from app.models.user import User, UserStatus
from app.models.policy import Policy
from app.models.audit import AuditLog

async def seed():
    async with async_session_maker() as db:
        # Clear existing data
        from sqlalchemy import text
        await db.execute(text("TRUNCATE users, policies, audit_logs RESTART IDENTITY CASCADE"))
        
        # 1. Seed Users
        users = [
            User(email="admin@atlas.edu", hashed_password="dummy_password", role="ADMIN", status=UserStatus.APPROVED, is_active=True),
            User(email="dev@atlas.edu", hashed_password="dummy_password", role="DEVELOPER", status=UserStatus.APPROVED, is_active=True),
            User(email="user@atlas.edu", hashed_password="dummy_password", role="USER", status=UserStatus.APPROVED, is_active=True),
            User(email="new_user@gmail.com", hashed_password="dummy_password", role="USER", status=UserStatus.PENDING, is_active=False),
        ]
        for u in users:
            db.add(u)
        
        await db.commit() # Commit users first to get IDs
        
        # 2. Seed AI Policies
        policies = [
            Policy(
                name="Admissions Data Privacy",
                description="Restrict access to student PII",
                policy_type="NATURAL_LANGUAGE",
                natural_language="Only admissions officers can view student contact details.",
                dsl="ALLOW ROLE admissions_officer ACTION view RESOURCE student_pii",
                status="ACTIVE",
                priority=1,
                created_by=1
            ),
            Policy(
                name="Financial Audit Trail",
                description="Log all budget changes",
                policy_type="NATURAL_LANGUAGE",
                natural_language="Every budget modification must be logged in the audit trail.",
                dsl="LOG ACTION update RESOURCE budget",
                status="ACTIVE",
                priority=2,
                created_by=1
            )
        ]
        for p in policies:
            db.add(p)

        # 3. Seed Audit Logs
        logs = [
            AuditLog(user_id=1, action="LOGIN", details="Admin logged in from 127.0.0.1"),
            AuditLog(user_id=1, action="AGENT_EXEC:hr-bot:Draft Notice", details="Drafted WFH policy"),
            AuditLog(user_id=2, action="POLICY_CREATE", details="Created Admissions Data Privacy policy"),
        ]
        for l in logs:
            db.add(l)

        await db.commit()
        print("Database seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed())
