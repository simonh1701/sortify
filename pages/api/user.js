import { getServerSession } from "next-auth/next";
import { authOptions } from "pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const session = await getServerSession(req, res, authOptions);
      if (session && session.accessToken) {
        const userEndpoint = "https://api.spotify.com/v1/me";

        const userResponse = await fetch(userEndpoint, {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });

        return res.status(userResponse.status).json(await userResponse.json());
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
