import { Keyword } from "@/models/Keyword";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { getKeywordRank } from "@/app/libs/getKeywordRank";
import { Result } from "@/models/Result";

export async function POST(req) {
  await mongoose.connect(process.env.MONGODB_URI);
  const data = await req.json();
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const keywordDoc = await Keyword.create({
    domain: data.domain,
    keyword: data.keyword,
    owner: session.user.email,
  });

  try {
    const rank = await getKeywordRank(data.keyword, data.domain);

    if (rank !== null) {
      await Result.create({
        keyword: data.keyword,
        domain: data.domain,
        rank,
        owner: session.user.email,
      });
    }
  } catch (error) {
    console.error("Error getting keyword rank:", error);
  }

  return Response.json(keywordDoc);
}

export async function GET(req) {
  const url = new URL(req.url);
  const domain = url.searchParams.get('domain');
  const keyword = url.searchParams.get('keyword');
  await mongoose.connect(process.env.MONGODB_URI);
  const session = await getServerSession(authOptions);
  const keywordsDocs = await Keyword.find(
    keyword
      ? { domain, keyword, owner: session.user.email }
      : { domain, owner: session.user.email }
  );
  const resultsDocs = await Result.find({
    domain,
    keyword: keywordsDocs.map(doc => doc.keyword)
  });
  return Response.json({
    keywords: keywordsDocs,
    results: resultsDocs,
  });
}

export async function DELETE(req) {
  await mongoose.connect(process.env.MONGODB_URI);
  const { searchParams } = new URL(req.url);
  const domain = searchParams.get('domain');
  const keyword = searchParams.get('keyword');

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  await Keyword.deleteOne({ domain, keyword, owner: session.user.email });
  return Response.json(true);
}
