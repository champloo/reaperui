import type { CommandAction } from '../types/index';
import { REAPER_COMMANDS } from '../types/index';

export class ReaperAPI {
    /**
     * Sends a command to Reaper via its HTTP web interface
     * @param action - The command action to execute
     * @throws Error if the fetch request fails
     */
    async sendCommand(action: CommandAction): Promise<void> {
        const commandId = REAPER_COMMANDS[action];

        try {
            await fetch(`/_/${commandId}`, { method: 'GET' });
        } catch (error) {
            console.error(`Failed to send command '${action}' (ID: ${commandId}):`, error);
            throw error;
        }
    }
}

// Singleton instance
export const reaperAPI = new ReaperAPI();
