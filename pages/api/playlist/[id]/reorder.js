import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    if (req.method === "PUT") {
      const session = await getServerSession(req, res, authOptions);
      if (session && session.accessToken) {
        const id = req.query.id;
        const body = JSON.parse(req.body);

        let reorder = body.reorder;
        reorder.reverse();

        for (let i = 0; i < reorder.length; i++) {
          const position = reorder[i];
          const moveResponse = await move(session.accessToken, id, position, 0);

          if (!moveResponse.ok)
            return res
              .status(moveResponse.status)
              .json(await moveResponse.json());

          reorder = reorder.map((y) => (y < position ? y + 1 : y));
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

async function move(accessToken, id, currentPosition, newPosition) {
  const playlistTracksEndpoint = `https://api.spotify.com/v1/playlists/${id}/tracks`;

  return fetch(playlistTracksEndpoint, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      range_start: currentPosition,
      insert_before: newPosition,
    }),
  });
}
