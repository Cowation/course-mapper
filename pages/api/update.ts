// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../utils/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const { course_no, prereq } = req.body;
  if (course_no === undefined || prereq === undefined)
    return res.status(400).send("Bad request");

  const course = await db.collection("courses").doc(course_no).get();

  if (!course.exists) return res.status(400).send("Course not found");

  await db
    .collection("courses")
    .doc(course_no)
    .set({
      ...course.data(),
      fixed: true,
      pre: prereq,
    });

  res.status(200).send("Updated course! Thank you.");
}
