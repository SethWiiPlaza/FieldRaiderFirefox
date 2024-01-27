// ==UserScript==
// @name         Field Raider Firefox
// @namespace    http://tampermonkey.net/
// @version      1.73
// @description  Bypass field restrictions when pasting data from the clipboard (Ctrl + Alt + V)
// @author       Seth@WiiPlaza
// @match        :///*
// @icon         https://pbs.twimg.com/media/FR11DSvX0AI1W44.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const excludeRegex = /https?:\/\/.*?\.(facebook\.com|messenger\.com|google\.com|github\.com|imgur\.com).*/;
    const includeRegex = /https?:\/\/.*/;

    const allowCopyAndPaste = function(e) {
        e.stopImmediatePropagation();
        return true;
    };

    const isRestrictedSite = () => {
        const location = window.location.href;
        return includeRegex.test(location) && !excludeRegex.test(location);
    };

    const pasteCippi = async () => {
        const elemsUndeRat = document.querySelectorAll(":hover");
        const lastElemUndeRat = elemsUndeRat[elemsUndeRat.length - 1];
        const textInClippi = await navigator.clipboard.readText();
        if (lastElemUndeRat.tagName === 'INPUT' || lastElemUndeRat.tagName === 'TEXTAREA') {
            lastElemUndeRat.value = textInClippi;
            simulateKeyPresses(textInClippi);
        }
    };

    const simulateKeyPresses = (text) => {
        setTimeout(() => {
            const event = new KeyboardEvent('keydown', { key: ' ' });
            document.dispatchEvent(event);
            const eventBackspace = new KeyboardEvent('keydown', { key: 'Backspace' });
            document.dispatchEvent(eventBackspace);
        }, 0.2);
    };

    const triggerMoi = (event) => {
        if (event.altKey && event.ctrlKey && event.key === "y") {
            pasteCippi();
        }
    };

    document.addEventListener('keyup', triggerMoi, false);

    if (isRestrictedSite()) {
        document.addEventListener('copy', allowCopyAndPaste, true);
        document.addEventListener('paste', allowCopyAndPaste, true);
    }

})();