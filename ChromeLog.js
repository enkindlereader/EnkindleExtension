// This file is a part of EnkindleReader project.
// Copyright (c) 2017 Aleksander Gajewski <adiog@brainfuck.pl>.

function do_log(o)
{
    if (window.chrome && chrome.runtime && chrome.runtime.id)
    {
        chrome.extension.getBackgroundPage().console.log(o);
    }
    else
    {
        console.log(o);
    }
}

const log =
    function()
{
    for(let i = 0; i < arguments.length; i++)
    {
        do_log(arguments[i]);
    }
};

