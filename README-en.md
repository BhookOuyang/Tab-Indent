# Tab Indent

Press Tab to add a first-line indent to a paragraph in Obsidian — similar to Word's "first line indent" (2 characters).
[中文说明](README.md)

## Features

- Press Tab at the beginning of a paragraph to indent that line
- Indentation is visible in both editing view and reading view
- The indent is stored as an invisible marker at the start of the line, so it doesn't pollute your Markdown syntax

## Usage

1. Start a new line and type at least one character
2. Press Tab at the beginning of the line — the line gets a first-line indent

**Note**: If the current line is empty, Tab triggers Obsidian's default behavior (inserting a tab or triggering autocomplete) instead of indenting. This is intentional, to prevent accidental indents.

## Indentation in Reading View

Markdown requires a **blank line between paragraphs** for them to be treated as separate paragraphs.

Therefore:

- To see the indent in **both** editing view and reading view → leave a blank line between paragraphs
- If you only care about editing view → no blank line needed

## When It Doesn't Work

Tab will fall back to Obsidian's default behavior on the following line types:

- Headings
- Lists and blockquotes
- Code blocks and math blocks
- Table rows
- Frontmatter delimiter (`---`)
- Empty lines

## Compatibility

Desktop only. The plugin relies on a physical Tab key; mobile soft keyboards have no Tab key, so it isn't published for mobile.

## Feedback

If you run into any issues or have suggestions, please open an issue on the GitHub repository.