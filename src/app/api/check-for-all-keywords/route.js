import mongoose from "mongoose";
import { Keyword } from "@/models/Keyword";
import { Result } from "@/models/Result";
import { getKeywordRank } from "@/app/libs/getKeywordRank";

export async function GET() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const keywordsDocs = await Keyword.find();

    const savePromises = keywordsDocs.map(async (keywordDoc) => {
      try {
        const rank = await getKeywordRank(keywordDoc.keyword, keywordDoc.domain);

        if (rank !== null) {
          await Result.create({
            domain: keywordDoc.domain,
            keyword: keywordDoc.keyword,
            rank,
            complete: true,
          });
        }
      } catch (error) {
        console.error(`Error processing keyword "${keywordDoc.keyword}":`, error);
      }
    });

    await Promise.all(savePromises);
    return Response.json(true);
  } catch (error) {
    console.error("Error in check-for-all-keywords route:", error);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
