import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "../../../../lib/mongodb";
import Like from "../../../../models/Likes";
// import Post from "../../../../models/Post";

export async function POST(req) {
  await dbConnect();

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "0.0.0.0";
  console.log('my ip is >>>>',req.headers.get("x-forwarded-for"))
  const body = await req.json();
  const { postId } = body;

  const ipHash = crypto.createHash("sha256").update(ip).digest("hex");

  const existingLike = await Like.findOne({ postId, ipHash });

  if (existingLike) {
    const totalLikes = await Like.countDocuments({ postId });
    return NextResponse.json({
      success: false,
      message: "Already liked",
      totalLikes,
    });
  }

  await Like.create({ postId, ipHash });

  const totalLikes = await Like.countDocuments({ postId });

  return NextResponse.json({ success: true, totalLikes });
}
