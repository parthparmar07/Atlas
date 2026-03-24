CREATE TABLE alembic_version (
    version_num VARCHAR(32) NOT NULL, 
    CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num)
);

-- Running upgrade  -> 25d20cecb525

CREATE TABLE agents (
    id INTEGER NOT NULL, 
    name VARCHAR(255) NOT NULL, 
    module_type VARCHAR(128) NOT NULL, 
    status VARCHAR(10) NOT NULL, 
    last_heartbeat DATETIME, 
    created_at DATETIME NOT NULL, 
    PRIMARY KEY (id)
);

CREATE INDEX ix_agents_module_type ON agents (module_type);

CREATE INDEX ix_agents_name ON agents (name);

CREATE TABLE nurture_templates (
    id INTEGER NOT NULL, 
    step INTEGER NOT NULL, 
    channel VARCHAR(20) NOT NULL, 
    delay_days INTEGER NOT NULL, 
    subject VARCHAR(255), 
    body_template TEXT NOT NULL, 
    min_score FLOAT NOT NULL, 
    PRIMARY KEY (id)
);

CREATE TABLE policies (
    id INTEGER NOT NULL, 
    name VARCHAR(255) NOT NULL, 
    description TEXT, 
    policy_type VARCHAR(16) NOT NULL, 
    natural_language TEXT, 
    dsl TEXT, 
    status VARCHAR(8) NOT NULL, 
    priority INTEGER NOT NULL, 
    created_by INTEGER NOT NULL, 
    created_at DATETIME NOT NULL, 
    updated_at DATETIME NOT NULL, 
    PRIMARY KEY (id)
);

CREATE TABLE scholarships (
    id INTEGER NOT NULL, 
    name VARCHAR(255) NOT NULL, 
    provider VARCHAR(255) NOT NULL, 
    amount_max FLOAT NOT NULL, 
    criteria_json JSON NOT NULL, 
    deadline DATETIME, 
    PRIMARY KEY (id)
);

CREATE TABLE users (
    id INTEGER NOT NULL, 
    email VARCHAR(255) NOT NULL, 
    hashed_password VARCHAR(255) NOT NULL, 
    role VARCHAR(9) NOT NULL, 
    status VARCHAR(8) NOT NULL, 
    is_active BOOLEAN NOT NULL, 
    created_at DATETIME NOT NULL, 
    approved_at DATETIME, 
    approved_by INTEGER, 
    PRIMARY KEY (id)
);

CREATE UNIQUE INDEX ix_users_email ON users (email);

CREATE TABLE agent_tasks (
    id INTEGER NOT NULL, 
    agent_id INTEGER NOT NULL, 
    task_description TEXT NOT NULL, 
    status VARCHAR(7) NOT NULL, 
    execution_time FLOAT, 
    created_at DATETIME NOT NULL, 
    updated_at DATETIME NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(agent_id) REFERENCES agents (id) ON DELETE CASCADE
);

CREATE TABLE audit_logs (
    id INTEGER NOT NULL, 
    user_id INTEGER, 
    action VARCHAR(255) NOT NULL, 
    ip_address VARCHAR(45), 
    details TEXT, 
    timestamp DATETIME NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(user_id) REFERENCES users (id) ON DELETE SET NULL
);

CREATE INDEX ix_audit_logs_action ON audit_logs (action);

CREATE TABLE leads (
    id INTEGER NOT NULL, 
    name VARCHAR(255) NOT NULL, 
    email VARCHAR(255) NOT NULL, 
    phone VARCHAR(20) NOT NULL, 
    programme_interest VARCHAR(100) NOT NULL, 
    school_id VARCHAR(20) NOT NULL, 
    source VARCHAR(8) NOT NULL, 
    stage VARCHAR(13) NOT NULL, 
    score FLOAT NOT NULL, 
    score_breakdown JSON NOT NULL, 
    parsed_resume JSON NOT NULL, 
    assigned_counsellor_id INTEGER, 
    nurture_step INTEGER NOT NULL, 
    nurture_active BOOLEAN NOT NULL, 
    created_at DATETIME NOT NULL, 
    last_activity_at DATETIME NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(assigned_counsellor_id) REFERENCES users (id)
);

CREATE INDEX ix_leads_email ON leads (email);

CREATE INDEX ix_leads_school_id ON leads (school_id);

CREATE TABLE lead_documents (
    id INTEGER NOT NULL, 
    lead_id INTEGER NOT NULL, 
    doc_type VARCHAR(50) NOT NULL, 
    file_path VARCHAR(500) NOT NULL, 
    verified BOOLEAN NOT NULL, 
    ai_extracted JSON NOT NULL, 
    uploaded_at DATETIME NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(lead_id) REFERENCES leads (id) ON DELETE CASCADE
);

CREATE TABLE lead_interactions (
    id INTEGER NOT NULL, 
    lead_id INTEGER NOT NULL, 
    counsellor_id INTEGER, 
    interaction_type VARCHAR(50) NOT NULL, 
    notes TEXT, 
    next_action VARCHAR(255), 
    created_at DATETIME NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(counsellor_id) REFERENCES users (id), 
    FOREIGN KEY(lead_id) REFERENCES leads (id) ON DELETE CASCADE
);

CREATE TABLE scholarship_matches (
    id INTEGER NOT NULL, 
    lead_id INTEGER NOT NULL, 
    scholarship_id INTEGER NOT NULL, 
    match_score FLOAT NOT NULL, 
    match_reasons JSON NOT NULL, 
    applied BOOLEAN NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY(lead_id) REFERENCES leads (id) ON DELETE CASCADE, 
    FOREIGN KEY(scholarship_id) REFERENCES scholarships (id) ON DELETE CASCADE
);

INSERT INTO alembic_version (version_num) VALUES ('25d20cecb525') RETURNING version_num;

-- Running upgrade 25d20cecb525 -> 891e8ce6fc45

UPDATE alembic_version SET version_num='891e8ce6fc45' WHERE alembic_version.version_num = '25d20cecb525';

-- Running upgrade 891e8ce6fc45 -> 88aec839a977

ALTER TABLE audit_logs ADD COLUMN school_id VARCHAR(20);

CREATE INDEX ix_audit_logs_school_id ON audit_logs (school_id);

UPDATE alembic_version SET version_num='88aec839a977' WHERE alembic_version.version_num = '891e8ce6fc45';

-- Running upgrade 88aec839a977 -> c4f3d7a9c1b2

