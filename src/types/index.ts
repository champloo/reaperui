export type CommandAction = 'play' | 'pause' | 'stop' | 'record' | 'save' | 'discard';

export interface ReaperCommand {
    action: CommandAction;
    commandId: number;
}

export interface ControlButtonConfig {
    action: CommandAction;
    label: string;
    title: string;
    icon: string;
    variant?: 'default' | 'record' | 'discard';
}

export interface TransportState {
    playstate: number;
    position: number;
    isRepeat: boolean;
    positionString: string;
    positionBeats: string;
}

export const REAPER_COMMANDS: Record<CommandAction, number> = {
    play: 1007,
    pause: 1008,
    stop: 1016,
    record: 1013,
    save: 42230,
    discard: 40668
};
