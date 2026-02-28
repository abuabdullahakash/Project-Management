export type Priority = 'High' | 'Medium' | 'Low';
export type Stage = 'First Stage' | 'Middle Stage' | 'Final Stage' | 'Delivered';
export type Status = 'Active' | 'Revision' | 'Delivered';
export type NoteTag = 
  | 'Clarification' 
  | 'Update Message' 
  | 'Follow Up' 
  | 'Delivery' 
  | 'Meeting Summary' 
  | 'Fixing Update' 
  | 'Extend Message' 
  | 'Ask For Additional Charge' 
  | 'Hyper Client Convenience';

export interface Note {
  id: string;
  content: string;
  timestamp: string;
  tags: NoteTag[];
}

export interface Project {
  id: string;
  title: string;
  clientName: string;
  description?: string;
  price: number;
  priority: Priority;
  startDate: string;
  endDate: string;
  stage: Stage;
  status: Status;
  createdAt: string;
  deliveredAt?: string;
  lastUpdatedAt: string;
  websiteLink?: string;
  notes: Note[];
}
