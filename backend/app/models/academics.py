from sqlalchemy import String, Text, Integer, Float, Boolean, DateTime, Date, Time, Enum, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, timezone
import enum
from app.core.database import Base

class StudentLevel(str, enum.Enum):
    UNDERGRADUATE = "undergraduate"
    GRADUATE = "graduate"
    DOCTORAL = "doctoral"
    POSTGRADUATE = "graduate"
    EXECUTIVE = "graduate"

class AttendanceStatus(str, enum.Enum):
    PRESENT = "present"
    ABSENT = "absent"
    EXCUSED = "excused"
    LATE = "late"

class LeaveStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    REVIEW_REQUIRED = "review_required"


class TimetableSlotStatus(str, enum.Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    SUBSTITUTED = "substituted"
    CANCELLED = "cancelled"


class SubstitutionStatus(str, enum.Enum):
    RECOMMENDED = "recommended"
    NOTIFIED = "notified"
    CONFIRMED = "confirmed"
    REJECTED = "rejected"


class ExamScheduleStatus(str, enum.Enum):
    PROPOSED = "proposed"
    PUBLISHED = "published"
    RESCHEDULED = "rescheduled"


class CalendarEventType(str, enum.Enum):
    TEACHING_DAY = "teaching_day"
    EXAM = "exam"
    HOLIDAY = "holiday"
    EVENT = "event"
    BREAK_DAY = "break_day"


class CurriculumAuditStatus(str, enum.Enum):
    ALIGNED = "aligned"
    REVIEWING = "reviewing"
    NEEDS_UPDATE = "needs_update"
    NON_COMPLIANT = "non_compliant"

class Faculty(Base):
    __tablename__ = "faculty"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255), unique=True)
    qualification: Mapped[str] = mapped_column(String(500))
    experience_years: Mapped[int] = mapped_column(Integer)
    achievements: Mapped[str] = mapped_column(Text)
    department: Mapped[str] = mapped_column(String(100))
    school_id: Mapped[str] = mapped_column(String(20), index=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

class Course(Base):
    __tablename__ = "courses"
    id: Mapped[int] = mapped_column(primary_key=True)
    code: Mapped[str] = mapped_column(String(20), unique=True)
    name: Mapped[str] = mapped_column(String(255))
    semester: Mapped[int] = mapped_column(Integer)
    faculty_id: Mapped[int] = mapped_column(ForeignKey("faculty.id"))
    school_id: Mapped[str] = mapped_column(String(20), index=True)
    syllabus_summary: Mapped[str] = mapped_column(Text)

class Student(Base):
    __tablename__ = "students"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    name: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255), unique=True)
    roll_number: Mapped[str] = mapped_column(String(50), unique=True)
    level: Mapped[StudentLevel] = mapped_column(Enum(StudentLevel))
    school_id: Mapped[str] = mapped_column(String(20), index=True)
    programme: Mapped[str] = mapped_column(String(100))
    attendance_rate: Mapped[float] = mapped_column(Float, default=100.0)
    gpa: Mapped[float] = mapped_column(Float, default=0.0)
    risk_score: Mapped[float] = mapped_column(Float, default=0.0) # 0 to 100
    recovery_plan: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

