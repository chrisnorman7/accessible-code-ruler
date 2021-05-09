# accessible-code-ruler README

This extension shows an error when the given line length is greater than the configured maximum.

## Features

* Show an error when the current line gets too long.
* Ability to show line length as a notification.
* Ability to move to the first overflowing character.
* Ability to disable the extension on a per-language basis.

## Extension Settings

This extension contributes the following settings:

* `accessibleCodeRuler.maximumLineLength`: Set the maximum allowed line length.
* `accessibleCodeRuler.ignoredLanguages`: The list of languages the extension should be disabled for.
* `accessibleCodeRuler.languageMaximumLineLength`: A dictionary of language and line length pairs.

## Extension Commands

This extension contributes the following commands, which can be bound to hotkeys in the usual way:

* `accessible-code-ruler.showLineLength`: Show a notification with the current line length.
* `accessible-code-ruler.gotoOverflowChar`: Move the cursor to the first character after the configured maximum line length. If the current line is shorter than this value, then the cursor will be moved to the end of the line instead.
* `accessible-code-ruler.addIgnoredLanguage`: Add the language of the current editor to the list of ignored languages for the current workspace.
* `accessible-code-ruler.removeIgnoredLanguage`: Remove the language of the current editor from the list of ignored languages for the current workspace.
* `accessible-code-ruler.setLanguageLineLength`: Open an input box to specify the line length for the language of the current editor.
