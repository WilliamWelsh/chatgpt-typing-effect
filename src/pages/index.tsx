import { type NextPage } from "next";
import Head from "next/head";
import { useRef, useState } from "react";

interface ChunkResponse {
  choices: {
    delta: { content: string };
  }[];
}

const QUESTION = "Explain Batman's Origins Verbosely";

const Home: NextPage = () => {
  const [answer, setAnswer] = useState<string | null>(null);

  const ref = useRef<HTMLParagraphElement>(null);

  const scrollToBottom = () => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = () => {
    setIsLoading(true);

    const eventSource = new EventSource(
      `${window.location.protocol}//${window.location.host}/api/getAnswer?question=${QUESTION}`
    );

    eventSource.onmessage = (event) => {
      if (event.data == "[DONE]") {
        console.log("Stream finished.");
        eventSource.close();
        setIsLoading(false);
        return;
      }

      const data = JSON.parse(event.data as string) as ChunkResponse;

      const chunk = data.choices[0]?.delta.content;

      if (!chunk) return;

      console.log("New token: ", chunk);

      setAnswer((prev) => (prev ? prev + chunk : chunk));

      scrollToBottom();
    };

    eventSource.onerror = () => eventSource.close();
  };

  return (
    <>
      <Head>
        <title>ChatGPT Effect</title>
        <meta name="description" content="ChatGPT SSE Effect" />
        <meta name="theme-color" content="#2e026d" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 text-white">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
              ChatGPT Effect
            </h1>
            <span className="text-center font-light">
              OpenAI API streaming via Server Sent Events on NextJS Edge Runtime
            </span>
            <span className="text-center font-light">
              View token streams in console
            </span>
          </div>
          <div className="flex flex-col items-center gap-4">
            <p className="text-2xl font-bold">{QUESTION}</p>
            {answer && (
              <p
                ref={ref}
                className={`max-h-[200px] overflow-y-scroll font-light ${isLoading ? "blink" : ""
                  }`}
              >
                {answer}
              </p>
            )}
            <button
              onClick={onSubmit}
              disabled={answer !== null}
              className="rounded bg-purple-800 p-2"
            >
              Get Response
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
