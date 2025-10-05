import type { CommandAction, TransportState } from '../types/index';
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

    /**
     * Queries the current transport state from Reaper
     * @returns TransportState object with playstate, position, etc.
     * @throws Error if the fetch request fails or parsing fails
     */
    async getTransportState(): Promise<TransportState> {
        const response = await fetch('/_/TRANSPORT', { method: 'GET' });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const text = await response.text();

        // Parse response: TRANSPORT \t playstate \t position \t isRepeat \t posString \t posBeats
        const parts = text.split('\t');

        if (parts.length < 6 || parts[0] !== 'TRANSPORT') {
            throw new Error('Invalid transport state response');
        }

        return {
            playstate: parseInt(parts[1], 10),
            position: parseFloat(parts[2]),
            isRepeat: parts[3] === '1',
            positionString: parts[4],
            positionBeats: parts[5]
        };
    }

    /**
     * Queries the state of a specific command/action
     * @param action - The command action to query
     * @returns The state value (>0: on, 0: off, -1: no state)
     * @throws Error if the fetch request fails or parsing fails
     */
    async getCommandState(action: CommandAction): Promise<number> {
        const commandId = REAPER_COMMANDS[action];

        const response = await fetch(`/_/GET/${commandId}`, { method: 'GET' });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const text = await response.text();

        // Parse response: CMDSTATE \t command_id \t state
        const parts = text.split('\t');

        if (parts.length < 3 || parts[0] !== 'CMDSTATE') {
            throw new Error('Invalid command state response');
        }

        return parseInt(parts[2], 10);
    }
}

// Singleton instance
export const reaperAPI = new ReaperAPI();
