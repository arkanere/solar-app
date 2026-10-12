-- Roll back 083: drop leaddata.updated_at.

ALTER TABLE leaddata DROP COLUMN updated_at;
