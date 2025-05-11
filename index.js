import express from 'express';
import SpotifyWebApi from 'spotify-web-api-node';
import dotenv from "dotenv";

dotenv.config({});

const app = express();
const PORT = 3000;

app.use(express.json());


const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    redirectUri: process.env.REDIRECT_URL
})

app.get('/login', (req, res) => {
    const scopes = [
  "user-read-private",
  "user-read-email",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-top-read",
  "user-follow-read"
];

    res.redirect(spotifyApi.createAuthorizeURL(scopes));
});


app.get("/callback", (req, res) => {
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;

    if (error) {
        res.send(error);
        console.error(error);
        return;
    }

    spotifyApi.authorizationCodeGrant(code).then((data) => {
        const accessToken = data.body.access_token;
        const refreshToken = data.body.refresh_token;
        const expiresIn = data.body.expires_in;

        spotifyApi.setAccessToken(accessToken);
        spotifyApi.setRefreshToken(refreshToken);

        console.log(accessToken, refreshToken);

        res.send("Success");

        setInterval(async () => {
            const data = await spotifyApi.refreshAccessToken();
            const accessTokenRef = data.body.access_token;
            spotifyApi.setAccessToken(accessTokenRef);
        }, expiresIn / 2 * 1000);

    }).catch(error => {
        console.error({ "Error": error });

        res.send("Error getting the token");
    });
});

app.get("/search", async(req, res) => {
    const { q } = req.query;

  if (!q) {
    return res.status(400).send("Missing search query `q`");
  }

  try {
    // Make sure the access token is still valid
    const searchResult = await spotifyApi.searchTracks(q);

    if (
      !searchResult.body.tracks ||
      !searchResult.body.tracks.items.length
    ) {
      return res.status(404).send("No tracks found");
    }

    const firstTrack = searchResult.body.tracks.items[0];
    return res.send({
      name: firstTrack.name,
      artist: firstTrack.artists.map((a) => a.name).join(", "),
      uri: firstTrack.uri,
      preview_url: firstTrack.preview_url,
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).send("Error searching Spotify: " + error.message);
  }
});


app.get("/play", (req, res) => {
    const { uri } = req.query;

    spotifyApi.play({ uris: [uri] }).then(() => {
        res.send("playback started");
    }).catch((error) => {
        res.send("Error playing")
        console.log(error)
    })
});

app.get("/followed-artists", async (req, res) => {
  try {
    const data = await spotifyApi.getFollowedArtists({ limit: 20 });
    const artists = data.body.artists.items.map(artist => ({
      name: artist.name,
      genres: artist.genres,
      url: artist.external_urls.spotify,
    }));
    res.json(artists);
  } catch (error) {
    console.error("Error fetching followed artists:", error);
    res.status(500).send("Failed to fetch followed artists.");
  }
});

app.get("/pause", async (req, res) => {
  try {
    await spotifyApi.pause();
    res.send("Playback paused.");
  } catch (error) {
    console.error("Error pausing playback:", error);
    res.status(500).send("Failed to pause playback.");
  }
});


app.get("/top-tracks", async (req, res) => {
  try {
    const data = await spotifyApi.getMyTopTracks({ limit: 10 });
    const tracks = data.body.items.map(track => ({
      name: track.name,
      artist: track.artists.map(a => a.name).join(", "),
      uri: track.uri,
    }));
    res.json(tracks);
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    res.status(500).send("Failed to fetch top tracks.");
  }
});


app.get("/", (req, res) => {
    res.send("Spotify api working fine")
})

app.listen(PORT, () => {
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
});
