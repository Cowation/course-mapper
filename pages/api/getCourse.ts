// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<unknown>
) {
  try {
    const course = (
      await db.collection("courses").where("fixed", "==", false).limit(1).get()
    ).docs[0].data();

    return res.send(course);
  } catch (error) {
    return res.status(500).send(error);
  }
}
