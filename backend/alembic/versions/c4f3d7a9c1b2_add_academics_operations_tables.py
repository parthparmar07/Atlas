"""Add academics operations tables

Revision ID: c4f3d7a9c1b2
Revises: 88aec839a977
Create Date: 2026-03-21 18:10:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = "c4f3d7a9c1b2"
down_revision: Union[str, None] = "88aec839a977"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    timetable_status = postgresql.ENUM(
        "DRAFT", "PUBLISHED", "SUBSTITUTED", "CANCELLED", name="timetableslotstatus", create_type=False
    )
    substitution_status = postgresql.ENUM(
        "RECOMMENDED", "NOTIFIED", "CONFIRMED", "REJECTED", name="substitutionstatus", create_type=False
    )
    exam_status = postgresql.ENUM("PROPOSED", "PUBLISHED", "RESCHEDULED", name="examschedulestatus", create_type=False)
    calendar_event_type = postgresql.ENUM(
        "TEACHING_DAY", "EXAM", "HOLIDAY", "EVENT", "BREAK_DAY", name="calendareventtype", create_type=False
    )
    curriculum_status = postgresql.ENUM(
        "ALIGNED", "REVIEWING", "NEEDS_UPDATE", "NON_COMPLIANT", name="curriculumauditstatus", create_type=False
    )

    bind = op.get_bind()
    inspector = sa.inspect(bind)

    timetable_status.create(bind, checkfirst=True)
    substitution_status.create(bind, checkfirst=True)
    exam_status.create(bind, checkfirst=True)
    calendar_event_type.create(bind, checkfirst=True)
    curriculum_status.create(bind, checkfirst=True)

    def create_index_if_missing(index_name: str, table_name: str, columns: list[str]) -> None:
        if not sa.inspect(bind).has_table(table_name):
            return
        existing_indexes = {idx["name"] for idx in sa.inspect(bind).get_indexes(table_name)}
        if index_name not in existing_indexes:
            op.create_index(index_name, table_name, columns, unique=False)

    if not inspector.has_table("academics_timetable_slots"):
        op.create_table(
            "academics_timetable_slots",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("school_id", sa.String(length=20), nullable=False),
            sa.Column("programme", sa.String(length=120), nullable=False),
            sa.Column("semester", sa.String(length=40), nullable=False),
            sa.Column("section", sa.String(length=40), nullable=False),
            sa.Column("course_id", sa.Integer(), nullable=True),
            sa.Column("course_name", sa.String(length=255), nullable=False),
            sa.Column("faculty_id", sa.Integer(), nullable=True),
            sa.Column("faculty_name", sa.String(length=255), nullable=False),
            sa.Column("room", sa.String(length=120), nullable=False),
            sa.Column("day_of_week", sa.String(length=20), nullable=False),
            sa.Column("start_time", sa.DateTime(timezone=True), nullable=False),
            sa.Column("end_time", sa.DateTime(timezone=True), nullable=False),
            sa.Column("status", timetable_status, nullable=False),
            sa.Column("metadata_json", sa.JSON(), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
            sa.ForeignKeyConstraint(["course_id"], ["courses.id"]),
            sa.ForeignKeyConstraint(["faculty_id"], ["faculty.id"]),
            sa.PrimaryKeyConstraint("id"),
        )
    create_index_if_missing(op.f("ix_academics_timetable_slots_day_of_week"), "academics_timetable_slots", ["day_of_week"])
    create_index_if_missing(op.f("ix_academics_timetable_slots_school_id"), "academics_timetable_slots", ["school_id"])

    if not inspector.has_table("academics_faculty_availability"):
        op.create_table(
            "academics_faculty_availability",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("faculty_id", sa.Integer(), nullable=False),
            sa.Column("school_id", sa.String(length=20), nullable=False),
            sa.Column("day_of_week", sa.String(length=20), nullable=False),
            sa.Column("start_time", sa.DateTime(timezone=True), nullable=False),
            sa.Column("end_time", sa.DateTime(timezone=True), nullable=False),
            sa.Column("is_available", sa.Boolean(), nullable=False),
            sa.Column("reason", sa.String(length=255), nullable=True),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
            sa.ForeignKeyConstraint(["faculty_id"], ["faculty.id"], ondelete="CASCADE"),
            sa.PrimaryKeyConstraint("id"),
        )
    create_index_if_missing(op.f("ix_academics_faculty_availability_day_of_week"), "academics_faculty_availability", ["day_of_week"])
    create_index_if_missing(op.f("ix_academics_faculty_availability_faculty_id"), "academics_faculty_availability", ["faculty_id"])
    create_index_if_missing(op.f("ix_academics_faculty_availability_school_id"), "academics_faculty_availability", ["school_id"])

    if not inspector.has_table("academics_substitution_logs"):
        op.create_table(
            "academics_substitution_logs",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("school_id", sa.String(length=20), nullable=False),
            sa.Column("timetable_slot_id", sa.Integer(), nullable=True),
            sa.Column("absent_faculty_id", sa.Integer(), nullable=True),
            sa.Column("absent_faculty_name", sa.String(length=255), nullable=False),
            sa.Column("substitute_faculty_id", sa.Integer(), nullable=True),
            sa.Column("substitute_faculty_name", sa.String(length=255), nullable=False),
            sa.Column("course_name", sa.String(length=255), nullable=False),
            sa.Column("section", sa.String(length=40), nullable=False),
            sa.Column("slot_date", sa.DateTime(timezone=True), nullable=False),
            sa.Column("start_time", sa.DateTime(timezone=True), nullable=False),
            sa.Column("end_time", sa.DateTime(timezone=True), nullable=False),
            sa.Column("reason", sa.String(length=255), nullable=False),
            sa.Column("status", substitution_status, nullable=False),
            sa.Column("recommendation_score", sa.Float(), nullable=False),
            sa.Column("notification_payload", sa.JSON(), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("confirmed_at", sa.DateTime(timezone=True), nullable=True),
            sa.ForeignKeyConstraint(["absent_faculty_id"], ["faculty.id"], ondelete="SET NULL"),
            sa.ForeignKeyConstraint(["substitute_faculty_id"], ["faculty.id"], ondelete="SET NULL"),
            sa.ForeignKeyConstraint(["timetable_slot_id"], ["academics_timetable_slots.id"], ondelete="SET NULL"),
            sa.PrimaryKeyConstraint("id"),
        )
    create_index_if_missing(op.f("ix_academics_substitution_logs_school_id"), "academics_substitution_logs", ["school_id"])

    if not inspector.has_table("academics_exam_schedules"):
        op.create_table(
            "academics_exam_schedules",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("school_id", sa.String(length=20), nullable=False),
            sa.Column("exam_name", sa.String(length=255), nullable=False),
            sa.Column("course_id", sa.Integer(), nullable=True),
            sa.Column("course_name", sa.String(length=255), nullable=False),
            sa.Column("programme", sa.String(length=120), nullable=False),
            sa.Column("section", sa.String(length=40), nullable=False),
            sa.Column("exam_date", sa.DateTime(timezone=True), nullable=False),
            sa.Column("start_time", sa.DateTime(timezone=True), nullable=False),
            sa.Column("end_time", sa.DateTime(timezone=True), nullable=False),
            sa.Column("hall_name", sa.String(length=120), nullable=False),
            sa.Column("hall_capacity", sa.Integer(), nullable=False),
            sa.Column("registered_students", sa.Integer(), nullable=False),
            sa.Column("proctor_name", sa.String(length=255), nullable=True),
            sa.Column("status", exam_status, nullable=False),
            sa.Column("metadata_json", sa.JSON(), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
            sa.ForeignKeyConstraint(["course_id"], ["courses.id"], ondelete="SET NULL"),
            sa.PrimaryKeyConstraint("id"),
        )
    create_index_if_missing(op.f("ix_academics_exam_schedules_exam_date"), "academics_exam_schedules", ["exam_date"])
    create_index_if_missing(op.f("ix_academics_exam_schedules_school_id"), "academics_exam_schedules", ["school_id"])

    if not inspector.has_table("academics_calendar_events"):
        op.create_table(
            "academics_calendar_events",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("school_id", sa.String(length=20), nullable=False),
            sa.Column("title", sa.String(length=255), nullable=False),
            sa.Column("event_type", calendar_event_type, nullable=False),
            sa.Column("start_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("end_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("owner", sa.String(length=120), nullable=False),
            sa.Column("is_holiday", sa.Boolean(), nullable=False),
            sa.Column("is_locked", sa.Boolean(), nullable=False),
            sa.Column("metadata_json", sa.JSON(), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
            sa.PrimaryKeyConstraint("id"),
        )
    create_index_if_missing(op.f("ix_academics_calendar_events_school_id"), "academics_calendar_events", ["school_id"])
    create_index_if_missing(op.f("ix_academics_calendar_events_start_at"), "academics_calendar_events", ["start_at"])
    create_index_if_missing(op.f("ix_academics_calendar_events_end_at"), "academics_calendar_events", ["end_at"])

    if not inspector.has_table("academics_curriculum_audits"):
        op.create_table(
            "academics_curriculum_audits",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("school_id", sa.String(length=20), nullable=False),
            sa.Column("programme", sa.String(length=120), nullable=False),
            sa.Column("semester", sa.String(length=40), nullable=False),
            sa.Column("course_code", sa.String(length=40), nullable=False),
            sa.Column("course_name", sa.String(length=255), nullable=False),
            sa.Column("status", curriculum_status, nullable=False),
            sa.Column("alignment_score", sa.Float(), nullable=False),
            sa.Column("exam_frequency", sa.Float(), nullable=False),
            sa.Column("syllabus_weight", sa.Float(), nullable=False),
            sa.Column("industry_relevance", sa.Float(), nullable=False),
            sa.Column("gaps", sa.JSON(), nullable=False),
            sa.Column("recommendations", sa.JSON(), nullable=False),
            sa.Column("last_audited_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
            sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
            sa.PrimaryKeyConstraint("id"),
        )
    create_index_if_missing(op.f("ix_academics_curriculum_audits_course_code"), "academics_curriculum_audits", ["course_code"])
    create_index_if_missing(op.f("ix_academics_curriculum_audits_school_id"), "academics_curriculum_audits", ["school_id"])

    if not inspector.has_table("academics_automation_runs"):
        op.create_table(
            "academics_automation_runs",
            sa.Column("id", sa.Integer(), nullable=False),
            sa.Column("school_id", sa.String(length=20), nullable=False),
            sa.Column("trigger_type", sa.String(length=40), nullable=False),
            sa.Column("trigger_ref", sa.String(length=120), nullable=True),
            sa.Column("status", sa.String(length=20), nullable=False),
            sa.Column("summary", sa.Text(), nullable=False),
            sa.Column("execution_details", sa.JSON(), nullable=False),
            sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
            sa.PrimaryKeyConstraint("id"),
        )
    create_index_if_missing(op.f("ix_academics_automation_runs_school_id"), "academics_automation_runs", ["school_id"])


def downgrade() -> None:
    op.drop_index(op.f("ix_academics_automation_runs_school_id"), table_name="academics_automation_runs")
    op.drop_table("academics_automation_runs")

    op.drop_index(op.f("ix_academics_curriculum_audits_school_id"), table_name="academics_curriculum_audits")
    op.drop_index(op.f("ix_academics_curriculum_audits_course_code"), table_name="academics_curriculum_audits")
    op.drop_table("academics_curriculum_audits")

    op.drop_index(op.f("ix_academics_calendar_events_end_at"), table_name="academics_calendar_events")
    op.drop_index(op.f("ix_academics_calendar_events_start_at"), table_name="academics_calendar_events")
    op.drop_index(op.f("ix_academics_calendar_events_school_id"), table_name="academics_calendar_events")
    op.drop_table("academics_calendar_events")

    op.drop_index(op.f("ix_academics_exam_schedules_school_id"), table_name="academics_exam_schedules")
    op.drop_index(op.f("ix_academics_exam_schedules_exam_date"), table_name="academics_exam_schedules")
    op.drop_table("academics_exam_schedules")

    op.drop_index(op.f("ix_academics_substitution_logs_school_id"), table_name="academics_substitution_logs")
    op.drop_table("academics_substitution_logs")

    op.drop_index(op.f("ix_academics_faculty_availability_school_id"), table_name="academics_faculty_availability")
    op.drop_index(op.f("ix_academics_faculty_availability_faculty_id"), table_name="academics_faculty_availability")
    op.drop_index(op.f("ix_academics_faculty_availability_day_of_week"), table_name="academics_faculty_availability")
    op.drop_table("academics_faculty_availability")

    op.drop_index(op.f("ix_academics_timetable_slots_school_id"), table_name="academics_timetable_slots")
    op.drop_index(op.f("ix_academics_timetable_slots_day_of_week"), table_name="academics_timetable_slots")
    op.drop_table("academics_timetable_slots")

    bind = op.get_bind()
    sa.Enum(name="curriculumauditstatus").drop(bind, checkfirst=True)
    sa.Enum(name="calendareventtype").drop(bind, checkfirst=True)
    sa.Enum(name="examschedulestatus").drop(bind, checkfirst=True)
    sa.Enum(name="substitutionstatus").drop(bind, checkfirst=True)
    sa.Enum(name="timetableslotstatus").drop(bind, checkfirst=True)
