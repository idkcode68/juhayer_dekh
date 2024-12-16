import pyotp
from app import db
from app.models import User
from datetime import datetime, timedelta

def generate_otp(user):
    # Generate a random secret key
    secret = pyotp.random_base32()
    totp = pyotp.TOTP(secret, interval=300)  # 5-minute validity
    otp = totp.now()
    
    # Store OTP details in database
    user.otp_secret = secret
    user.otp_valid_until = datetime.utcnow() + timedelta(minutes=5)
    db.session.commit()
    
    return otp

def verify_otp(user, otp):
    if not user.otp_secret or datetime.utcnow() > user.otp_valid_until:
        return False
    
    totp = pyotp.TOTP(user.otp_secret, interval=300)
    return totp.verify(otp)