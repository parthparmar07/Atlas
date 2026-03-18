import asyncio
from datetime import datetime, timedelta, timezone

from sqlalchemy import and_, select

from app.core.database import Base, async_session_maker, engine
from app.models.admissions import (
    Lead,
    LeadInteraction,
    LeadSource,
    LeadStage,
    NurtureTemplate,
    Scholarship,
)
from app.models.audit import AuditLog
from app.models.policy import Policy, PolicyStatus, PolicyType
from app.models.user import User, UserRole, UserStatus


async def _get_or_create_user(
    email: str,
    password: str,
    role: UserRole,
    status: UserStatus,
    is_active: bool,
) -> User:
    async with async_session_maker() as session:
        result = await session.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        if user:
            user.role = role
            user.status = status
            user.is_active = is_active
            if status == UserStatus.APPROVED and not user.approved_at:
                user.approved_at = datetime.now(timezone.utc)
            await session.commit()
            await session.refresh(user)
            return user

        user = User(
            email=email,
            # Keep seeding independent of local bcrypt/passlib runtime compatibility.
            hashed_password="test_password_not_for_production",
            role=role,
            status=status,
            is_active=is_active,
            approved_at=datetime.now(timezone.utc) if status == UserStatus.APPROVED else None,
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)
        return user


async def _get_or_create_policy(name: str, description: str, rule: str, priority: int, created_by: int) -> None:
    async with async_session_maker() as session:
        result = await session.execute(select(Policy).where(Policy.name == name))
        policy = result.scalar_one_or_none()
        if policy:
            policy.description = description
            policy.natural_language = rule
            policy.dsl = f"RULE: {rule}"
            policy.priority = priority
            policy.status = PolicyStatus.ACTIVE
            await session.commit()
            return

        session.add(
            Policy(
                name=name,
                description=description,
                policy_type=PolicyType.NATURAL_LANGUAGE,
                natural_language=rule,
                dsl=f"RULE: {rule}",
                status=PolicyStatus.ACTIVE,
                priority=priority,
                created_by=created_by,
            )
        )
        await session.commit()


async def _get_or_create_audit(user_id: int | None, action: str, details: str, ip: str) -> None:
    async with async_session_maker() as session:
        result = await session.execute(
            select(AuditLog).where(and_(AuditLog.action == action, AuditLog.details == details)).limit(1)
        )
        exists = result.scalar_one_or_none()
        if exists:
            return

        session.add(AuditLog(user_id=user_id, action=action, details=details, ip_address=ip))
        await session.commit()


async def _get_or_create_lead(
    name: str,
    email: str,
    phone: str,
    programme: str,
    source: LeadSource,
    stage: LeadStage,
    score: float,
) -> Lead:
    async with async_session_maker() as session:
        result = await session.execute(select(Lead).where(Lead.email == email))
        lead = result.scalar_one_or_none()
        if lead:
            lead.name = name
            lead.phone = phone
            lead.programme_interest = programme
            lead.source = source
            lead.stage = stage
            lead.score = score
            lead.last_activity_at = datetime.now(timezone.utc)
            await session.commit()
            await session.refresh(lead)
            return lead

        lead = Lead(
            name=name,
            email=email,
            phone=phone,
            programme_interest=programme,
            source=source,
            stage=stage,
            score=score,
            score_breakdown={"academics": round(score * 0.5, 1), "engagement": round(score * 0.5, 1)},
            parsed_resume={},
            nurture_step=1,
            nurture_active=True,
            created_at=datetime.now(timezone.utc),
            last_activity_at=datetime.now(timezone.utc),
        )
        session.add(lead)
        await session.commit()
        await session.refresh(lead)
        return lead


async def _get_or_create_lead_interaction(lead_id: int, counsellor_id: int | None, interaction_type: str, notes: str) -> None:
    async with async_session_maker() as session:
        result = await session.execute(
            select(LeadInteraction)
            .where(
                and_(
                    LeadInteraction.lead_id == lead_id,
                    LeadInteraction.interaction_type == interaction_type,
                    LeadInteraction.notes == notes,
                )
            )
            .limit(1)
        )
        exists = result.scalar_one_or_none()
        if exists:
            return

        session.add(
            LeadInteraction(
                lead_id=lead_id,
                counsellor_id=counsellor_id,
                interaction_type=interaction_type,
                notes=notes,
                next_action="Follow up in 48 hours",
            )
        )
        await session.commit()


async def _get_or_create_nurture_template(step: int, channel: str, delay_days: int, subject: str | None, body_template: str) -> None:
    async with async_session_maker() as session:
        result = await session.execute(
            select(NurtureTemplate)
            .where(and_(NurtureTemplate.step == step, NurtureTemplate.channel == channel))
            .limit(1)
        )
        template = result.scalar_one_or_none()
        if template:
            template.delay_days = delay_days
            template.subject = subject
            template.body_template = body_template
            await session.commit()
            return

        session.add(
            NurtureTemplate(
                step=step,
                channel=channel,
                delay_days=delay_days,
                subject=subject,
                body_template=body_template,
                min_score=0.0,
            )
        )
        await session.commit()


