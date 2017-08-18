// This file is a part of EnkindleReader project.
// Copyright (c) 2017 Aleksander Gajewski <adiog@brainfuck.pl>.

chrome.contextMenus.create(
    {
        'title': 'Read with Enkindle',
        'contexts': ['selection'],
        'onclick': context_menu_selection_callback
    }
);
