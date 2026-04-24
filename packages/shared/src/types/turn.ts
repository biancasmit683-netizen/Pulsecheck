/**
 * The API contract — shared between the backend (apps/api) and the frontend (apps/web).
 * Spec source: Pulse Check Build Kit, 06-API-CONTRACT.md.
 *
 * Do not duplicate these types in either app — import them from here.
 */

export type QuestionType =
  | "single"
  | "multi"
  | "single_with_note"
  | "single_with_other"
  | "multi_with_other"
  | "drag_to_rank"
  | "story_tier"
  | "story_followup_grain"
  | "story_followup_system"
  | "data_answer"
  | "transition"
  | "completion";

export type PartId =
  | "context"
  | "data"
  | "granularity"
  | "users"
  | "insights"
  | "data_discovery";

export type PartType = "generic" | "ranking_and_storytelling" | "data_discovery";

export interface ChipOption {
  val: string;
  label: string;
}

export interface TurnContext {
  question_index?: number;
  question_total?: number;
  metric_index?: number;
  metric_total?: number;
  metric_category?: string;
  metric_tier?: string;
  metric_rank?: number;
  feeds?: string[];
  grain_tag?: string;
  substep_label?: string;
}

export interface TransitionPayload {
  title: string;
  intro: string;
  recap_line?: string;
  cta_label: string;
}

export interface RankingState {
  categories: { id: string; title: string; desc: string }[];
  current_order: string[];
}

export interface AdaptiveCallout {
  message: string;
  options: { val: "expand" | "stick"; label: string }[];
}

export interface ReconCallout {
  message: string;
  cta_label: string;
}

export interface CompletionPayload {
  headline: string;
  body: string;
}

export interface TurnPayload {
  session_id: string;
  part: {
    id: PartId;
    number: number;
    title: string;
    type: PartType;
  };
  showing_transition: boolean;
  is_complete: boolean;

  transition?: TransitionPayload;
  agent_message?: string;
  helper?: string;
  context?: TurnContext;
  question_type?: QuestionType;
  options?: ChipOption[];
  note_prompt?: string;
  other_prompt?: string;
  selected_echo?: ChipOption;

  ranking_state?: RankingState;
  adaptive_callout?: AdaptiveCallout;
  recon_callout?: ReconCallout;
  completion?: CompletionPayload;

  state_signature?: string;
}

/**
 * Response value shapes that the frontend posts to POST /sessions/:id/responses.
 * Shape depends on the preceding turn's question_type.
 */

export type SingleResponse = string;
export type MultiResponse = string[];
export interface SingleWithNoteResponse {
  val: string;
  note: string;
}
export interface SingleWithOtherResponse {
  val: string;
  otherText?: string;
}
export interface MultiWithOtherResponse {
  vals: string[];
  otherText?: string;
}
export type DragToRankResponse = string[];
export type StoryTierResponse = "top" | "second" | "nice" | "already" | "no";
export type StoryFollowupGrainResponse = string[];
export type StoryFollowupSystemResponse = string[];
export interface DataAnswerResponse {
  val: "yes" | "partial" | "no" | "unsure" | "unsure_system";
  note: string;
}
export type AdaptiveCalloutResponse = "expand" | "stick";

export type ResponseValue =
  | SingleResponse
  | MultiResponse
  | SingleWithNoteResponse
  | SingleWithOtherResponse
  | MultiWithOtherResponse
  | DragToRankResponse
  | StoryTierResponse
  | StoryFollowupGrainResponse
  | StoryFollowupSystemResponse
  | DataAnswerResponse
  | AdaptiveCalloutResponse;

export interface PostResponseBody {
  response_value: ResponseValue;
  response_note?: string;
}

export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
  };
}
