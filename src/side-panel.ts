import { customComponent, CustomComponent } from '@sagemodeninja/custom-component';
import anime from 'animejs/lib/anime.es.js';

@customComponent('side-panel')
export class SidePanel extends CustomComponent {
    static styles = `
        :host([hidden]) {
            display: flex;
        }

        :host([is-hidden]) {
            display: none;
        }

        .positioning-region,
        .overlay {
            position: fixed;
            inset: 0px;
        }

        .positioning-region {
            display: flex;
            justify-content: center;
            z-index: 1000;
        }

        .overlay {
            background-color: rgba(0, 0, 0, 0.3);
        }

        .panel {
            background-color: var(--background-fill-acrylic-default);
            backdrop-filter: blur(30px);
            -webkit-backdrop-filter: blur(30px);
            border: solid 1px var(--stroke-surface-flyout);
            border-radius: 7px;
            box-shadow: 0px 8px 16px var(--shadow-flyout);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            position: fixed;
            inset: 16px;
            left: auto;
        }

        .header,
        .footer {
            align-items: center;
            box-sizing: border-box;
            display: flex;
            flex-shrink: 0;
            height: 50px;
            padding: 0px 16px;
        }

        .header {
            justify-content: space-between;
        }

        .title {
            color: var(--fill-text-primary);
            font-family: 'Segoe UI Variable', sans-serif;
            font-size: 20px;
            font-variation-settings: 'wght' 600, 'opsz' 28;
        }
        
        .dismiss-button {
            align-items: center;
            border-radius: 4px;
            box-sizing: border-box;
            color: var(--fill-text-primary);
            cursor: default;
            display: flex;
            height: 32px;
            justify-content: center;
            width: 32px;
        }
        
        .dismiss-button:active {
            background-color: var(--fill-subtle-tertiary);
            color: var(--fill-text-secondary);
        }

        @media (hover: hover) {
            .dismiss-button:hover {
                background-color: var(--fill-subtle-secondary);
            }
        }

        .body {
            box-sizing: border-box;
            flex-grow: 1;
            overflow: auto;
            padding: 8px 16px;
        }

        .footer {
            border-top: solid 1px var(--stroke-surface-flyout);
        }

        .no-footer {
            display: none;
        }
    `;

    private _firstRender: boolean = true;
    private _overlayDiv: HTMLDivElement;
    private _panelDiv: HTMLDivElement;
    private _panelTitleSpan: HTMLSpanElement;
    private _dismissButton: HTMLDivElement;
    private _footerSlot: HTMLSlotElement;
    private _footerDiv: HTMLSlotElement;

    static get observedAttributes() {
        return ['title', 'width', 'hidden'];
    }

    /* Attributes */
    get width(): number {
        const value = this.getAttribute('width');

        if (!value) return 498;

        return parseInt(value);
    }

    set width(value: number) {
        this.setAttribute('width', value.toString());
        this.setWidth();
    }

    /* DOM */
    get overlayDiv() {
        this._overlayDiv ??= this.shadowRoot.querySelector('.overlay');
        return this._overlayDiv;
    }

    get panelDiv() {
        this._panelDiv ??= this.shadowRoot.querySelector('.panel');
        return this._panelDiv;
    }

    get panelTitleSpan() {
        this._panelTitleSpan ??= this.shadowRoot.querySelector('.title');
        return this._panelTitleSpan;
    }

    get dismissButton() {
        this._dismissButton ??= this.shadowRoot.querySelector('.dismiss-button');
        return this._dismissButton;
    }

    get footerDiv() {
        this._footerDiv ??= this.shadowRoot.querySelector('.footer');
        return this._footerDiv;
    }

    get footerSlot() {
        this._footerSlot ??= this.shadowRoot.querySelector('.footer slot');
        return this._footerSlot;
    }

    render() {
        return `
            <div class="positioning-region" part="positioning-region">
                <div class="overlay" part="overlay"></div>
                <div class="panel">
                    <div class="header" part="header">
                        <span class="title" part="title"></span>
                        <div class="dismiss-button" part="dismiss-button">
                            <fluent-symbol-icon Symbol="ChromeClose" font-size="12"/>
                        </div>
                    </div>
                    <div class="body" part="body">
                        <slot></slot>
                    </div>
                    <div class="footer no-footer" part="footer">
                        <slot name="footer"></slot>
                    </div>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        this.setTitle();
        this.setWidth();
        this.setVisibility();

        this._firstRender = false;

        this.overlayDiv.addEventListener('click', () => this.dismiss());
        this.dismissButton.addEventListener('click', () => this.dismiss());

        this.footerSlot.addEventListener('slotchange', () => {
            this.footerDiv.classList.remove('no-footer');
        });
    }

    attributeChangedCallback() {
        this.setTitle();
        this.setWidth();
        this.setVisibility();
    }

    private setTitle() {
        this.panelTitleSpan.innerText = this.title;
    }

    private setWidth() {
        this.panelDiv.style.width = `${this.width}px`;
    }

    private setVisibility() {
        const right = !this.hidden ? '15px' : `-${32 + this.width}px`;
        const opacity = !this.hidden ? 1 : 0;

        if (this._firstRender) {
            this.toggleAttribute('is-hidden', this.hidden);
            this.overlayDiv.style.opacity = opacity.toString();
            this.panelDiv.style.right = right;
            return;
        }

        if (!this.hidden) {
            this.toggleAttribute('is-hidden', false);
        }

        const timeline = anime.timeline({
            easing: 'easeInOutQuad',
            duration: 150,
            complete: () => this.toggleAttribute('is-hidden', this.hidden),
        });

        // prettier-ignore
        timeline
            .add({
                targets: this.panelDiv,
                right: right,
            })
            .add({
                targets: this.overlayDiv,
                opacity: opacity,
            }, 0);
    }

    private dismiss() {
        const event = new CustomEvent('dismiss');
        this.dispatchEvent(event);
    }
}
