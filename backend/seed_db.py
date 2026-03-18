import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
from app.core.config import settings
from app.core.database import Base
from app.models.admissions import Lead, LeadSource, LeadStage

async def seed_db():
    engine = create_async_engine(settings.database_url)
    
    # Ensure tables are created (fallback)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async_session = sessionmaker(
        engine, class_=AsyncSession, expire_on_commit=False
    )
    
    async with async_session() as session:
        # Clear existing leads
        await session.execute(text('TRUNCATE TABLE leads CASCADE;'))
        
        leads = [
            Lead(
                name="Sarah Jenkins",
                email="sarah.j@example.com",
                phone="+1234567890",
                programme_interest="B.Tech Computer Science",
                source=LeadSource.SOCIAL,
                stage=LeadStage.NEW,
                score=85.5,
                score_breakdown={"academics": 40, "engagement": 45.5},
            ),
            Lead(
                name="Michael Chen",
                email="m.chen@example.com",
                phone="+1987654321",
                programme_interest="MBA Finance",
                source=LeadSource.WEB_FORM,
                stage=LeadStage.CONTACTED,
                score=92.0,
                score_breakdown={"work_experience": 50, "academics": 42},
            ),
            Lead(
                name="Priya Patel",
                email="priya.p@example.com",
                phone="+1122334455",
                programme_interest="M.Sc Data Science",
                source=LeadSource.REFERRAL,
                stage=LeadStage.NEW,
                score=78.0,
                score_breakdown={"academics": 78},
            )
        ]
        
        session.add_all(leads)
        await session.commit()
        print("? Database Seeded Successfully with Dynamic Leads!")

if __name__ == "__main__":
    asyncio.run(seed_db())
