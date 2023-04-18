import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    if (req.method === "PUT") {
      const session = await getServerSession(req, res, authOptions);

      if (session && session.accessToken) {
        const id = req.query.id;

        const clearPlaylistResponse = await clearPlaylist(
          session.accessToken,
          id
        );

        if (!clearPlaylistResponse.ok)
          return res
            .status(clearPlaylistResponse.status)
            .json(await clearPlaylistResponse.json());

        const playlistTracksEndpoint = `https://api.spotify.com/v1/playlists/${id}/tracks`;

        const body = JSON.parse(req.body);

        let remaining_uris = body.uris.filter(
          (uri) => !uri.startsWith("spotify:local:")
        );

        while (remaining_uris.length > 0) {
          const uris = remaining_uris.slice(0, 100);
          remaining_uris = remaining_uris.slice(100);

          const addItemsToPlaylistResponse = await fetch(
            playlistTracksEndpoint,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${session.accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ uris: uris }),
            }
          );

          if (!addItemsToPlaylistResponse.ok)
            return res
              .status(addItemsToPlaylistResponse.status)
              .json(await addItemsToPlaylistResponse.json());
        }

        return res.status(200).json({ messsage: "Sucess" });
      } else {
        return res.status(401).json({ error: "Unauthorized" });
      }
    } else {
      res.setHeader("Allow", ["PUT"]);
      return res
        .status(405)
        .json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

async function clearPlaylist(accessToken, id) {
  const playlistTracksEndpoint = `https://api.spotify.com/v1/playlists/${id}/tracks`;

  return fetch(playlistTracksEndpoint, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      uris: [],
    }),
  });
}
