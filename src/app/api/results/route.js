import mongoose from "mongoose";
import { Result } from "@/models/Result";
import { getKeywordRank } from "@/app/libs/getKeywordRank";

let isConnected = false; 

export async function POST(req) {
  try {
    if (!isConnected) {
      await mongoose.connect(process.env.MONGODB_URI);
      isConnected = true;
    }

    const { keyword, domain, owner } = await req.json();
    
    if (!keyword || !domain || !owner) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }), 
        { status: 400 }
      );
    }

    const rank = await getKeywordRank(keyword, domain);
    
    const newResult = await Result.create({
      keyword,
      domain,
      rank,  
      owner,
      complete: true  
    });

    return Response.json(newResult);

  } catch (e) {
    console.error("POST error:", e);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch rank', 
        details: e.message 
      }), 
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    if (!isConnected) {
      await mongoose.connect(process.env.MONGODB_URI);
      isConnected = true;
    }

    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get('keyword');
    const domain = searchParams.get('domain');
    const id = searchParams.get('id');

    
    if (id) {
      const result = await Result.findOne({ _id: id });
      return Response.json(result || {});
    }

    if (!keyword || !domain) {
      return new Response(
        JSON.stringify({ error: "Missing keyword or domain parameter" }), 
        { status: 400 }
      );
    }

    
    const latestResult = await Result.findOne({ keyword, domain })
      .sort({ createdAt: -1 })
      .lean();

    return Response.json(latestResult || {});

  } catch (e) {
    console.error("GET error:", e);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch results', 
        details: e.message 
      }), 
      { status: 500 }
    );
  }
}