async def _get_or_create_scholarship(name: str, provider: str, amount_max: float, criteria_json: dict) -> None:
    async with async_session_maker() as session:
        result = await session.execute(
            select(Scholarship)
            .where(and_(Scholarship.name == name, Scholarship.provider == provider))
            .limit(1)
        )
        scholarship = result.scalar_one_or_none()
        if scholarship:
            scholarship.amount_max = amount_max
            scholarship.criteria_json = criteria_json
            await session.commit()
            return

        session.add(
            Scholarship(
                name=name,
                provider=provider,
                amount_max=amount_max,
                criteria_json=criteria_json,
                deadline=datetime.now(timezone.utc) + timedelta(days=90),
            )
        )
        await session.commit()


async def seed_test_data() -> None:
    # Ensure schema exists even in clean environments.
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    admin = await _get_or_create_user(
        email="admin@atlasuniversity.edu.in",
        password="Admin@123",
        role=UserRole.ADMIN,
        status=UserStatus.APPROVED,
        is_active=True,
    )
    await _get_or_create_user(
        email="developer@atlasuniversity.edu.in",
        password="Dev@123",
        role=UserRole.DEVELOPER,
        status=UserStatus.APPROVED,
        is_active=True,
    )
    await _get_or_create_user(
        email="pending.student@gmail.com",
        password="User@123",
        role=UserRole.USER,
        status=UserStatus.PENDING,
        is_active=False,
    )

    await _get_or_create_policy(
        name="Admissions Data Privacy",
        description="Only approved admissions roles can view student PII.",
        rule="Allow admissions_officer to view student_pii; deny all others.",
        priority=1,
        created_by=admin.id,
    )
    await _get_or_create_policy(
        name="Financial Audit Required",
        description="All budget and procurement changes must be logged.",
        rule="Log all update actions on budget and procurement resources.",
        priority=2,
        created_by=admin.id,
    )

    await _get_or_create_audit(admin.id, "LOGIN", "Admin logged in", "127.0.0.1")
    await _get_or_create_audit(admin.id, "POLICY_CREATE", "Created Admissions Data Privacy", "127.0.0.1")
    await _get_or_create_audit(admin.id, "AGENT_EXEC:placement-interview:Generate Questions", "Generated interview question bank", "127.0.0.1")

    lead_a = await _get_or_create_lead(
        name="Aarav Mehta",
        email="aarav.mehta@example.com",
        phone="+919999000111",
        programme="B.Tech Computer Science",
        source=LeadSource.WEB_FORM,
        stage=LeadStage.CONTACTED,
        score=82.5,
    )
    lead_b = await _get_or_create_lead(
        name="Riya Sharma",
        email="riya.sharma@example.com",
        phone="+919888777666",
        programme="MBA Finance",
        source=LeadSource.REFERRAL,
        stage=LeadStage.APPLIED,
        score=91.2,
    )
    lead_c = await _get_or_create_lead(
        name="Kabir Singh",
        email="kabir.singh@example.com",
        phone="+919777666555",
        programme="M.Sc Data Science",
        source=LeadSource.SOCIAL,
        stage=LeadStage.DOCS_PENDING,
        score=76.8,
    )

    await _get_or_create_lead_interaction(lead_a.id, admin.id, "call", "Discussed eligibility and entrance timeline")
    await _get_or_create_lead_interaction(lead_b.id, admin.id, "email", "Shared scholarship links and fee structure")
    await _get_or_create_lead_interaction(lead_c.id, None, "whatsapp", "Requested missing transcript documents")

    await _get_or_create_nurture_template(
        step=1,
        channel="email",
        delay_days=0,
        subject="Welcome to Atlas Admissions",
        body_template="Hi {{name}}, thanks for your interest in {{programme}}. Here is your next step.",
    )
    await _get_or_create_nurture_template(
        step=2,
        channel="whatsapp",
        delay_days=2,
        subject=None,
        body_template="Hi {{name}}, just checking if you need help completing your application for {{programme}}.",
    )

    await _get_or_create_scholarship(
        name="Merit Excellence Grant",
        provider="Atlas Foundation",
        amount_max=150000,
        criteria_json={"min_score": 85, "programs": ["B.Tech Computer Science", "M.Sc Data Science"]},
    )
    await _get_or_create_scholarship(
        name="Future Leaders Fellowship",
        provider="Industry Council",
        amount_max=100000,
        criteria_json={"min_score": 75, "programs": ["MBA Finance", "MBA Marketing"]},
    )

    print("Test data seeding complete. Records are upserted and safe to run multiple times.")


if __name__ == "__main__":
    asyncio.run(seed_test_data())
