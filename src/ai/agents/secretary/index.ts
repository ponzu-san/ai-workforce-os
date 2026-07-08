import { agentRepository } from "@/database/repositories/agentRepository";
import { memoryRepository } from "@/database/repositories/agentRepository";
import { projectRepository } from "@/database/repositories/projectRepository";
import { taskRepository } from "@/database/repositories/taskRepository";
import { SECRETARY_SYSTEM_PROMPT } from "@/ai/agents/secretary/prompt";
import { executeRouterRequest } from "@/ai/router/executeRequest";

export const secretaryAgent = {
  async chat(input: {
    message: string;
    projectId?: string | null;
  }): Promise<{ reply: string; model: string; provider: string }> {
    const secretary = await agentRepository.findSecretary();
    if (!secretary) {
      throw new Error("Secretary AI not configured");
    }

    const [tasks, projectContext] = await Promise.all([
      taskRepository.findTodayTasks(5),
      input.projectId
        ? projectRepository.findById(input.projectId)
        : Promise.resolve(null),
    ]);

    const projectMemories = input.projectId
      ? await memoryRepository.findByProject(input.projectId)
      : [];

    const contextParts = [
      "Current tasks:",
      ...tasks.map(
        (t) =>
          `- [${t.priority}] ${t.title} (${t.status}) / ${t.stage.workflow.project.name}`,
      ),
    ];

    if (projectContext) {
      contextParts.push(
        "",
        `Active project: ${projectContext.name}`,
        `Status: ${projectContext.status}`,
      );
    }

    if (projectMemories.length > 0) {
      contextParts.push(
        "",
        "Project memory:",
        ...projectMemories.slice(0, 3).map((m) => `- ${m.content}`),
      );
    }

    const result = await executeRouterRequest({
      agentRole: "secretary",
      taskKind: "secretary",
      agentId: secretary.id,
      messages: [
        { role: "system", content: SECRETARY_SYSTEM_PROMPT },
        {
          role: "user",
          content: `${contextParts.join("\n")}\n\nUser message:\n${input.message}`,
        },
      ],
    });

    if (input.projectId && input.message.length > 20) {
      await memoryRepository.create({
        project_id: input.projectId,
        type: "short_term",
        content: `User: ${input.message.slice(0, 300)}\nSecretary: ${result.content.slice(0, 300)}`,
        importance: 3,
        source: "secretary_chat",
      });
    }

    return {
      reply: result.content,
      model: result.model,
      provider: result.provider,
    };
  },
};
