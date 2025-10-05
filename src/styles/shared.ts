import { css } from 'lit';

export const buttonStyles = css`
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
`;
