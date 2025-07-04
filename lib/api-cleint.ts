import { IVideo } from "@/models/Video";

export type VideoFormData = Omit<IVideo, "_id" | "createdAt" | "updatedAt">;

type FetchOptions = {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: unknown;
    headers?: Record<string, string>
}

export class ApiCleint {
    private async fetch<T>(
        endpoint: string,
        options: FetchOptions = {}
    ): Promise<T> {
        const { method = "GET", body, headers = {} } = options;
        const defaultHeaders = {
            "Content-Type": "application/json",
            ...headers
        };
        const response = await fetch(`/api${endpoint}`, {
            method,
            body: body ? JSON.stringify(body) : undefined,
            headers: defaultHeaders,
        });
        if (!response.ok) {
            throw new Error(await response.text())
        }
        return response.json() as Promise<T>;
    }
    async getVideos() {
        return this.fetch<IVideo[]>("/video")
    }
    async createVideo(videoData: VideoFormData) {
        return this.fetch<IVideo>("/video", {
            method: "POST",
            body: videoData,
        })
    }
} 
export const apiClient = new ApiCleint();