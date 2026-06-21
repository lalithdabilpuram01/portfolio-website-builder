-- ============================================================================
-- Skill logos — per-user toggle for showing brand logos next to skills/tools.
-- Run this in the Supabase SQL editor. Safe to re-run (idempotent).
-- ============================================================================

alter table profiles add column if not exists show_skill_logos boolean default true;
