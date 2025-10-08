import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { reaperAPI } from '../services/reaper-api';
import type { CommandAction } from '../types/index';
import './control-button';

@customElement('reaper-remote')
export class ReaperRemote extends LitElement {
    private pollInterval?: number;
    private readonly POLL_INTERVAL_MS = 200; // Poll every 200ms
    static styles = css`
        :host {
            display: block;
            width: 100%;
        }

        .container {
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            background: var(--secondary-bg, #2a2a2a);
            border-radius: var(--radius-lg, 12px);
            padding: var(--spacing-xl, 2rem);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .time-display {
            background: var(--btn-bg, #2a2a2a);
            border: 2px solid var(--border-color, #3a3a3a);
            border-radius: var(--radius-md, 8px);
            padding: var(--spacing-md, 1rem);
            text-align: center;
            margin-bottom: var(--spacing-md, 1rem);
            font-family: 'Courier New', monospace;
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--accent-color, #4a9eff);
            letter-spacing: 0.05em;
        }

        @media (max-width: 480px) {
            .time-display {
                font-size: 1.1rem;
                padding: var(--spacing-sm, 0.75rem);
            }
        }

        .controls-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: var(--spacing-md, 1rem);
        }

        @media (max-width: 768px) {
            .container {
                padding: var(--spacing-md, 1rem);
            }

            .controls-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 480px) {
            .container {
                padding: var(--spacing-sm, 0.75rem);
            }

            .controls-grid {
                gap: var(--spacing-sm, 0.75rem);
            }
        }

        .offline-banner {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
            color: white;
            padding: var(--spacing-sm, 0.75rem) var(--spacing-md, 1rem);
            border-radius: var(--radius-md, 8px);
            margin-bottom: var(--spacing-md, 1rem);
            text-align: center;
            font-weight: 600;
            font-size: 0.95rem;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
            animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .offline-banner svg {
            width: 20px;
            height: 20px;
            flex-shrink: 0;
        }

        @media (max-width: 480px) {
            .offline-banner {
                font-size: 0.85rem;
                padding: var(--spacing-xs, 0.5rem) var(--spacing-sm, 0.75rem);
            }

            .offline-banner svg {
                width: 16px;
                height: 16px;
            }
        }
    `;

    @state()
    private playActive = false;

    @state()
    private pauseActive = false;

    @state()
    private recordActive = false;

    @state()
    private timePosition = '0:00.000';

    @state()
    private isOnline = true;

    private unsubscribeConnection?: () => void;

    connectedCallback() {
        super.connectedCallback();
        this.startPolling();

        // Subscribe to connection state changes
        this.unsubscribeConnection = reaperAPI.onConnectionChange((online) => {
            this.isOnline = online;
        });

        // Set initial state
        this.isOnline = reaperAPI.isOnline;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.stopPolling();

        // Unsubscribe from connection changes
        if (this.unsubscribeConnection) {
            this.unsubscribeConnection();
        }
    }

    private startPolling(): void {
        this.pollInterval = window.setInterval(() => {
            this.updateStateFromReaper();
        }, this.POLL_INTERVAL_MS);

        // Initial state fetch
        this.updateStateFromReaper();
    }

    private stopPolling(): void {
        if (this.pollInterval !== undefined) {
            window.clearInterval(this.pollInterval);
            this.pollInterval = undefined;
        }
    }

    private async updateStateFromReaper(): Promise<void> {
        try {
            const state = await reaperAPI.getTransportState();

            // Playstate values: 0=stopped, 1=playing, 2=paused, 5=recording, 6=record paused
            this.playActive = state.playstate === 1 || state.playstate === 5;
            this.pauseActive = state.playstate === 2 || state.playstate === 6;
            this.recordActive = state.playstate === 5 || state.playstate === 6;
            this.timePosition = state.positionString;
        } catch (error) {
            // Silently fail - expected when not running through Reaper's web interface
        }
    }

    private async handleButtonClick(e: CustomEvent) {
        const { action } = e.detail as { action: CommandAction };

        try {
            if (action === 'clear-all') {
                // Execute select-all, delete, then go-to-start in sequence
                await reaperAPI.sendMultipleCommands(['select-all', 'delete', 'go-to-start']);
            } else {
                await reaperAPI.sendCommand(action);
            }
            // State will be updated by the polling mechanism
        } catch (error) {
            console.error('Command error:', error);
        }
    }

    render() {
        return html`
            <div class="container">
                ${!this.isOnline ? html`
                    <div class="offline-banner">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                        <span>Offline - Not connected to Reaper</span>
                    </div>
                ` : ''}
                <div class="time-display">${this.timePosition}</div>
                <div class="controls-grid" @button-click=${this.handleButtonClick}>
                        <control-button
                            action="record"
                            label="Record"
                            title="Record"
                            variant="record"
                            .active=${this.recordActive}
                            icon='<svg viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="12" cy="12" r="8"></circle>
                            </svg>'>
                        </control-button>

                        <control-button
                            action="abort"
                            label="Abort"
                            title="Abort"
                            variant="discard"
                            icon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>'>
                        </control-button>

                        <control-button
                            action="play"
                            label="Play"
                            title="Play"
                            .active=${this.playActive}
                            icon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>'>
                        </control-button>

                        <control-button
                            action="pause"
                            label="Pause"
                            title="Pause"
                            .active=${this.pauseActive}
                            icon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="6" y="4" width="4" height="16"></rect>
                                <rect x="14" y="4" width="4" height="16"></rect>
                            </svg>'>
                        </control-button>

                        <control-button
                            action="stop"
                            label="Stop"
                            title="Stop"
                            icon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="5" y="5" width="14" height="14"></rect>
                            </svg>'>
                        </control-button>

                        <control-button
                            action="save"
                            label="Save"
                            title="Save Project"
                            icon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                <polyline points="7 3 7 8 15 8"></polyline>
                            </svg>'>
                        </control-button>

                        <control-button
                            action="clear-all"
                            label="Clear All"
                            title="Select All, Delete, Go to Start"
                            variant="discard"
                            icon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                <line x1="9" y1="9" x2="15" y2="15"></line>
                            </svg>'>
                        </control-button>

                        <control-button
                            action="select-all"
                            label="Select All"
                            title="Select All Items"
                            icon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <path d="M9 11l3 3 6-6"></path>
                            </svg>'>
                        </control-button>

                        <control-button
                            action="delete"
                            label="Delete"
                            title="Delete Selected Items"
                            variant="discard"
                            icon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>'>
                        </control-button>

                        <control-button
                            action="go-to-start"
                            label="Go to Start"
                            title="Go to Project Start"
                            icon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polygon points="11 19 2 12 11 5 11 19"></polygon>
                                <line x1="22" y1="5" x2="22" y2="19"></line>
                            </svg>'>
                        </control-button>
                </div>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'reaper-remote': ReaperRemote;
    }
}
