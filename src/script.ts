import { LitElement, html, css } from 'lit';
import { property } from 'lit/decorators.js';

type CommandAction = 'play' | 'pause' | 'stop' | 'record' | 'save' | 'discard';

class ReaperRemote extends LitElement {
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

        .control-btn {
            background: var(--btn-bg, #2a2a2a);
            border: 2px solid var(--border-color, #3a3a3a);
            color: var(--text-primary, #ffffff);
            padding: var(--spacing-lg, 1.5rem);
            border-radius: var(--radius-md, 8px);
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--spacing-sm, 0.5rem);
            transition: all var(--transition-fast, 0.15s ease);
            font-size: 0.9rem;
            font-weight: 500;
        }

        .control-btn svg {
            width: 32px;
            height: 32px;
            transition: transform var(--transition-fast, 0.15s ease);
        }

        .control-btn:hover {
            background: var(--btn-hover, #3a3a3a);
            border-color: var(--accent-color, #4a9eff);
            transform: translateY(-2px);
        }

        .control-btn:active {
            background: var(--btn-active, #4a4a4a);
            transform: translateY(0);
        }

        .control-btn.active {
            border-color: var(--accent-color, #4a9eff);
            background: var(--btn-active, #4a4a4a);
        }

        .control-btn.active svg {
            transform: scale(1.1);
        }

        .control-btn.play-active {
            border-color: var(--play-color, #44ff88);
        }

        .control-btn.play-active svg {
            fill: var(--play-color, #44ff88);
        }

        .control-btn.record {
            border-color: var(--record-color, #ff4444);
        }

        .control-btn.record-active {
            border-color: var(--record-color, #ff4444);
            background: rgba(255, 68, 68, 0.1);
        }

        .control-btn.record-active svg {
            fill: var(--record-color, #ff4444);
            animation: pulse 1.5s infinite;
        }

        .control-btn.discard:hover {
            border-color: var(--discard-color, #ff8844);
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
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

    @property({ type: Boolean })
    playActive = false;

    @property({ type: Boolean })
    pauseActive = false;

    @property({ type: Boolean })
    recordActive = false;

    private commands: Record<CommandAction, number> = {
        play: 1007,
        pause: 1008,
        stop: 1016,
        record: 1013,
        save: 40026,
        discard: 40029
    };

    async sendCommand(action: CommandAction): Promise<void> {
        const commandId = this.commands[action];

        try {
            await fetch(`/_/${commandId}`, { method: 'GET' });
            this.updateButtonState(action);
        } catch (error) {
            console.error('Command error:', error);
        }
    }

    private updateButtonState(action: CommandAction): void {
        if (action === 'play') {
            this.playActive = true;
            this.pauseActive = false;
            this.recordActive = this.recordActive;
        } else if (action === 'pause') {
            this.playActive = false;
            this.pauseActive = true;
        } else if (action === 'stop') {
            this.playActive = false;
            this.pauseActive = false;
        } else if (action === 'record') {
            this.recordActive = !this.recordActive;
        } else if (action === 'save' || action === 'discard') {
            this.requestUpdate();
        }
    }

    private confirmDiscard(): void {
        if (confirm('Are you sure you want to undo recent changes?')) {
            this.sendCommand('discard');
        }
    }

    render() {
        return html`
            <div class="container">
                <header>
                    <h1>Reaper Remote</h1>
                </header>

                <main>
                    <div class="controls-grid">
                        <button
                            class="control-btn ${this.playActive ? 'play-active' : ''}"
                            @click="${() => this.sendCommand('play')}"
                            title="Play">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                            <span>Play</span>
                        </button>

                        <button
                            class="control-btn ${this.pauseActive ? 'active' : ''}"
                            @click="${() => this.sendCommand('pause')}"
                            title="Pause">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="6" y="4" width="4" height="16"></rect>
                                <rect x="14" y="4" width="4" height="16"></rect>
                            </svg>
                            <span>Pause</span>
                        </button>

                        <button
                            class="control-btn"
                            @click="${() => this.sendCommand('stop')}"
                            title="Stop">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="5" y="5" width="14" height="14"></rect>
                            </svg>
                            <span>Stop</span>
                        </button>

                        <button
                            class="control-btn record ${this.recordActive ? 'record-active' : ''}"
                            @click="${() => this.sendCommand('record')}"
                            title="Record">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="12" cy="12" r="8"></circle>
                            </svg>
                            <span>Record</span>
                        </button>

                        <button
                            class="control-btn"
                            @click="${() => this.sendCommand('save')}"
                            title="Save Project">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                                <polyline points="7 3 7 8 15 8"></polyline>
                            </svg>
                            <span>Save</span>
                        </button>

                        <button
                            class="control-btn discard"
                            @click="${() => this.confirmDiscard()}"
                            title="Discard Changes">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            <span>Discard</span>
                        </button>
                    </div>
                </main>
            </div>
        `;
    }
}

customElements.define('reaper-remote', ReaperRemote);
