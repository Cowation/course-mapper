// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../utils/db";
import courses from "../../courses.json";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  return res.send("Ah ah ah!");

  for (const course of courses) {
    console.log("Setting course", course.course_no);
    db.collection("courses")
      .doc(course.course_no)
      .set({ ...course, fixed: false });
  }
  res.send("Done");
}
