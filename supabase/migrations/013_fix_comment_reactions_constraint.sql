-- Fix comment_reactions reaction_type constraint
-- Update the constraint to allow: 'like', 'helpful', 'love', 'insightful'

DO $$
BEGIN
  -- Drop the existing constraint if it exists
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'comment_reactions_reaction_type_check'
  ) THEN
    ALTER TABLE comment_reactions 
    DROP CONSTRAINT comment_reactions_reaction_type_check;
  END IF;

  -- Add the correct constraint
  ALTER TABLE comment_reactions 
  ADD CONSTRAINT comment_reactions_reaction_type_check 
  CHECK (reaction_type IN ('like', 'helpful', 'love', 'insightful'));
END $$;

