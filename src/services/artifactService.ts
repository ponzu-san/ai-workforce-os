import { artifactRepository } from "@/database/repositories/artifactRepository";

export const artifactService = {
  async list() {
    return artifactRepository.findAll();
  },

  async getById(id: string) {
    return artifactRepository.findById(id);
  },

  async listByProject(projectId: string) {
    return artifactRepository.findByProjectId(projectId);
  },
};
