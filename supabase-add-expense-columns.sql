-- Add subcategory and account_code to expenses
ALTER TABLE public.expenses
  ADD COLUMN IF NOT EXISTS subcategory text;

ALTER TABLE public.expenses
  ADD COLUMN IF NOT EXISTS account_code text;

-- Optional: set default timestamp if missing
ALTER TABLE public.expenses
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- Note: Run this in Supabase SQL Editor. Verify table 'expenses' exists before running.
