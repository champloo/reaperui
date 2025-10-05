import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { buttonStyles } from '../styles/shared';
import type { CommandAction } from '../types/index';

@customElement('control-button')
export class ControlButton extends LitElement {
    static styles = [
        buttonStyles,
        css`
            :host {
                display: block;
            }
        `
    ];

    @property({ type: String })
    action!: CommandAction;

    @property({ type: String })
    label!: string;

    @property({ type: String })
    title!: string;

    @property({ type: String })
    icon!: string;

    @property({ type: String })
    variant: 'default' | 'record' | 'discard' = 'default';

    @property({ type: Boolean })
    active = false;

    private handleClick() {
        this.dispatchEvent(
            new CustomEvent('button-click', {
                detail: { action: this.action },
                bubbles: true,
                composed: true
            })
        );
    }

    render() {
        const classes = {
            'control-btn': true,
            'active': this.active && this.variant === 'default',
            'play-active': this.active && this.action === 'play',
            'record': this.variant === 'record',
            'record-active': this.active && this.variant === 'record',
            'discard': this.variant === 'discard'
        };

        return html`
            <button
                class=${classMap(classes)}
                @click=${this.handleClick}
                title=${this.title}>
                ${unsafeHTML(this.icon)}
                <span>${this.label}</span>
            </button>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'control-button': ControlButton;
    }
}
