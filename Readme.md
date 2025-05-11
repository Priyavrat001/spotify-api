# 🎵 Spotify Web API Integration

This project is a Node.js Express server that integrates with the [Spotify Web API](https://developer.spotify.com/documentation/web-api/) to allow users to authenticate via Spotify and interact with their account — including playback control, viewing top tracks, searching songs, and more.

> ⚠️ **Important:** You must [log in](#get-login) first to access any of the protected routes like `/search`, `/play`, `/pause`, `/top-tracks`, or `/followed-artists`.  
Authenticate using your Spotify account by visiting the `/login` route.

---

## 🚀 Features

- OAuth2 login with Spotify
- Search for tracks
- Play or pause songs
- Get top 10 tracks of the user
- Show followed artists
- Refresh token handling

---

## 🧰 Technologies Used

- Node.js
- Express
- [spotify-web-api-node](https://github.com/thelinmichael/spotify-web-api-node)
- dotenv

---

## ⚙️ Setup Instructions

1. **Clone the repo:**

```bash
CLIENT_ID=your_spotify_client_id
CLIENT_SECRET=your_spotify_client_secret
REDIRECT_URL=http://localhost:3000/callback
You can get your Spotify credentials from the Spotify Developer Dashboard.

Start the server:

bash
Copy
Edit
nodemon index.js
The server will run at: http://localhost:3000

📡 API Endpoints
🔐 GET /login
Redirects the user to Spotify's login page to authorize access.

Required scopes:

user-read-private

user-read-email

user-read-playback-state

user-modify-playback-state

user-top-read

user-follow-read

🔁 GET /callback
Callback route for Spotify to redirect the user after authentication.

Exchanges the code for an access token and refresh token.

Sets up automatic access token refreshing.

Redirects user to / upon success.

🎧 GET /
Basic health check.

Response: "Spotify api working fine"

🔍 GET /search?q=<query>
Searches for tracks using a keyword.

Query Parameters:

q: the search keyword (e.g., q=Shape of You)

Response:

json
Copy
Edit
{
  "name": "Shape of You",
  "artist": "Ed Sheeran",
  "uri": "spotify:track:7qiZfU4dY1lWllzX7mPBI3",
  "preview_url": "https://p.scdn.co/mp3-preview/..."
}
▶️ GET /play?uri=<spotify_track_uri>
Starts playback of a given track.

Query Parameters:

uri: Spotify URI of the track to play (e.g., spotify:track:7qiZfU4dY1lWllzX7mPBI3)

Response: "playback started"

⏸️ GET /pause
Pauses the current playback.

Response: "Playback paused."

🔝 GET /top-tracks
Retrieves the top 10 tracks for the authenticated user.

Response:

json
Copy
Edit
[
  {
    "name": "Blinding Lights",
    "artist": "The Weeknd",
    "uri": "spotify:track:0VjIjW4GlUZAMYd2vXMi3b"
  },
  ...
]
👨‍🎤 GET /followed-artists
Returns a list of up to 20 artists the user follows.

Response:

json
Copy
Edit
[
  {
    "name": "Taylor Swift",
    "genres": ["pop", "country"],
    "url": "https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02"
  },
  ...
]
🔁 Token Refresh
The server automatically refreshes the access token before it expires using a timer (setInterval) configured in /callback.

📌 Notes
Make sure your Spotify app settings have the correct Redirect URI configured (same as REDIRECT_URL in .env).

Playback features (/play, /pause) require an active Spotify client (e.g., Spotify Desktop or Mobile app running on the same Spotify account).

🧑‍💻 Author
Priyavrat Kumar