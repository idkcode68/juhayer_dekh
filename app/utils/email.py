from flask_mail import Message
from app import mail, app
from flask import url_for
import jwt
from datetime import datetime, timedelta

def send_verification_email(user):
    token = generate_verification_token(user.email)
    msg = Message(
        'Verify Your Email',
        sender='noreply@auctionhub.com',
        recipients=[user.email]
    )
    
    msg.body = f'''To verify your email, visit the following link:
{url_for('verify_email', token=token, _external=True)}

If you did not make this request then simply ignore this email.
'''
    mail.send(msg)

def send_reset_password_email(user):
    token = generate_reset_token(user.email)
    msg = Message(
        'Password Reset Request',
        sender='noreply@tradehubx.com',
        recipients=[user.email]
    )
    
    msg.body = f'''To reset your password, visit the following link:
{url_for('reset_password', token=token, _external=True)}

If you did not make this request then simply ignore this email.
'''
    mail.send(msg)

def generate_verification_token(email):
    return jwt.encode(
        {'email': email, 'exp': datetime.utcnow() + timedelta(hours=24)},
        app.config['SECRET_KEY'],
        algorithm='HS256'
    )

def generate_reset_token(email):
    return jwt.encode(
        {'email': email, 'exp': datetime.utcnow() + timedelta(hours=1)},
        app.config['SECRET_KEY'],
        algorithm='HS256'
    )
