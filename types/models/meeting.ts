export interface Meeting {
    index: number; // order of the meeting
    meeting_url: string; // URL to the meeting (e.g., Zoom link)
    video_url?: string; // optional URL to a recorded video
    name: string; // name or title of the meeting
    date: string; // ISO date string
    time: string; // e.g., "14:00"
    duration: number; // duration in minutes
    topic: string;
    has_occurred?: boolean; // indicates if the meeting has already taken place
    description?: string;
}