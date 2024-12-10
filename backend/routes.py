from app import app, db
from flask import request, jsonify, session, make_response
from functools import wraps
from models import User, Event, RSVP, Response
import bcrypt
from datetime import datetime

#region Auth

# Login
@app.route("/api/auth/login", methods=["POST"])
def login():
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error":"Email and password required"}), 400
        
        user = User.query.filter_by(email=email).first()
        if not user or not bcrypt.checkpw(password.encode("utf-8"), user.password_hash):
            return jsonify({"error":"Invalid email or password"}), 401
        
        session["user_id"] = user.id
        return jsonify({"message":"Login successful", "user":user.to_json()})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get Current User
@app.route("/api/auth/me", methods=["GET"])
def current_user():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error":"Not authenticated"}), 401
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error":"User not found"}), 404
    
    return jsonify({"user":user.to_json()}), 200

# Logout
@app.route("/api/auth/logout", methods=["POST"])
def logout():
    session.pop("user_id", None)
    return jsonify({"message":"Logout successful"}), 200

def login_required(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        user_id = session.get("user_id")
        if not user_id:
            return jsonify({"error":"Authentication required"}), 401
        return func(*args, **kwargs)
    return decorated_function

#endregion

#region Users

# Get all users
@app.route("/api/users",methods=["GET"])
def get_users():
    users = User.query.all()
    result = [user.to_json() for user in users]
    return jsonify(result)

# Create a user
@app.route("/api/users",methods=["POST"])
def create_user():
    try:
        data = request.json

        required = ["name","email","password"]
        for field in required:
            if field not in data:
                return jsonify({"error":f"Missing required field: {field}"}), 400

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({"error": "Email already in use"}), 400

        new_user = User(name=name, email=email, password_hash=hashed)
        db.session.add(new_user)
        db.session.commit()
        return jsonify(new_user.to_json()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"An unexpected error occurred":str(e)}), 500

