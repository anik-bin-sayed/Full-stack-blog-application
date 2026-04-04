from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt, JWTError
import hashlib
import bcrypt
import jwt


_BCRYPT_ROUNDS = 12
blacklist = set()

SECRET_KEY = "your-secret"
REFRESH_SECRET_KEY = "REFRESH_SECRET_KEY_CHANGE_THIS"
ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def _sha256_hexdigest_bytes(password: str) -> bytes:
    return hashlib.sha256(password.encode()).hexdigest().encode()


def get_password_hash(password: str) -> str:
    prehashed = _sha256_hexdigest_bytes(password)
    salt = bcrypt.gensalt(rounds=_BCRYPT_ROUNDS)
    hashed = bcrypt.hashpw(prehashed, salt)

    return hashed.decode()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    prehashed = _sha256_hexdigest_bytes(plain_password)
    try:
        return bcrypt.checkpw(prehashed, hashed_password.encode())
    except ValueError:
        return False


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, REFRESH_SECRET_KEY, algorithm=ALGORITHM)


def verify_token(token: str, refresh: bool = False):
    try:
        key = REFRESH_SECRET_KEY if refresh else SECRET_KEY
        payload = jwt.decode(token, key, algorithms=[ALGORITHM])
        if payload.get("jti") in blacklist:
            return None
        return payload
    except:
        return None


def verify_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError as e:
        return {"error": str(e)}
