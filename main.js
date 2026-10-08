"use strict";
var obsidian = require("obsidian");

const MARKER = "\u200C"; // 零宽非连接符 ZWNJ

class TabIndentPlugin extends obsidian.Plugin {
    async onload() {
        console.log("Tab Indent loaded");

        // 文件内容缓存：path -> lines[]
        this.fileCache = new Map();

        // 文件被修改时，清掉它的缓存，保证阅读视图能更新
        this.registerEvent(
            this.app.vault.on("modify", (file) => {
                this.fileCache.delete(file.path);
            })
        );

        // 1. 拦截 Tab 键（捕获阶段，尽量抢在 CodeMirror 之前）
        this.registerDomEvent(document, "keydown", (evt) => {
            if (evt.key !== "Tab") return;

            const view = this.app.workspace.getActiveViewOfType(obsidian.MarkdownView);
            if (!view) return;

            const editor = view.editor;
            const cursor = editor.getCursor();
            const line = editor.getLine(cursor.line);

            // 排除：标题、列表、引用、代码块、空行、frontmatter 分隔线
            const isHeading = /^#{1,6}\s/.test(line);
            const isListOrQuote = /^\s*(?:[-+*]|\d+[.)]|>)\s+/.test(line);
            const isFence = /^\s{0,3}(?:```|~~~)/.test(line);
            const isMathFence = /^\s{0,3}(?:\$\$|\\\[|\\\])\s*$/.test(line);
            const isBlank = line.trim() === "";
            const isFrontmatterDelimiter = line.trim() === "---";
            const isTableRow = /^\s*\|/.test(line) || (line.includes("|") && /^\s*[:\-| ]+\s*$/.test(line));
            if (isHeading || isListOrQuote || isFence || isMathFence || isBlank || isFrontmatterDelimiter|| isTableRow) {
                return; // 不拦截，让 Tab 走原生行为
            }

            // 已经以标记开头，跳过，避免重复
            if (line.startsWith(MARKER)) return;

            // 在行首插入标记 + 一个 Tab 字符
            const inserted =MARKER+"\t"+"\t";
            editor.setLine(cursor.line, inserted+ line);
            editor.setCursor({ line: cursor.line, ch: cursor.ch + inserted.length });

            evt.preventDefault();
            evt.stopPropagation();
        }, true);

        // 2. 阅读视图：Markdown 后处理器
        this.registerMarkdownPostProcessor((el, ctx) => {
            const sectionInfo = ctx.getSectionInfo(el);
            if (!sectionInfo) return;

            const file = this.app.vault.getAbstractFileByPath(ctx.sourcePath);
            if (!file) return;

            const startLine = sectionInfo.lineStart;

            // 缓存命中：直接查
            if (this.fileCache.has(ctx.sourcePath)) {
                const lines = this.fileCache.get(ctx.sourcePath);
                const lineText = lines[startLine] || "";
                if (lineText.startsWith(MARKER)) {
                    el.classList.add("tab-indented-paragraph");
                }
                return;
            }

            // 缓存未命中：读一次文件，存入缓存
            this.app.vault.cachedRead(file).then((content) => {
                const lines = content.split("\n");
                this.fileCache.set(ctx.sourcePath, lines);

                const lineText = lines[startLine] || "";
                if (lineText.startsWith(MARKER)) {
                    el.classList.add("tab-indented-paragraph");
                }
            });
        });
    }

    onunload() {
        this.fileCache?.clear();
    }
}

module.exports = TabIndentPlugin;