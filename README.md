# RSEZ
Lightweight RSVP app that focuses on simplicity and accessibility.

RSEZ makes it easy for event organizers to share their events and for guests to RSVP without barriers. The goal is to minimize friction so people can quickly and easily respond to an invitation.

I was inspired to make this tool by the realization that many event platforms, like social media sites, rely on users being a part of their ecosystem to participate. After stepping away from one of the largest social media platforms, I saw how much I depended on it to learn about my friend's events. 

This app embraces accessibility and openness. Event organizers are the only ones who are required to make an account. Guests can RSVP without an account, and if they choose to create an account later, their RSVP will be linked automatically. With RSEZ, everyone can participate seamlessly.


![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)

## Key Features

1. Event Creation and Sharing
    - Organizers can manage events, tracks RSVPs, and generate a sharable link for easy invites
    - "Add to Calendar" and "Open in Maps" hooks into expected functionality

2. Guest RSVP and Account Linking
    - Guests can RSVP without being logged in
    - If they login later, their RSVP seamlessly links to their profile

3. Polished Design
    - Responsive design provides seamless experience on any platform
    - Loading pages gracefully handle asynchronous requests by showing skeleton components

<p float="left">
    <img src="app-captures/event-rsvp-to-sign-up-cropped.gif" alt="RSVP to sign up gif" height="550"/>
    <img src="app-captures/mobile-event-view-to-profile.gif" alt="RSVP to sign up gif" height="550"/>
</p>

## Tech Stack

### Frontend 

- **React**: creates a responsive and dynamic frontend, by taking advantage of State and Context.  
- **Next.js**: handles routing and server side rendering  
- **Javascript**: uses JSX extension to integrate **HTML**. Using **CSS** for styling  

### Backend

- **Flask**: helped create an API backend that handles authentication and database interactions.  
- **SQLAlchemy**: does object relational mapping. Running **SQLite** for development.  
- **Python**: to write the api and database models  

### Outside Tools

VS Code  
Node.js  
[Krita](https://krita.org/en/) to edit the app logo  
[Gradient Generator](https://www.joshwcomeau.com/gradient-generator/) for the css [gradient](https://github.com/skylarbeaty/Easy-RSVP/blob/main/frontend/styles/globals.css?plain=1#L64)  
[Iconfinder](https://www.iconfinder.com/) for the corporate logos in svg format  
[ScreenToGif](https://www.screentogif.com/) for making the gifs on this page

## Highlights

1. **Backend Capture of Guest RSVP**  
Once someone logs in after leaving a guest RSVP, the id of the RSVP is sent to this route. It uses session information to get the logged in user's id to update the RSVP.

```python
# capture guest RSVP after login
@app.route("/api/rsvps/<int:id>/capture", methods=["PATCH"])
@login_required
def rsvp_capture(id):
    user_id = session.get("user_id")
    
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

# function decorator for routes requiring login
def login_required(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        user_id = session.get("user_id")
        if not user_id:
            return jsonify({"error":"Authentication required"}), 401
        return func(*args, **kwargs)
    return decorated_function
```

2. **Frontend Data Fetching with Context**  
This is a snippet from [App Wrapper](frontend/components/AppWrapper.jsx) demonstrating use of React hooks and context to manage user state across the app
```javascript
const UserContext = React.createContext();
// ...
export function useUser (){
    return useContext(UserContext);
}
// ...
const AppWrapper = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() =>{
        async function fetchUser() {
            try{
                // attempt to login
                const res = await api.get("/auth/me");
                setUser(res.user);

                // handle guest RSVPs after next login/signup
                const guestRsvpId = localStorage.getItem("guest_rsvp_id");
                if (guestRsvpId && res.user){
                    await api.patch(`/rsvps/${guestRsvpId}/capture`);
                    localStorage.removeItem("guest_rsvp_id");
                }
            } catch (error){
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value = {user}>
            <UserUpdateContext.Provider value = {setUser}>
                <UserLoadingContext.Provider value = {loading}>
                    {children}
                </UserLoadingContext.Provider>
            </UserUpdateContext.Provider>
        </UserContext.Provider>
    )
}
```

## Possible Improvements

In order to ready this app for production there would need to be a few more steps  
- Replace SQLite with something like PostgreSQL, to scale to larger datasets
- Add security features like rate limiting and stricter session management  
- Add unit and integration testing to ensure stability  
- Password recovery and account deletion would ensure a complete user experience

Additionally there are some features I would really love to add to this project
- Interactive event creation page with a live preview of how the event page looks
- Rich text options to allow for styled text and links (with appropriate warning when leaving the app)   
- Integrated map to show event location without leaving the page

## Run it yourself
### Backend Setup
#### 1. Clone the repository:
```bash
git clone https://github.com/skylarbeaty/Easy-RSVP.git
```
#### 2. Create a virtual environment:
```bash
cd Easy-RSVP/backend
python -m venv venv
venv\Scripts\activate #on windows
```
#### 3. Install dependencies:
```bash
pip install -r requirements.txt
```
#### 4. Create .env file:
Create a file in the backend called ".env" and add this line.
```bash
FLASK_SECRET_KEY=your_key_here
```
Replace "your_key_here" with a secure and random string
#### 5. Run the server:
```bash
flask run
```
*This project is currently setup for development.*  
The database will be automatically setup when you run the app.
### Frontend Setup
#### 1. Install dependencies:
```bash
cd Easy-RSVP/frontend
npm install
```
#### 2. Start the server
```bash
npm run
```
#### 3. View the site
Follow the link in the console to view the site.  
It should be visible at [localhost:3000](http://localhost:3000)
