import '/public/css/style.css';

import './';
import '@sagemodeninja/fluent-command-bar-component';
import '@sagemodeninja/fluent-icon-element-component';
import { DesignToken } from '@sagemodeninja/design-token-provider';
import colorSchemeProvider from '@sagemodeninja/color-scheme-provider';

document.addEventListener('DOMContentLoaded', () => {
    const toggleMode = document.getElementById('toggle_mode');
    const togglePanel = document.getElementById('toggle_panel');
    const panel = document.getElementById('panel');

    const applyDesignTokens = () => {
        const fillTextPrimary = new DesignToken<string>('fill-text-primary');
        const fillTextSecondary = new DesignToken<string>('fill-text-secondary');
        const fillSubtleSecondary = new DesignToken<string>('fill-subtle-secondary');
        const fillSubtleTertiary = new DesignToken<string>('fill-subtle-tertiary');
        const backgroundFillAcrylicDefault = new DesignToken<string>(
            'background-fill-acrylic-default'
        );
        const backgroundFillMicaBase = new DesignToken<string>('background-fill-mica-base');
        const strokeSurfaceFlyout = new DesignToken<string>('stroke-surface-flyout');
        const shadowFlyout = new DesignToken<string>('shadow-flyout');

        const isLight = colorSchemeProvider.colorScheme === 'light';

        document.body.style.colorScheme = isLight ? 'light' : 'dark';
        fillTextPrimary.setDefault(isLight ? 'rgb(0 0 0 / 89.56%)' : '#ffffff');
        fillTextSecondary.setDefault(isLight ? 'rgb(0 0 0 / 60.63%)' : 'rgb(255 255 255 / 78.6%)');
        fillSubtleSecondary.setDefault(isLight ? 'rgb(0 0 0 / 3.73%)' : 'rgb(255 255 255 / 6.05%)');
        fillSubtleTertiary.setDefault(isLight ? 'rgb(0 0 0 / 2.41%)' : 'rgb(255 255 255 / 4.19%)');
        backgroundFillAcrylicDefault.setDefault(isLight ? '#fcfcfc' : '#2c2c2c');
        backgroundFillMicaBase.setDefault(isLight ? '#f3f3f3' : '#202020');
        strokeSurfaceFlyout.setDefault(isLight ? 'rgb(0 0 0 / 5.78%)' : 'rgb(0 0 0 / 20%)');
        shadowFlyout.setDefault(isLight ? 'rgb(0 0 0 / 14%)' : 'rgb(0 0 0 / 26%)');
    };

    // Mode
    applyDesignTokens();
    toggleMode.addEventListener('click', () => colorSchemeProvider.toggle());
    colorSchemeProvider.subscribeNotification(applyDesignTokens);

    // Panel
    togglePanel.addEventListener('click', () => {
        panel.hidden = false;
    });

    panel.addEventListener('dismiss', () => {
        panel.hidden = true;
    });
});
