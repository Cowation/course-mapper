import type { NextPage } from "next";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Head from "next/head";
import Link from "next/link";
import host from "../utils/host";
import { useRef } from "react";

const Home: NextPage = () => {
  const queryClient = useQueryClient();

  const prereqInputRef = useRef<HTMLInputElement>(null);
  const courseQuery = useQuery(
    "course",
    async () => {
      const res = await fetch(`${host}/api/getCourse`);
      return await res.json();
    },
    {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  const courseMutation = useMutation(
    async ({ course_no, prereq }: { course_no: string; prereq: string }) => {
      console.log(course_no, prereq);
      await fetch(`${host}/api/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          course_no,
          prereq,
        }),
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("course");
      },
    }
  );

  return (
    <>
      <Head>
        <title>Course Mapper</title>
        <meta name="description" content="Help create Exeter Course Map!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex h-screen w-screen flex-col items-center justify-center">
        <h1 className="text-lg text-neutral-600">
          Type in the registration condition string for:
        </h1>

        <h1 className="text-4xl font-black">
          {courseQuery.status === "success"
            ? courseQuery.data.course_no
            : "Getting new course..."}
        </h1>

        <div className="mb-8 flex flex-row justify-center gap-4">
          <Link href="https://docs.google.com/document/d/12NO6oeYkNkmHH5i6UT9gx5ZFD4LReNAEbxD3s3r05GQ/edit?usp=sharing">
            <a className="text-lg text-blue-600 underline underline-offset-1">
              Instructions
            </a>
          </Link>
          <Link href="https://exeter.edu/sites/default/files/documents/PEA-COI-22-23-Web-April19.pdf">
            <a className="text-lg text-blue-600 underline underline-offset-1">
              Exeter COI
            </a>
          </Link>
        </div>

        <input
          type="text"
          className="mb-2 h-10 w-80 rounded-md bg-neutral-200 text-center"
          placeholder="Type here"
          ref={prereqInputRef}
        />
        <button
          className="rounded-md bg-red-800 px-6 py-1 text-white"
          onClick={() => {
            if (courseQuery.status !== "success" || !prereqInputRef.current)
              return;

            courseMutation.mutate({
              course_no: courseQuery.data.course_no,
              prereq: prereqInputRef.current.value,
            });

            prereqInputRef.current.value = "";
          }}
        >
          Submit
        </button>
        {courseQuery.status === "error" ? (
          <p>An error occurred. Try reloading?</p>
        ) : (
          <></>
        )}
      </main>
    </>
  );
};

export default Home;
