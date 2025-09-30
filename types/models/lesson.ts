/**
 * Lesson model
 */
import type { ID } from './user';

/** Link object for optional lesson links */
export interface LessonLink {
  /** human-friendly label */
  label?: string;
  /** url to the resource */
  url: string;
}

export interface Lesson {
  id?: ID;
  title: string;
  description?: string;
  order?: number; // position inside the course
  durationMinutes?: number;
  /** Optional link to an online meeting (e.g., Zoom, Teams) */
  meetingLink?: LessonLink;
  /** Optional link to a YouTube video */
  youtubeLink?: LessonLink;
  createdAt?: string;
  updatedAt?: string;
}

export type LessonCreate = Pick<Lesson, 'title'> & Partial<Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>>;
