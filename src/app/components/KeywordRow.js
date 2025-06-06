import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Chart from "./Chart"; // Ensure the path is correct

export default function KeywordRow({ keyword, domain, results: defaultResults }) {
  const resultsRef = useRef(defaultResults || []);
  const [rankExists, setRankExists] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    console.log("Initial results data:", resultsRef.current);

    // Check if any result has a rank and is complete
    const hasRank = resultsRef.current.some(result => result.rank !== undefined);
    const complete = resultsRef.current.some(result => result.complete);

    console.log("Does rank exist?", hasRank);
    console.log("Is the process complete?", complete);

    setRankExists(hasRank);
    setIsComplete(complete);
  }, []);

  console.log("Current keyword:", keyword);
  console.log("Current domain:", domain);

  return (
    <div className="flex gap-2 bg-white border border-blue-200 border-b-4 pr-0 rounded-lg items-center my-3">
      <Link
        href={`/domains/${domain}/${encodeURIComponent(keyword)}`}
        className="font-bold grow block p-4"
      >
        {keyword}
      </Link>
      <div>
        <div className="min-h-[80px] w-[300px] flex items-center">
          {!rankExists ? (
            <div className="block text-center w-full">
              {isComplete ? (
                <div>Not in top 100 :(</div>
              ) : (
                <div>Checking rank...</div>
              )}
            </div>
          ) : (
            <div className="pt-2">
              <Chart results={resultsRef.current} width={300} />
              {console.log("Rendering chart with results:", resultsRef.current)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}





