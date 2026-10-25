"""Read-only proximity API example. Authentication and write endpoints are intentionally NOT implemented."""
import os
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from psycopg.rows import dict_row
import psycopg

app = FastAPI(title='Bora - API geoespacial (exemplo)')
origins = [x.strip() for x in os.getenv('ALLOWED_ORIGINS','').split(',') if x.strip()]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_methods=['GET'], allow_headers=['*'])

def get_conn():
    dsn=os.getenv('DATABASE_URL')
    if not dsn: raise HTTPException(503, 'DATABASE_URL não configurada')
    return psycopg.connect(dsn, row_factory=dict_row)

@app.get('/health')
def health(): return {'status':'ok'}

@app.get('/nearby/matches')
def nearby_matches(lat:float=Query(ge=-90,le=90),lon:float=Query(ge=-180,le=180),radius_km:float=Query(10,gt=0,le=100),sport:str|None=None,limit:int=Query(30,ge=1,le=100)):
    sql='''SELECT m.id::text, m.sport, m.starts_at, m.place_name, m.capacity,
             ST_Distance(m.place_point,ST_SetSRID(ST_MakePoint(%(lon)s,%(lat)s),4326)::geography) AS distance_m
      FROM matches m
      WHERE m.status='open' AND m.starts_at > now() AND m.place_point IS NOT NULL
      AND ST_DWithin(m.place_point,ST_SetSRID(ST_MakePoint(%(lon)s,%(lat)s),4326)::geography,%(radius)s)
      AND (%(sport)s::text IS NULL OR m.sport=%(sport)s)
      ORDER BY distance_m ASC LIMIT %(limit)s'''
    with get_conn() as c, c.cursor() as cur:
        cur.execute(sql,dict(lat=lat,lon=lon,radius=radius_km*1000,sport=sport,limit=limit))
        return cur.fetchall()

@app.get('/nearby/players')
def nearby_players(lat:float=Query(ge=-90,le=90),lon:float=Query(ge=-180,le=180),radius_km:float=Query(10,gt=0,le=100),sport:str|None=None,limit:int=Query(30,ge=1,le=100)):
    # Do not return precise user coordinates or exact distances.
    sql='''SELECT id::text, display_name, sport, public_bio FROM players
      WHERE visible_in_search AND reference_point IS NOT NULL
      AND ST_DWithin(reference_point,ST_SetSRID(ST_MakePoint(%(lon)s,%(lat)s),4326)::geography,%(radius)s)
      AND (%(sport)s::text IS NULL OR sport=%(sport)s) LIMIT %(limit)s'''
    with get_conn() as c, c.cursor() as cur:
        cur.execute(sql,dict(lat=lat,lon=lon,radius=radius_km*1000,sport=sport,limit=limit))
        return cur.fetchall()
