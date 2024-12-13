# Easy-RSVP
 Lightweight RSVP app using Flask and React

## Run it yourself
### Backend Setup
#### 1. Clone the repository:
```bash
git clone https://github.com/skylarbeaty/Easy-RSVP.git
```
#### 2. Create a virtual envirnment:
```bash
cd Easy-RSVP/backend
python -m venv venv
venv\Scripts\activate #on windows
```
#### 3. Install dependancies:
```bash
pip install -r requirements.txt
```
#### 4. Create .env file:
Create a file in the back called ".env" and add this line.
```bash
FLASK_SECRET_KEY=your_key_here
```
Replace "your_key_here" with a secure and random string
#### 5. Run the server:
```bash
flask run
```
This project is still setup for development. \
The database will be automatically setup when you run the app.
### Frontend Setup
#### 1. Install dependancies:
```bash
cd Easy-RSVP/frontend
npm install
```
#### 2. Start the server
```bash
npm run
```
