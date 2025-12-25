-- SQL schema for referrers_in table
-- This table stores referrer/partner information for businesses in India

CREATE TABLE IF NOT EXISTS referrers_in (
    id SERIAL PRIMARY KEY,
    business_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key constraint to businesses_1 table
    CONSTRAINT fk_business
        FOREIGN KEY (business_id)
        REFERENCES businesses_1(id)
        ON DELETE CASCADE
);

-- Create index on business_id for faster queries
CREATE INDEX IF NOT EXISTS idx_referrers_in_business_id ON referrers_in(business_id);

-- Create index on phone for potential lookups
CREATE INDEX IF NOT EXISTS idx_referrers_in_phone ON referrers_in(phone);

-- Optional: Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_referrers_in_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER referrers_in_updated_at_trigger
    BEFORE UPDATE ON referrers_in
    FOR EACH ROW
    EXECUTE FUNCTION update_referrers_in_updated_at();
