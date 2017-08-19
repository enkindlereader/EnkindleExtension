// This file is a part of EnkindleReader project.
// Copyright (c) 2017 Aleksander Gajewski <adiog@brainfuck.pl>.

function context_menu_selection_callback(info, tab) {
    var selected = info.selectionText;
console.log(selected);
    var tab = browser.tabs.getCurrent();
       //       browser.tabs.getCurrent();

    browser.tabs.executeScript(tab.id, {
        code: 'var enkindle_reader_text = "' + selected + '";'
    }, function () {
        browser.tabs.executeScript(tab.id, {file: 'inject.js'},
            function () {
                browser.tabs.executeScript(tab.id, {code: 'bootstrap();'});
            }
        );
    });
}
