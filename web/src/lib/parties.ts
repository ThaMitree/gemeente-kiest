import type { PartiesData } from "./types";

// Placeholder data used before the pipeline has run.
// Replace web/src/data/parties.json with the pipeline output.
const fallback: PartiesData = {
  generated_at: "",
  municipality: {
    name: "",
    year: 0,
    election_date: "",
    source_programs_url: "",
    source_programs_label: "",
    contact_email: "",
    repo_url: "",
  },
  topics: [],
  parties: [],
};

let data: PartiesData;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  data = require("@/data/parties.json") as PartiesData;
} catch {
  data = fallback;
}

export { data };
export const { municipality, topics, parties } = data;
