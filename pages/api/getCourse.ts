// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<unknown>
) {
  try {
    const courses = await db
      .collection("courses")
      .where("fixed", "==", false)
      .get();

    return res.send(
      courses.docs[Math.floor(Math.random() * courses.docs.length)].data()
    );
  } catch (error) {
    return res.status(500).send(error);
  }
}
