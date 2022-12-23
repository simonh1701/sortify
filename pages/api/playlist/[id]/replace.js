import { authOptions } from "pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  try {
    if (req.method === "PUT") {
      const session = await getServerSession(req, res, authOptions);
      if (session && session.accessToken) {
        const { id } = req.query;
        const playlistTracksEndpoint = `https://api.spotify.com/v1/playlists/${id}/tracks`;
        const replaceResponse = await fetch(playlistTracksEndpoint, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
          body: req.body,
        });

        if (!replaceResponse.ok)
          return res
            .status(replaceResponse.status)
            .json(await replaceResponse.json());

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
