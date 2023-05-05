import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const session = await getServerSession(req, res, authOptions);
      if (session && session.accessToken) {
        let playlistsEndpoint = `https://api.spotify.com/v1/me/playlists?limit=50`;

        let allPlaylists = [];

        do {
          const playlistsResponse = await fetch(playlistsEndpoint, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });

          if (!playlistsResponse.ok)
            return res
              .status(playlistsResponse.status)
              .json(await playlistsResponse.json());

          const playlists = await playlistsResponse.json();

          const playlistsItems = playlists.items;

          playlistsItems.forEach((playlist) => {
            delete playlist.collaborative;
            delete playlist.external_urls;
            delete playlist.href;
            delete playlist.owner?.external_urls;
            delete playlist.owner?.followers;
            delete playlist.owner?.href;
            delete playlist.owner?.type;
            delete playlist.owner?.uri;
            delete playlist.primary_color;
            delete playlist.public;
            delete playlist.snapshot_id;
            delete playlist.tracks.href;
            delete playlist.type;
            delete playlist.uri;
          });

          allPlaylists.push(...playlistsItems);
          playlistsEndpoint = playlists?.next;
        } while (playlistsEndpoint);

        return res.status(200).json(allPlaylists);
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
