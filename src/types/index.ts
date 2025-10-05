export type CommandAction = 'play' | 'pause' | 'stop' | 'record' | 'save' | 'abort' | 'select-all' | 'delete' | 'go-to-start' | 'clear-all';

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
    abort: 40668,
    'select-all': 40182,
    delete: 40006,
    'go-to-start': 40042,
    'clear-all': 0 // Composite action, handled separately
};
