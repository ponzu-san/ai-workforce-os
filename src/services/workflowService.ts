import { workflowRepository } from "@/database/repositories/workflowRepository";

export const workflowService = {
  async listByProject(projectId: string) {
    return workflowRepository.findByProjectId(projectId);
  },

  async getById(id: string) {
    return workflowRepository.findById(id);
  },
};
