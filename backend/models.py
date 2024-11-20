from app import db
import datetime
import enum

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password_hash = db.Column(db.String(120), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.datetime.now(datetime.timezone.utc))

    def to_json(self):
        return{
            "id":self.id,
            "name":self.name,
            "email":self.email,
            "dateCreated":self.date_created
        }

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    date_time = db.Column(db.DateTime, nullable=False)
    location = db.Column(db.Text)
    rsvp_deadline = db.Column(db.DateTime)
    max_guests = db.Column(db.Integer)
    date_created = db.Column(db.DateTime, default=datetime.datetime.now(datetime.timezone.utc))

    def to_json(self):
        return{
            "id":self.id,
            "creatorId":self.creator_id,
            "title":self.title,
            "description":self.description,
            "dateTime":self.date_time,
            "location":self.location,
            "rsvpDeadline":self.rsvp_deadline,
            "maxGuests":self.max_guests,
            "dateCreated":self.date_created
        }
    
class Response(enum.Enum):
    yes = "yes"
    no = "no"
    maybe = "maybe"
    
class RSVP(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    guest_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True) # Nullable for non-registered guests
    guest_name = db.Column(db.String(200), nullable=False)
    response = db.Column(db.Enum(Response), nullable=False)
    comment = db.Column(db.Text)
    date_responded = db.Column(db.DateTime, default=datetime.datetime.now(datetime.timezone.utc))

    def to_json(self):
        return {
            "id": self.id,
            "eventId": self.event_id,
            "guestId": self.guest_id,
            "guestName": self.guest_name,
            "response": self.response.value,
            "comment": self.comment,
            "dateResponded": self.date_responded
        }