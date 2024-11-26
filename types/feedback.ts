export type FeedbackType = "success" | "error" | "alert";

export interface IFeedback {
	message: string;
	type: FeedbackType;
}
