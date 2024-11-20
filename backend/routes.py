from app import app, db
from flask import request, jsonify
from models import User, Event, RSVP, Response
import bcrypt
from datetime import datetime

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
def update_user(id):
    try:
        user = User.query.get(id)
        if user is None:
            return jsonify({"error":"User not found"}), 404
        
        data = request.json
        user.name = data.get("name", user.name)
        user.email = data.get("email", user.email)
        user.password_hash = data.get("password", user.password_hash)

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
@app.route("/api/events/<int:user_id>", methods=["GET"])
def get_user_events(user_id):
    events = Event.query.filter_by(user_id=user_id).all()
    if events is None:
        return jsonify({"error":"Event not found"}), 404
    result = [event.to_json() for event in events]
    return jsonify(result)

# Create an event
@app.route("/api/events", methods=["POST"])
def creat_event():
    try:
        data = request.json

        required = ["creatorId", "title", "dateTime"]
        for field in required:
            if field not in data:
                return jsonify({"error": f"Missing required field {field}"})
            
        try:
            date_time = datetime.strptime(data["dateTime"], "%Y-%m-%d %H:%M:%S")
        except ValueError:
            return jsonify({"error":"Invalid date format"}), 400
        
        new_event = Event(
            creator_id=data["creatorId"],
            title=data["title"],
            description=data.get("description"),
            date_time=date_time,
            location=data.get("location"),
            rsvp_deadline=data.get("rsvpDeadline"),
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

        if "dateTime" in data:
            try:
                date_time = datetime.strptime(data["dateTime"], "%Y-%m-%d %H:%M:%S")
            except ValueError:
                return jsonify({"error":"Invalid date format"}), 400
            
        event.title = data.get("title", event.title)
        event.description = data.get("description", event.description)
        event.date_time = data.get(date_time, event.date_time)
        event.location = data.get("location", event.location)
        event.rsvp_deadline = data.get("rsvpDeadline", event.rsvp_deadline)
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
@app.route("/api/rsvps/user/<int:user_id>", methods=["GET"])
def get_user_rsvps(user_id):
        rsvps = RSVP.query.filter_by(guest_id=user_id).all()
        if not rsvps:
            return jsonify({"message":"No RSVPs found for this user"}), 404
        result = [rsvp.to_json() for rsvp in rsvps]
        return jsonify(result), 200

# Get RSVP summary for an event, counts for each response
@app.route("/api/rsvps/event/<int:event_id>/summary", methods=["GET"])
def get_event_rsvp_summary(event_id):
    rsvps = RSVP.query.filter_by(event_id=event_id).all()
    if not rsvps:
        return jsonify({"message":"No RSVPs found for that event"}), 404
    
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
            if field not in data:
                return jsonify({"error":f"Missing required field"}), 400

        response_value = data["response"].lower()
        if response_value not in Response.__members__:
                return jsonify({"error": f"Invalid response: {response_value}"}), 400
        
        new_rsvp = RSVP(
            event_id=data["eventId"],
            guest_id=data.get("guestId"),
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
def update_rsvp(id):
    try:
        rsvp = RSVP.query.get(id)
        if rsvp is None:
            return jsonify({"error":"Event not found"}),404
        
        data = request.json
        if "response" in data:
            response_value = data["response"].lower()
            if response_value is not None:
                if response_value not in Response.__members__:
                    return jsonify({"error": f"Invalid response: {response_value}"}), 400
                rsvp.response = Response[response_value]
        
        rsvp.guest_id = data.get("guestId", rsvp.guest_id)
        rsvp.guestName = data.get("guestName", rsvp.guest_id)
        rsvp.comment = data.get("comment", rsvp.comment)

        db.session.commit()
        return jsonify({"RSVP updated successfully":rsvp.to_json()}), 200
    except Exception as e:
        db.session.rollback()
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