class AttendanceRecord(Base):
    __tablename__ = "attendance_records"
    id: Mapped[int] = mapped_column(primary_key=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"))
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id"))
    date: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    status: Mapped[AttendanceStatus] = mapped_column(Enum(AttendanceStatus))
    notes: Mapped[str | None] = mapped_column(String(255))

class LeaveRequest(Base):
    __tablename__ = "student_leave_requests"
    id: Mapped[int] = mapped_column(primary_key=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"))
    start_date: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    end_date: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    reason: Mapped[str] = mapped_column(Text)
    status: Mapped[LeaveStatus] = mapped_column(Enum(LeaveStatus), default=LeaveStatus.PENDING)
    ai_recommendation: Mapped[str | None] = mapped_column(Text)
    processed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class TimetableSlot(Base):
    __tablename__ = "academics_timetable_slots"
    id: Mapped[int] = mapped_column(primary_key=True)
    school_id: Mapped[str] = mapped_column(String(20), index=True)
    programme: Mapped[str] = mapped_column(String(120), default="General")
    semester: Mapped[str] = mapped_column(String(40), default="Semester 1")
    section: Mapped[str] = mapped_column(String(40), default="A")
    course_id: Mapped[int | None] = mapped_column(ForeignKey("courses.id"), nullable=True)
    course_name: Mapped[str] = mapped_column(String(255))
    faculty_id: Mapped[int | None] = mapped_column(ForeignKey("faculty.id"), nullable=True)
    faculty_name: Mapped[str] = mapped_column(String(255))
    room: Mapped[str] = mapped_column(String(120), default="TBD")
    day_of_week: Mapped[str] = mapped_column(String(20), index=True)
    start_time: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    end_time: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    status: Mapped[TimetableSlotStatus] = mapped_column(Enum(TimetableSlotStatus), default=TimetableSlotStatus.DRAFT)
    metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class FacultyAvailability(Base):
    __tablename__ = "academics_faculty_availability"
    id: Mapped[int] = mapped_column(primary_key=True)
    faculty_id: Mapped[int] = mapped_column(ForeignKey("faculty.id", ondelete="CASCADE"), index=True)
    school_id: Mapped[str] = mapped_column(String(20), index=True)
    day_of_week: Mapped[str] = mapped_column(String(20), index=True)
    start_time: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    end_time: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    is_available: Mapped[bool] = mapped_column(Boolean, default=True)
    reason: Mapped[str | None] = mapped_column(String(255))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class SubstitutionLog(Base):
    __tablename__ = "academics_substitution_logs"
    id: Mapped[int] = mapped_column(primary_key=True)
    school_id: Mapped[str] = mapped_column(String(20), index=True)
    timetable_slot_id: Mapped[int | None] = mapped_column(ForeignKey("academics_timetable_slots.id", ondelete="SET NULL"), nullable=True)
    absent_faculty_id: Mapped[int | None] = mapped_column(ForeignKey("faculty.id", ondelete="SET NULL"), nullable=True)
    absent_faculty_name: Mapped[str] = mapped_column(String(255))
    substitute_faculty_id: Mapped[int | None] = mapped_column(ForeignKey("faculty.id", ondelete="SET NULL"), nullable=True)
    substitute_faculty_name: Mapped[str] = mapped_column(String(255), default="TBD")
    course_name: Mapped[str] = mapped_column(String(255))
    section: Mapped[str] = mapped_column(String(40), default="A")
    slot_date: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    start_time: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    end_time: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    reason: Mapped[str] = mapped_column(String(255), default="unspecified")
    status: Mapped[SubstitutionStatus] = mapped_column(Enum(SubstitutionStatus), default=SubstitutionStatus.RECOMMENDED)
    recommendation_score: Mapped[float] = mapped_column(Float, default=0.0)
    notification_payload: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    confirmed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class ExamSchedule(Base):
    __tablename__ = "academics_exam_schedules"
    id: Mapped[int] = mapped_column(primary_key=True)
    school_id: Mapped[str] = mapped_column(String(20), index=True)
    exam_name: Mapped[str] = mapped_column(String(255))
    course_id: Mapped[int | None] = mapped_column(ForeignKey("courses.id", ondelete="SET NULL"), nullable=True)
    course_name: Mapped[str] = mapped_column(String(255))
    programme: Mapped[str] = mapped_column(String(120), default="General")
    section: Mapped[str] = mapped_column(String(40), default="A")
    exam_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    start_time: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    end_time: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    hall_name: Mapped[str] = mapped_column(String(120), default="Main Hall")
    hall_capacity: Mapped[int] = mapped_column(Integer, default=60)
    registered_students: Mapped[int] = mapped_column(Integer, default=0)
    proctor_name: Mapped[str | None] = mapped_column(String(255))
    status: Mapped[ExamScheduleStatus] = mapped_column(Enum(ExamScheduleStatus), default=ExamScheduleStatus.PROPOSED)
    metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class AcademicCalendarEvent(Base):
    __tablename__ = "academics_calendar_events"
    id: Mapped[int] = mapped_column(primary_key=True)
    school_id: Mapped[str] = mapped_column(String(20), index=True)
    title: Mapped[str] = mapped_column(String(255))
    event_type: Mapped[CalendarEventType] = mapped_column(Enum(CalendarEventType), default=CalendarEventType.EVENT)
    start_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    end_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    owner: Mapped[str] = mapped_column(String(120), default="Academic Cell")
    is_holiday: Mapped[bool] = mapped_column(Boolean, default=False)
    is_locked: Mapped[bool] = mapped_column(Boolean, default=False)
    metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class CurriculumAuditEntry(Base):
    __tablename__ = "academics_curriculum_audits"
    id: Mapped[int] = mapped_column(primary_key=True)
    school_id: Mapped[str] = mapped_column(String(20), index=True)
    programme: Mapped[str] = mapped_column(String(120), default="General")
    semester: Mapped[str] = mapped_column(String(40), default="Semester 1")
    course_code: Mapped[str] = mapped_column(String(40), index=True)
    course_name: Mapped[str] = mapped_column(String(255))
    status: Mapped[CurriculumAuditStatus] = mapped_column(Enum(CurriculumAuditStatus), default=CurriculumAuditStatus.REVIEWING)
    alignment_score: Mapped[float] = mapped_column(Float, default=0.0)
    exam_frequency: Mapped[float] = mapped_column(Float, default=0.0)
    syllabus_weight: Mapped[float] = mapped_column(Float, default=0.0)
    industry_relevance: Mapped[float] = mapped_column(Float, default=0.0)
    gaps: Mapped[list] = mapped_column(JSON, default=list)
    recommendations: Mapped[list] = mapped_column(JSON, default=list)
    last_audited_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))


class AcademicsAutomationRun(Base):
    __tablename__ = "academics_automation_runs"
    id: Mapped[int] = mapped_column(primary_key=True)
    school_id: Mapped[str] = mapped_column(String(20), index=True)
    trigger_type: Mapped[str] = mapped_column(String(40), default="manual")
    trigger_ref: Mapped[str | None] = mapped_column(String(120))
    status: Mapped[str] = mapped_column(String(20), default="success")
    summary: Mapped[str] = mapped_column(Text, default="")
    execution_details: Mapped[list] = mapped_column(JSON, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
