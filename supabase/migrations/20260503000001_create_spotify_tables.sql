-- Spotify tokens table for storing OAuth tokens
CREATE TABLE IF NOT EXISTS public.spotify_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  spotify_user_id TEXT,
  spotify_display_name TEXT,
  spotify_avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.spotify_tokens ENABLE ROW LEVEL SECURITY;

-- Users can only access their own tokens
CREATE POLICY "Users can view their own spotify tokens"
  ON public.spotify_tokens FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own spotify tokens"
  ON public.spotify_tokens FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own spotify tokens"
  ON public.spotify_tokens FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own spotify tokens"
  ON public.spotify_tokens FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Index for fast lookups
CREATE INDEX idx_spotify_tokens_user_id ON public.spotify_tokens(user_id);

-- Personality results table
CREATE TABLE IF NOT EXISTS public.personality_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  archetype TEXT NOT NULL,
  archetype_score NUMERIC,
  alter_ego_name TEXT NOT NULL,
  alter_ego_title TEXT,
  alter_ego_description TEXT,
  genre_dna JSONB DEFAULT '{}',
  mood_spectrum JSONB DEFAULT '{}',
  top_artists JSONB DEFAULT '[]',
  top_tracks JSONB DEFAULT '[]',
  audio_features_avg JSONB DEFAULT '{}',
  time_range TEXT DEFAULT 'medium_term',
  is_public BOOLEAN DEFAULT true,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.personality_results ENABLE ROW LEVEL SECURITY;

-- Users can view their own results
CREATE POLICY "Users can view their own personality results"
  ON public.personality_results FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Anyone can view public results (for sharing)
CREATE POLICY "Anyone can view public personality results"
  ON public.personality_results FOR SELECT TO anon
  USING (is_public = true);

CREATE POLICY "Authenticated can view public personality results"
  ON public.personality_results FOR SELECT TO authenticated
  USING (is_public = true);

CREATE POLICY "Users can insert their own personality results"
  ON public.personality_results FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own personality results"
  ON public.personality_results FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_personality_results_user_id ON public.personality_results(user_id);
CREATE INDEX idx_personality_results_public ON public.personality_results(is_public) WHERE is_public = true;

-- Updated at trigger for spotify_tokens
CREATE TRIGGER update_spotify_tokens_updated_at
  BEFORE UPDATE ON public.spotify_tokens
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
