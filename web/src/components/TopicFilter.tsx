import type { TopicMeta } from "@/lib/types";

interface Props {
  topics: TopicMeta[];
  activeTopic: string;
  onChange: (id: string) => void;
}

export function TopicFilter({ topics, activeTopic, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-6" style={{ WebkitOverflowScrolling: "touch" }}>
      {topics.map((topic) => (
        <button
          key={topic.id}
          onClick={() => onChange(topic.id)}
          className={`
            flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
            transition-colors shrink-0 cursor-pointer
            ${
              activeTopic === topic.id
                ? "bg-gray-900 text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:border-gray-400"
            }
          `}
        >
          <span aria-hidden="true">{topic.icon}</span>
          {topic.label}
        </button>
      ))}
    </div>
  );
}
