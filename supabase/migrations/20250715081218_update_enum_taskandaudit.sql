-- Add new enum values to existing enums

-- Add 'inprogress' to task_status enum
ALTER TYPE task_status ADD VALUE 'inprogress';

-- Add 'task_inprogress' to audit_action enum
ALTER TYPE audit_action ADD VALUE 'task_inprogress';
