import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";

const userEndpoint = "https://api.spotify.com/v1/me";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const session = await getServerSession(req, res, authOptions);
      if (session && session.accessToken) {
        const userResponse = await fetch(userEndpoint, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        if (!userResponse.ok)
          return res
            .status(userResponse.status)
            .json(await userResponse.json());

        const user = await userResponse.json();

        const body = JSON.parse(req.body);

        const createPlaylistResponse = await createPlaylist(
          session.accessToken,
          user.id,
          body.name
        );

        if (!createPlaylistResponse.ok)
          return res
            .status(createPlaylistResponse.status)
            .json(await createPlaylistResponse.json());

        const responseJSON = await createPlaylistResponse.json();

        return res.status(200).json({ id: responseJSON.id });
      } else {
        return res.status(401).json({ error: "Unauthorized" });
      }
    } else {
      res.setHeader("Allow", ["POST"]);
      return res
        .status(405)
        .json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

async function createPlaylist(accessToken, userId, name) {
  const playlistTracksEndpoint = `https://api.spotify.com/v1/users/${userId}/playlists`;

  return fetch(playlistTracksEndpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      public: false,
    }),
  });
}
