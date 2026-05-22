import type { TIssueStatus, TIssueType } from "../../types/issues.type";


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