# Update a user
@app.route("/api/users/<int:id>", methods=["PATCH"])
@login_required
def update_user(id):
    try:
        user = User.query.get(id)
        if user is None:
            return jsonify({"error":"User not found"}), 404
        if user.id is not session["user_id"]:
            return jsonify({"error":"User doesnt match authenticated user"}), 400
        
        data = request.json
        password_current = data.get("passwordCurrent")
        name_new = data.get("name", user.name)
        email_new = data.get("email", user.email)

        if not name_new or name_new == "":
            return jsonify({"error":"Name cannot be blank"}), 400
        if not email_new or email_new == "":
            return jsonify({"error":"Email cannot be blank"}), 400
        if not bcrypt.checkpw(password_current.encode("utf-8"), user.password_hash):
            return jsonify({"error":"Invalid current password"}), 401
        
        user.name = name_new
        user.email = email_new
        user.password_hash = data.get("passwordNew", user.password_hash)

        db.session.commit()
        return jsonify({"User updated successfully":user.to_json()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error":str(e)}), 500
    
# Delete a user
@app.route("/api/users/<int:id>", methods=["DELETE"])
def delete_user(id):
    try:
        user = User.query.get(id)
        if user is None:
            return jsonify({"error":"User not found"}), 404
        
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message":"User deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error":str(e)}), 500
    
#endregion

#region Events

# Get all events
@app.route("/api/events", methods=["GET"])
def get_events():
    events = Event.query.all()
    result = [event.to_json() for event in events]
    return jsonify(result)

# Get event by event ID
@app.route("/api/events/<int:id>", methods=["GET"])
def get_event(id):
    event = Event.query.get(id)
    if event is None:
        return jsonify({"error":"Event not found"}), 404
    return jsonify(event.to_json())

# Get all events by user ID
@app.route("/api/events/user/<int:user_id>", methods=["GET"])
def get_user_events(user_id):
    events = Event.query.filter_by(creator_id=user_id).all()
    if events is None:
        return jsonify({"error":"Event not found"}), 404
    
    results = []
    for event in events:
        rsvps = RSVP.query.filter_by(event_id=event.id).all()
        summary = {
            "yes": sum(1 for rsvp in rsvps if rsvp.response == Response.yes),
            "no": sum(1 for rsvp in rsvps if rsvp.response == Response.no),
            "maybe": sum(1 for rsvp in rsvps if rsvp.response == Response.maybe)
        }
        event_json = event.to_json()
        event_json["rsvpSummary"] = summary
        results.append(event_json)

    return jsonify(results)

# Create an event
@app.route("/api/events", methods=["POST"])
@login_required
def creat_event():
    try:
        data = request.json
        
        # Check for required fields
        required = ["title", "dateTime"]
        for field in required:
            if field not in data:
                return jsonify({"error": f"Missing required field {field}"}),400

        # Validate datetime format
        try:
            date_time = datetime.fromisoformat(data["dateTime"])
        except ValueError:
            return jsonify({"error":"Invalid date format"}), 400
        
        # Validate RSVP Deadline datetime format
        rsvp_deadline = None
        if "rsvpDeadline" in data and data["rsvpDeadline"]:
            try:
                rsvp_deadline = datetime.fromisoformat(data["rsvpDeadline"])
            except ValueError:
                return jsonify({"error":"Invalid RSVP deadline format"}), 400
        
        new_event = Event(
            creator_id=session["user_id"],
            title=data["title"],
            description=data.get("description"),
            date_time=date_time,
            location=data.get("location"),
            rsvp_deadline=rsvp_deadline,
            max_guests=data.get("maxGuests"),
        )
        db.session.add(new_event)
        db.session.commit()
        return jsonify(new_event.to_json()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
# Update an event
@app.route("/api/events/<int:id>", methods=["PATCH"])
def update_event(id):
    try:
        event = Event.query.get(id)
        if event is None:
            return jsonify({"error":"Event not found"}),404
        
        data = request.json

        # Check for required fields
        required = ["title", "dateTime"]
        for field in required:
            if field not in data:
                return jsonify({"error": f"Missing required field {field}"}),400
        if data["title"] == "":
            return jsonify({"error": "Title field cannot be blank"}), 400

        # Validate datetime format
        try:
            date_time = datetime.fromisoformat(data["dateTime"])
        except ValueError:
            return jsonify({"error":"Invalid date format"}), 400
        
        # Validate RSVP Deadline datetime format
        rsvp_deadline = None
        if "rsvpDeadline" in data and data["rsvpDeadline"]:
            try:
                rsvp_deadline = datetime.fromisoformat(data["rsvpDeadline"])
            except ValueError:
                return jsonify({"error":"Invalid RSVP deadline format"}), 400
            
        event.title = data.get("title", event.title)
        event.description = data.get("description", event.description)
        date_time=date_time
        event.location = data.get("location", event.location)
        rsvp_deadline=rsvp_deadline
        event.max_guests = data.get("maxGuests", event.max_guests)

        db.session.commit()
        return jsonify({"Event updated successfully":event.to_json()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
# Delete an event
@app.route("/api/events/<int:id>", methods=["DELETE"])
def delete_event(id):
    try:
        event = Event.query.get(id)
        if event is None:
            return jsonify({"error":"Event not found"}), 404
        
        # delete all the rsvps for this event
        rsvps = RSVP.query.filter_by(event_id=id).all()
        for rsvp in rsvps:
            db.session.delete(rsvp)
        
        db.session.delete(event)
        db.session.commit()
        return jsonify({"message":"Event delete"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
#endregion

#region RSVP

# Get all RSVPs
@app.route("/api/rsvps", methods=["GET"])
def get_all_rsvps():
    rsvps = RSVP.query.all()
    result = [rsvp.to_json() for rsvp in rsvps]
    return jsonify(result)

# Get all RSVPs by event ID
@app.route("/api/rsvps/event/<int:event_id>", methods=["GET"])
def get_event_rsvps(event_id):
    rsvps = RSVP.query.filter_by(event_id=event_id).all()
    result = [rsvp.to_json() for rsvp in rsvps]
    return jsonify(result)

# Get all RSVPs for a specific user
@app.route("/api/rsvps/user", methods=["GET"])
@login_required
def get_user_rsvps():
    user_id=session["user_id"]
    if not user_id:
        return jsonify({"error":"Unauthorized"}), 401
    try:
        rsvps = RSVP.query.filter_by(guest_id=user_id).all()
        result = []
        for rsvp in rsvps:
            event = Event.query.filter_by(id=rsvp.event_id).first()
            if not event:
                continue
            
            rsvpInfo = { # combine RSVP and Event data
                "id": rsvp.id,
                "title": event.title,
                "date": event.date_time.isoformat(),
                "response": rsvp.response.value,
                "comment": rsvp.comment,
                "eventId": event.id
            }
            result.append(rsvpInfo)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error":"Internal Server Error"}), 500

# Get user's RSVP for specific event
@app.route("/api/rsvps/event/<int:event_id>/user", methods=["GET"])
@login_required
def get_user_rsvp_for_event(event_id):
    user_id=session["user_id"]
    if not user_id:
        return jsonify({"error":"Unauthorized"}), 401
    try:
        rsvp = RSVP.query.filter_by(guest_id=user_id, event_id=event_id).first()
        if not rsvp:
            return '', 204
        return jsonify(rsvp.to_json()), 200
    except Exception as e:
        app.logger.error(f"Error fetching RSVPs: {str(e)}")
        return jsonify({"error":"Internal Server Error"}), 500

# Get RSVP summary for an event, counts for each response
@app.route("/api/rsvps/event/<int:event_id>/summary", methods=["GET"])
def get_event_rsvp_summary(event_id):
    rsvps = RSVP.query.filter_by(event_id=event_id).all()
    
    summary = {
        "yes": sum(1 for rsvp in rsvps if rsvp.response == Response.yes),
        "no": sum(1 for rsvp in rsvps if rsvp.response == Response.no),
        "maybe": sum(1 for rsvp in rsvps if rsvp.response == Response.maybe)
    }
    return jsonify(summary), 200

# Create an RSVP
@app.route("/api/rsvps", methods=["POST"])
def create_rsvp():
    try:
        data = request.json

        required = ["eventId", "response", "guestName"]
        for field in required:
            if not data.get(field):
                return jsonify({"error":f"Missing required field {field}"}), 400

        response_value = data["response"].lower()
        if response_value not in Response.__members__:
                return jsonify({"error": f"Invalid response: {response_value}"}), 400
        
        guest_id = None
        if "user_id" in session:
            guest_id = session["user_id"]

        new_rsvp = RSVP(
            event_id=data["eventId"],
            guest_id=guest_id,
            guest_name=data.get("guestName"),
            response=Response[response_value],
            comment=data.get("comment"),
        )
        db.session.add(new_rsvp)
        db.session.commit()
        return jsonify(new_rsvp.to_json()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Update an RSVP
@app.route("/api/rsvps/<int:id>", methods=["PATCH"])
@login_required
def update_rsvp(id):
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error":"Unauthorized"}), 401
    
    try:
        rsvp = RSVP.query.get(id)
        if not RSVP:
            return jsonify({"error":"RSVP not found"}), 404
        
        data = request.json
        if "response" in data:
            response_value = data["response"].lower()
            if response_value is not None:
                if response_value not in Response.__members__:
                    return jsonify({"error": f"Invalid response: {response_value}"}), 400
                rsvp.response = Response[response_value]

        rsvp.guest_id = user_id
        rsvp.guestName = data.get("guestName", rsvp.guest_id)
        rsvp.comment = data.get("comment", rsvp.comment)

        db.session.commit()
        return jsonify(rsvp.to_json()), 200
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error fetching RSVPs: {str(e)}")
        return jsonify({"error": str(e)}), 500
    
@app.route("/api/rsvps/<int:id>/capture", methods=["PATCH"])
@login_required
def rsvp_capture(id):
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({"error":"Unauthorized"}), 401
    
    try:
        rsvp = RSVP.query.get(id)
        if not RSVP:
            return jsonify({"error":"RSVP not found"}), 404
        
        rsvp.guest_id = user_id

        db.session.commit()
        return jsonify(rsvp.to_json()), 200
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error capturing RSVP: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Delete an RSVP
@app.route("/api/rsvp/<int:id>", methods=["DELETE"])
def delete_rsvp(id):
    try:
        rsvp = RSVP.query.get(id)
        if rsvp is None:
            return jsonify({"error":"RSVP not found"}), 404
        
        db.session.delete(rsvp)
        db.session.commit()
        return jsonify({"message":"RSVP delete"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

#endregion
