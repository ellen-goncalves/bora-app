CREATE EXTENSION IF NOT EXISTS postgis;
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY, display_name TEXT NOT NULL,
  sport TEXT, public_bio TEXT,
  reference_point geography(Point,4326),
  visible_in_search BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY, organizer_id UUID NOT NULL REFERENCES players(id),
  sport TEXT NOT NULL, starts_at TIMESTAMPTZ NOT NULL,
  place_name TEXT NOT NULL, place_point geography(Point,4326),
  capacity INTEGER NOT NULL CHECK (capacity BETWEEN 2 AND 100),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','closed','completed'))
);
CREATE TABLE IF NOT EXISTS participation_requests (
  id UUID PRIMARY KEY, match_id UUID NOT NULL REFERENCES matches(id),
  player_id UUID NOT NULL REFERENCES players(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','accepted','rejected','cancelled')),
  arrived_at TIMESTAMPTZ,
  UNIQUE(match_id,player_id)
);
CREATE INDEX IF NOT EXISTS idx_matches_geo ON matches USING GIST(place_point);
CREATE INDEX IF NOT EXISTS idx_players_geo ON players USING GIST(reference_point) WHERE visible_in_search;
CREATE INDEX IF NOT EXISTS idx_matches_time ON matches(starts_at) WHERE status='open';
CREATE INDEX IF NOT EXISTS idx_participations_match_status ON participation_requests(match_id,status);
