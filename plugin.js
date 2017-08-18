// This file is a part of EnkindleReader project.
// Copyright (c) 2017 Aleksander Gajewski <adiog@brainfuck.pl>.

function context_menu_selection_callback(info, tab)
{
    let selected = info.selectionText;

    chrome.tabs.getSelected(null, function(tab){
        chrome.tabs.executeScript(tab.id, {
            code: 'var enkindle_reader_text = "' + selected + '";'
        }, function() {
            chrome.tabs.executeScript(tab.id, {file: 'inject.js'},
                function () {
                    chrome.tabs.executeScript(tab.id, {code: 'bootstrap();'});
                }
            );
        });
    });

}
