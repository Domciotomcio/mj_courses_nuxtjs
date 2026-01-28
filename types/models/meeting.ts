export interface Meeting {
    index: number; // order of the meeting
    label: string; // title of the meeting
    video_url?: string; // optional URL to a recorded video
    timestamp?: string;
    has_occurred?: boolean; // indicates if the meeting has already taken place
    description?: string;
}