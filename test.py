# chejiji_open_api_sign.py
import hashlib
import hmac
import json
import time
import uuid

import ssl
import urllib.request

import certifi

SSL_CONTEXT = ssl.create_default_context(cafile=certifi.where())

HEADER_APP_KEY = "X-App-Key"
HEADER_TIMESTAMP = "X-Timestamp"
HEADER_NONCE = "X-Nonce"
HEADER_SIGN = "X-Sign"

BASE_URL = "https://test.chejijipiche.com/sqx_fast"


def sha256_hex(content: str) -> str:
    return hashlib.sha256((content or "").encode("utf-8")).hexdigest()


def sign(app_key: str, app_secret: str, body: str, nonce: str, timestamp: str) -> str:
    body_hash = sha256_hex(body)
    string_to_sign = (
        f"appKey={app_key}&bodyHash={body_hash}&nonce={nonce}&timestamp={timestamp}"
    )
    a = hmac.new(
        app_secret.encode("utf-8"),
        string_to_sign.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
    print(a)
    print(body, nonce, timestamp)
    return a


def build_headers(app_key: str, app_secret: str, body: str) -> dict:
    timestamp = str(int(time.time() * 1000))
    nonce = uuid.uuid4().hex
    
    print({
        "Content-Type": "application/json",
        HEADER_APP_KEY: app_key,
        HEADER_TIMESTAMP: timestamp,
        HEADER_NONCE: nonce,
        HEADER_SIGN: sign(app_key, app_secret, body, nonce, timestamp),
    })
    return {
        "Content-Type": "application/json",
        HEADER_APP_KEY: app_key,
        HEADER_TIMESTAMP: timestamp,
        HEADER_NONCE: nonce,
        HEADER_SIGN: sign(app_key, app_secret, body, nonce, timestamp),
    }


def sync_friend_circle(app_key: str, app_secret: str, payload: dict) -> dict:
    """单条同步"""
    body = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    headers = build_headers(app_key, app_secret, body)
    req = urllib.request.Request(
        f"{BASE_URL}/open/trends/syncFriendCircle",
        data=body.encode("utf-8"),
        headers=headers,
    )
    with urllib.request.urlopen(req, timeout=30, context=SSL_CONTEXT) as resp:
        return json.loads(resp.read())


def sync_friend_circle_batch(app_key: str, app_secret: str, payload: list) -> dict:
    """批量同步，payload 为朋友圈列表"""
    body = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    headers = build_headers(app_key, app_secret, body)
    req = urllib.request.Request(
        f"{BASE_URL}/open/trends/syncFriendCircleBatch",
        data=body.encode("utf-8"),
        headers=headers,
    )
    with urllib.request.urlopen(req, timeout=30, context=SSL_CONTEXT) as resp:
        return json.loads(resp.read())


if __name__ == "__main__":
    app_key = "chejiji"
    app_secret = "8f3a2c1e9b7d4f6a5e0c3b8d1a7f4e2"

    result = sync_friend_circle(
        app_key,
        app_secret,
        {
            "wechatNo": "DeekeScript",
            "trendsContent": "嘀客出品必属精品[呲牙]",
            "trendsImage": "",
            "videoUrl": "https://jiangqiao-1252432685.cos.ap-shanghai.myqcloud.com/wechat-images/1781800682611.mp4",
            "publishTime": "2026-06-15 00:37:37",
        },
    )
    print(result)
