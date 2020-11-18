import { Injectable, Renderer2 } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AppHeightService {
    public renderer?: Renderer2;
    private _detachListeners?: () => void;

    constructor() {

    }

    public init(renderer: Renderer2) {
        this.renderer = renderer;

        // Handle getting screen height css variables
        const appHeight = () => {
            try {
                const windowHeight = window.innerHeight;

                const doc = document.documentElement;

                doc.style.setProperty('--app-height-100', `${windowHeight}px`);
            } catch(error) {
                if (!environment.production) {
                    console.error(error);
                    debugger;
                }
            }
        }

        const _onResize = () => {
            appHeight();
        }

        const _off__resize = this.renderer.listen('window', 'resize', _onResize);
        const _off__orientationchange = this.renderer.listen('window', 'orientationchange', _onResize);

        this._detachListeners = () => {
            _off__resize();
            _off__orientationchange();
        };

        appHeight();
    }

    public detach(): void {
        this._detachListeners && this._detachListeners();
    }
}
