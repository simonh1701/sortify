import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const session = await getServerSession(req, res, authOptions);
      if (session && session.accessToken) {
        const id = req.query.id;

        if (id === "undefined" || id === "null")
          return res.status(404).json({ error: "Invalid playlist Id" });

        let playlistTracksEndpoint = `https://api.spotify.com/v1/playlists/${id}/tracks?limit=50&fields=next,items(track(album(id,images,name,release_date,release_date_precision),artists,duration_ms,id,name,popularity,preview_url,uri))`;

        let allItems = [];

        do {
          const playlistTracksResponse = await fetch(playlistTracksEndpoint, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });

          if (!playlistTracksResponse.ok)
            return res
              .status(playlistTracksResponse.status)
              .json(await playlistTracksResponse.json());

          const playlistTracks = await playlistTracksResponse.json();

          const tracks = playlistTracks?.items;

          allItems.push(...tracks);
          playlistTracksEndpoint = playlistTracks?.next;
        } while (playlistTracksEndpoint);

        const playlistEndpoint = `https://api.spotify.com/v1/playlists/${id}`;

        const playlistResponse = await fetch(playlistEndpoint, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        const playlist = await playlistResponse.json();

        delete playlist.tracks;

        return res.status(200).json({
          ...playlist,
          items: allItems.map((item, index) => ({ ...item, index })),
        });
      } else {
        return res.status(401).json({ error: "Unauthorized" });
      }
    } else {
      res.setHeader("Allow", ["GET"]);
      return res
        .status(405)
        .json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
