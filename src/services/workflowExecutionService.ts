import { workflowEngine } from "@/ai/workflow/workflowEngine";

export const workflowExecutionService = {
  start: workflowEngine.startWorkflow,
  assignAgents: workflowEngine.assignAgentsForWorkflow,
  executeNext: workflowEngine.executeNextTask,
  startAndExecuteFirst: workflowEngine.startAndExecuteFirst,
  registerExternalDeliverable: workflowEngine.registerExternalDeliverable,
};
