# accessible-code-ruler README

This extension shows an error when the given line length is greater than the configured maximum.

## Features

* Show an error when the current line gets too long.
* Ability to show line length as a notification.
* Ability to move to the first overflowing character.

## Extension Settings

This extension contributes the following settings:

* `accessible-code-ruler.maximumLineLength`: Set the maximum allowed line length.

## Extension Commands

This extension contributes the following commands, which can be bound to hotkeys in the usual way:

* `accessible-code-ruler.showLineLength`: Show a notification with the current line length.
* `accessible-code-ruler.gotoOverflowChar`: Move the cursor to the first character after the configured maximum line length. If the current line is shorter than this value, then the cursor will be moved to the end of the line instead.

### For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)
* [GitHub Repository](https://github.com/chrisnorman7/accessible-code-ruler)
