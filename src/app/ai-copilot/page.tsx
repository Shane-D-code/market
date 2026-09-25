import { PageHeader } from "@/features/shared/page-header";
import { CopilotChat } from "@/features/copilot/copilot-chat";

export default function AiCopilotPage() {
  return (
    <div>
      <PageHeader
        title="AI Copilot"
        subtitle="Ask about revenue, customers, cash flow, experiments, or what to do next."
      />
      <CopilotChat embedded />
    </div>
  );
}
