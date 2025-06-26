import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"
import { IVideo } from "@/models/Video"
import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
    try {
        await connectToDatabase()
        const videos = Video.find({}).sort({ createdAt: -1 }).lean()

        if (!videos || videos.length === 0) {
            return NextResponse.json([], { status: 200 })
        }
        return NextResponse.json(videos)
    }
    catch (error) {
        return NextResponse.json(
            { error: "failed to fetch videos" },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json(
                { error: "unauthorized" },
                { status: 500}
            )
        }
        await connectToDatabase()
        const body: IVideo = await request.json()
        if(!body.title || !body.description || !body.videoUrl || !body.thumbnailUrl){
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 500 }
            );
        }
        const videoData = {
            ...body,
            controls: body?.controls ?? true,
            transfomrmation:{
                height:1920,
                width:1080,
                quality: body.transformation?.quality ?? 100,
                
            }
            title: body.title,
            description: body.description,
            videoUrl: body.videoUrl,
            thumbnailUrl: body.thumbnailUrl,
            userId: session.user.id,
        }
        const newVideo = await Video.create(videoData)
        return NextResponse.json(newVideo)
    }
    catch (error) {
        return NextResponse.json(
            { error: "failed to create video" },
            { status: 500 }
        )
    }
}