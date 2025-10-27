// Import vertex tenant configuration as the default
// This file will be replaced by build configurations for different tenants
import { env as vertexEnv } from './envs/env-vertex';

// Export the vertex configuration as default
// File replacement in angular.json will swap this for vertex-plus builds
export const env = vertexEnv;
