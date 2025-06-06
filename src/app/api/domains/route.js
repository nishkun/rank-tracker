import { Domain } from "@/models/Domain";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { JSDOM } from "jsdom";
import axios from "axios";
import { Keyword } from "@/models/Keyword";
import { Result } from "@/models/Result";

let isConnected = false;


async function getIconUrl(domain) {
  const response = await axios.get(`https://${domain}`);
  const dom = new JSDOM(response.data);
  const document = dom.window.document;
  
  const links = document.querySelectorAll("link[rel*='icon']");
  let href = "";

  if (links.length > 0) {
    href = links[0].getAttribute("href");
  }

  if (!href) return null;

  if (href.includes("://")) {
    return href;
  } else {
    return `https://${domain}${href.startsWith("/") ? "" : "/"}${href}`;
  }
}

export async function POST(req) {
  try {
    const data = await req.json();

    if (!isConnected) {
      await mongoose.connect(process.env.MONGODB_URI);
      isConnected = true;
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401 
      });
    }

    const icon = await getIconUrl(data?.domain);
    const doc = await Domain.create({
      domain: data?.domain,
      owner: session.user.email,
      icon,
    });

    return Response.json(doc);
  } catch (error) {
    console.error("POST error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { 
      status: 500 
    });
  }
}

export async function GET() {
  try {
    if (!isConnected) {
      await mongoose.connect(process.env.MONGODB_URI);
      isConnected = true;
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401 
      });
    }

    const domains = await Domain.find({ owner: session.user.email });
    const keywords = await Keyword.find({
      owner: session.user.email,
      domain: domains.map(doc => doc.domain)
    });
    const results = await Result.find({  // Fixed from Rank to Result
      domain: domains.map(doc => doc.domain),
      keyword: keywords.map(doc => doc.keyword)
    });

    return Response.json({ domains, keywords, results });
  } catch (error) {
    console.error("GET error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { 
      status: 500 
    });
  }
}

export async function DELETE(req) {
  try {
    if (!isConnected) {
      await mongoose.connect(process.env.MONGODB_URI);
      isConnected = true;
    }

    const url = new URL(req.url);
    const domain = url.searchParams.get('domain');
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { 
        status: 401 
      });
    }

    await Domain.deleteOne({ owner: session.user.email, domain });
    return Response.json(true);
  } catch (error) {
    console.error("DELETE error:", error);
    return new Response(JSON.stringify({ error: "Server error" }), { 
      status: 500 
    });
  }
}