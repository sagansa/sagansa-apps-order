export function loadScript(src, callback, dataAttributes = {}) {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;

    for (const key in dataAttributes) {
        if (Object.hasOwnProperty.call(dataAttributes, key)) {
            script.setAttribute(key, dataAttributes[key]);
        }
    }

    script.onload = () => {
        if (callback) callback();
    };
    script.onerror = () => {
        console.error(`Failed to load script: ${src}`);
    };
    document.body.appendChild(script);
}
