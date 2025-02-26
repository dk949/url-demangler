const inputEl = document.getElementById('urlInput') as HTMLInputElement;
const outputEl = document.getElementById('output') as HTMLDivElement;
const copyBtnEl = document.getElementById('copyBtn') as HTMLButtonElement;
const pasteBtnEl = document.getElementById('pasteBtn') as HTMLButtonElement;
const resetBtnEl = document.getElementById('resetBtn') as HTMLButtonElement;
const goBtnEl = document.getElementById("goBtn") as HTMLButtonElement;

function demangle(inp: string): string {
    if (!inp.startsWith("http")) {
        inp = "https://" + inp;
    }
    if (!URL.canParse(inp)) throw Error("This doesn't look like a URL");
    const mangled = new URL(inp);
    const url = mangled.searchParams.get("url");
    if (!url) throw Error("This URL is not mangled");
    return url;
}

function updateOutput(content: string, isError = false) {
    outputEl.classList.remove("text-red-500");
    let contentEl: HTMLElement = outputEl;
    if (!isError) {
        const a = document.createElement("a");
        a.className = "text-amber-500 hover:text-amber-600 active:text-amber-800 underline";
        a.href = content;
        outputEl.textContent = "";
        outputEl.appendChild(a);
        contentEl = a;
    } else {
        outputEl.classList.add('text-red-500')
    }
    contentEl.textContent = content;
    copyBtnEl.disabled = isError;
}

async function handleProcess() {
    const url = inputEl.value.trim();
    if (!url) {
        updateOutput('Please enter a URL', true);
        return;
    }

    try {
        const result = demangle(url);
        updateOutput(result);
    } catch (error) {
        updateOutput(error instanceof Error ? error.message : 'Invalid URL', true);
    }
}

async function handlePaste() {
    try {
        const text = await navigator.clipboard.readText();
        inputEl.value = text;
        handleProcess();
    } catch (error) {
        updateOutput('Failed to access clipboard', true);
    }
}

async function handleCopy() {
    try {
        await navigator.clipboard.writeText(outputEl.textContent || '');
    } catch (error) {
        updateOutput('Failed to copy', true);
    }
}

function handleReset() {
    inputEl.value = '';
    outputEl.textContent = 'Enter URL above';
    outputEl.classList.remove("text-red-500");
    copyBtnEl.disabled = true;
}

goBtnEl.addEventListener('click', async (e) => {
    e.preventDefault();
    await handleProcess();
});

pasteBtnEl.addEventListener('click', handlePaste);
copyBtnEl.addEventListener('click', handleCopy);
resetBtnEl.addEventListener('click', handleReset);

inputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleProcess();
    }
});

inputEl.addEventListener("paste", handlePaste);
