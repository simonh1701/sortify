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

        let playlistItemsEndpoint = `https://api.spotify.com/v1/playlists/${id}/tracks?limit=50&fields=next,items(added_at,is_local,track(album(id,images,name,release_date,release_date_precision),artists,duration_ms,id,name,popularity,preview_url,type,uri))`;

        let allItems = [];

        do {
          const playlistItemsResponse = await fetch(playlistItemsEndpoint, {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });

          if (!playlistItemsResponse.ok)
            return res
              .status(playlistItemsResponse.status)
              .json(await playlistItemsResponse.json());

          const playlistItems = await playlistItemsResponse.json();

          const items = playlistItems.items;

          const ids = items
            .filter((item) => item.track.type === "track" && !item.is_local)
            .map((item) => item.track.id)
            .join(",");

          const tracksAudioFeaturesEndpoint = `https://api.spotify.com/v1/audio-features?ids=${ids}`;

          const tracksAudioFeaturesResponse = await fetch(
            tracksAudioFeaturesEndpoint,
            {
              headers: {
                Authorization: `Bearer ${session.accessToken}`,
              },
            }
          );

          if (!tracksAudioFeaturesResponse.ok)
            return res
              .status(tracksAudioFeaturesResponse.status)
              .json(await tracksAudioFeaturesResponse.json());

          const tracksAudioFeatures = await tracksAudioFeaturesResponse.json();

          const itemsPlusAudioFeatures = items.map((item) => ({
            ...item,
            audio_features: tracksAudioFeatures.audio_features.find(
              (audio_features) => audio_features.id === item.track.id
            ),
          }));

          allItems.push(...itemsPlusAudioFeatures);
          playlistItemsEndpoint = playlistItems?.next;
        } while (playlistItemsEndpoint);

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
