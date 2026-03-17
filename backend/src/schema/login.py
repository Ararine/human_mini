from pydantic import BaseModel

class LoginRequest(BaseModel):
    username: str
    password: str

class PasswordChangeRequest(BaseModel):
    username: str
    old_password: str
    new_password: str