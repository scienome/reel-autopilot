#!/usr/bin/env python3
"""Cartesia text-to-speech: one HTTP POST, the response body is the .wav file itself.

Usage: python3 tools/cartesia_tts.py "text to say" out.wav [--voice VOICE_ID] [--speed 1] [--volume 1]
The key is read from CARTESIA_API_KEY (environment, or a .env file in the repo root; .env is git-ignored,
on GitHub Actions use a repository secret of the same name)."""
import argparse, os, sys
import requests

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL = 'https://api.cartesia.ai/tts/bytes'
VERSION = '2026-08-14'
MODEL = 'sonic-3.6-2026-08-27'
VOICE = 'e85a2d3b-727a-48c5-95dd-ed89ef5e9f3c'


def api_key():
    if os.environ.get('CARTESIA_API_KEY'):
        return os.environ['CARTESIA_API_KEY']
    env = os.path.join(ROOT, '.env')
    if os.path.exists(env):
        for line in open(env):
            k, _, v = line.strip().partition('=')
            if k == 'CARTESIA_API_KEY':
                return v.strip().strip('"\'')
    sys.exit('CARTESIA_API_KEY is not set (environment or .env)')


def tts(text, out, voice=VOICE, speed=1, volume=1):
    body = {'model_id': MODEL, 'transcript': text, 'voice': voice,
            'output_format': {'container': 'wav', 'encoding': 'pcm_s16le', 'sample_rate': 44100},
            'generation_config': {'speed': speed, 'volume': volume}}
    r = requests.post(URL, headers={'Content-Type': 'application/json', 'X-API-Key': api_key(), 'Cartesia-Version': VERSION},
                      json=body, timeout=180)
    if r.status_code != 200:
        sys.exit(f'Cartesia {r.status_code}: {r.text[:300]}')
    with open(out, 'wb') as f:
        f.write(r.content)  # raw audio bytes, not JSON
    return out


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('text'); ap.add_argument('out')
    ap.add_argument('--voice', default=VOICE); ap.add_argument('--speed', type=float, default=1); ap.add_argument('--volume', type=float, default=1)
    a = ap.parse_args()
    print(tts(a.text, a.out, a.voice, a.speed, a.volume))
