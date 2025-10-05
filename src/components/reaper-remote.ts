import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { reaperAPI } from '../services/reaper-api';
import type { CommandAction } from '../types/index';
import './control-button';

@customElement('reaper-remote')
export class ReaperRemote extends LitElement {
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

        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--spacing-xl, 2rem);
            padding-bottom: var(--spacing-lg, 1.5rem);
            border-bottom: 2px solid var(--border-color, #3a3a3a);
        }

        h1 {
            font-size: 2rem;
            font-weight: 600;
            background: linear-gradient(135deg, var(--accent-color, #4a9eff), #6ab4ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .controls-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: var(--spacing-md, 1rem);
            margin-bottom: var(--spacing-xl, 2rem);
        }

        @media (max-width: 600px) {
            .container {
                padding: var(--spacing-md, 1rem);
            }

            h1 {
                font-size: 1.5rem;
            }

            .controls-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 400px) {
            .controls-grid {
                grid-template-columns: 1fr;
            }
        }
    `;

    @state()
    private playActive = false;

    @state()
    private pauseActive = false;

    @state()
    private recordActive = false;

    private async handleButtonClick(e: CustomEvent) {
        const { action } = e.detail as { action: CommandAction };

        if (action === 'discard') {
            if (!confirm('Are you sure you want to undo recent changes?')) {
                return;
            }
        }

        try {
            await reaperAPI.sendCommand(action);
            this.updateButtonState(action);
        } catch (error) {
            console.error('Command error:', error);
        }
    }

    private updateButtonState(action: CommandAction): void {
        switch (action) {
            case 'play':
                this.playActive = true;
                this.pauseActive = false;
                break;
            case 'pause':
                this.playActive = false;
                this.pauseActive = true;
                break;
            case 'stop':
                this.playActive = false;
                this.pauseActive = false;
                break;
            case 'record':
                this.recordActive = !this.recordActive;
                break;
        }
    }

    render() {
        return html`
            <div class="container">
                <header>
                    <h1>Reaper Remote</h1>
                </header>

                <main>
                    <div class="controls-grid" @button-click=${this.handleButtonClick}>
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
                            action="discard"
                            label="Discard"
                            title="Discard Changes"
                            variant="discard"
                            icon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>'>
                        </control-button>
                    </div>
                </main>
            </div>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'reaper-remote': ReaperRemote;
    }
}
