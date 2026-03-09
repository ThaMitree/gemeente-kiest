export interface Municipality {
  name: string;
  year: number;
  election_date: string;
  source_programs_url: string;
  source_programs_label: string;
  contact_email: string;
  repo_url: string;
}

export interface TopicMeta {
  id: string;
  label: string;
  icon: string;
}

export interface Position {
  summary: string;
  key_points: string[];
  quote: string;
  coverage: "volledig" | "beperkt" | "geen" | "onbekend";
}

export interface Party {
  id: string;
  name: string;
  abbreviation: string;
  color: string;
  text_color: string;
  source: "pdf" | "web";
  positions: Record<string, Position | null>;
}

export interface PartiesData {
  generated_at: string;
  municipality: Municipality;
  topics: TopicMeta[];
  parties: Party[];
}
