export type TIssueStatus = "open" | "in_progress" | "resolved";
export type TIssueType = "bug" | "feature_request";

export interface IIssue {
  id: number;
  title: string;
  description: string;
  type: TIssueType;
  status: TIssueStatus;
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
}

export type TCreateIssuePayload = {
  title: string;
  description: string;
  type: TIssueType;
};

export type TUpdateIssuePayload = {
  title?: string;
  description?: string;
  type?: TIssueType;
  status?: TIssueStatus;
};