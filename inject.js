// This file is a part of EnkindleReader project.
// Copyright (c) 2017 Aleksander Gajewski <adiog@brainfuck.pl>.

var $DOM = $DOM || function(elementName, elementAttributes={})
{
    let dom = document.createElement(elementName);
    for(let attributeIndex in elementAttributes)
    {
        dom.setAttribute(attributeIndex, elementAttributes[attributeIndex]);
    }
    return dom;
};

var $$ = $$ || function(parentNode)
{
    for(let i = 1; i < arguments.length; i++)
    {
        parentNode.appendChild(arguments[i]);
    }
    return parentNode;
};

var $$$ = $$$ || function(parentNode, innerHTML)
{
    parentNode.innerHTML = innerHTML;
    return parentNode;
};

var $BIND = $BIND || function(dom, eventName, callback)
{
    dom.addEventListener(eventName, callback);
    return dom;
};

var $SWAP = $SWAP || function(oldNode, newNode)
{
    oldNode.parentNode.replaceChild(newNode, oldNode);
};

var $DEEPSWAP = $DEEPSWAP || function(lhsNode, rhsNode)
{
    let deepSwapPivot = div();
    $SWAP(lhsNode, deepSwapPivot);
    $SWAP(rhsNode, lhsNode);
    $SWAP(deepSwapPivot, rhsNode);
};

var div = div || function(attrs)
{
    return $DOM('div', attrs);
};

var input = input || function(attrs)
{
    return $DOM('input', attrs);
};

var i = i || function(attrs)
{
    return $DOM('i', attrs);
};

var button = button || function(attrs)
{
    return $DOM('button', attrs);
};

var form = form || function(attrs)
{
    return $DOM('form', attrs);
};

var label = label || function(attrs)
{
    return $DOM('label', attrs);
};

var pre = pre || function(attrs)
{
    return $DOM('pre', attrs);
};

var br = br || function(attrs)
{
    return $DOM('br', attrs);
};

var a = a || function(attrs)
{
    return $DOM('a', attrs);
};

var p = p || function(attrs)
{
    return $DOM('p', attrs);
};

var img = img || function(attrs)
{
    return $DOM('img', attrs)
};

var source = source || function(attrs)
{
    return $DOM('source', attrs);
};

var embed = embed || function(attrs)
{
    return $DOM('embed', attrs);
};

var video = video || function(attrs)
{
    return $DOM('video', attrs);
};

var span = span || function(attrs)
{
    return $DOM('span', attrs);
};

var textarea = textarea || function(attrs)
{
    return $DOM('textarea', attrs);
};

var select = select || function(attrs)
{
    return $DOM('select', attrs);
};

var option = option || function(attrs)
{
    return $DOM('option', attrs);
};

var table = table || function(attrs)
{
    return $DOM('table', attrs);
};

var tr = tr || function(attrs)
{
    return $DOM('tr', attrs);
};

var td = td || function(attrs)
{
    return $DOM('td', attrs);
};


var Button = Button || function(label)
{
    return $$$(button(), label);
};// This file is a part of EnkindleReader project.
// Copyright (c) 2017 Aleksander Gajewski <adiog@brainfuck.pl>.

var LineReaderComponent = LineReaderComponent || class {
    constructor(enkindleController) {
        this.enkindleController = enkindleController;

        this.dom = $$(div({style: 'position: absolute; z-index: -1; top: 40%; left: 10%; width: 80%; font-family: monospace; padding: 0.5em; border-top: 1px solid black; border-bottom: 1px solid black;'}),
            this.leadingLetters = span({style: 'color: lightgray;'}),
            this.leadingWord = span({style: 'color: black;'}),
            this.centerLetter = span({style: 'color: darkorange;'}),
            this.trailingWord = span({style: 'color: black;'}),
            this.trailingLetters = span({style: 'color: lightgray;'})
        );
        this.recalculateSpeed();
        this.inactiveTimeout = 1000;
        this.spaces = Array(99).join(' ');

        this.textArray = [];
    }

    recalculateSpeed() {
        this.wordTimeout = 60000.0 / this.enkindleController.context.speed;
    }

    sanitizeText(text) {
        /*console.log(text);
        let sanitizedText = text.replace(/\n/mg, ' ')
                                .replace(/\t/mg, ' ')
                                .replace(/  /mg, ' ')
                                .replace(/[^\x20-\x7E]+/g, '')
                                .replace(/^ \/g, '')
                                .replace(/ *$/g, '');
        console.log(sanitizedText);*/
        return text;
    }

    sanitizeTextArray(textArray) {
        for (let index in textArray) {
            if ((typeof textArray[index]) !== 'string') {
                textArray[index] = ' ';
            }
        }
        return textArray;
    }

    load(text) {
        this.text = this.sanitizeText(text);
        this.textArray = this.sanitizeTextArray(text.split(' '));
        this.enkindleController.playerComponent.updateTimeButton();
    }

    underscore(letter) {
        if (letter == ' ') {
            return '_';
        } else {
            return letter;
        }
    }

    refresh(positionArg) {
        let position = positionArg;
        if (position < this.textArray.length) {
            this.enkindleController.context.position = position;

            console.log(this.enkindleController.context.position);

            let leadingLetters = this.enkindleController.settings.radius;
            let trailingLetters = Math.round(1.5 * leadingLetters);
            let word = this.textArray[position];
            if (!(word.length > 0)) {
                word = '_';
            }

            let highlightedLetterPostition = Math.round(word.length * 0.3);
            let leadingWordLength = highlightedLetterPostition;
            let trailingWordLength = word.length - leadingWordLength - 1;
            let leadingWord = word.substr(0, highlightedLetterPostition);
            let trailingWord = word.substr(highlightedLetterPostition + 1);

            this.leadingWord.innerHTML = leadingWord;
            this.centerLetter.innerHTML = this.underscore(word[highlightedLetterPostition]);
            this.trailingWord.innerHTML = trailingWord;

            let paddingFront = this.getWords(leadingLetters - leadingWordLength, position - 1, -1);
            this.leadingLetters.innerHTML = paddingFront.replace(/ /g, '&nbsp;');
            this.trailingLetters.innerHTML = this.getWords(trailingLetters - trailingWordLength, position + 1, 1);
        }
        else {
            this.postPlay();
        }
    }

    isInBounds(position) {
        return ((position >= 0) && (position < this.textArray.length));
    }

    getWords(remainingLetters, startingPosition, direction) {
        let returnString = '';
        let position = startingPosition;
        while (this.isInBounds(position) && (remainingLetters >= 1 + this.textArray[position].length)) {
            if (direction > 0) {
                returnString = returnString + ' ' + this.textArray[position];
            }
            else {
                returnString = this.textArray[position] + ' ' + returnString;
            }
            remainingLetters -= (this.textArray[position].length + 1);
            position += direction;
        }
        if ((direction < 0) && (remainingLetters > 0)) {
            returnString = this.spaces.substr(-remainingLetters) + returnString;
        }
        return returnString;
    }

    play() {
        let that = this;

        if ((this.enkindleController.isPlaying) && (this.enkindleController.context.position < this.textArray.length)) {
            this.enkindleController.context.position += 1;
            this.enkindleController.doSetPosition(this.enkindleController.context.position);
            this.refresh(this.enkindleController.context.position);
            this.enkindleController.playerComponent.updateTimeButton();
            setTimeout(function () {
                that.play();
            }, this.wordTimeout);
        }
        else {
            if (this.enkindleController.isPlaying) {
                this.postPlay();
                return;
            }
            this.enkindleController.isPlaying = false;
            setTimeout(function () {
                that.play();
            }, this.inactiveTimeout);
        }
    }

    changeSpeed(relativeSpeed) {
        this.enkindleController.context.speed += relativeSpeed;
        this.enkindleController.playerComponent.speedLabel.innerHTML = this.enkindleController.context.speed + 'wpm';
        this.recalculateSpeed();
        this.enkindleController.playerComponent.updateTimeButton();
    }

    postPlay() {
        let post = this.leadingLetters.innerHTML +
            this.leadingWord.innerHTML +
            this.centerLetter.innerHTML +
            this.trailingWord.innerHTML +
            this.trailingLetters.innerHTML;
        this.leadingLetters.innerHTML = '';
        this.leadingWord.innerHTML = '';
        this.centerLetter.innerHTML = '';
        this.trailingWord.innerHTML = '';
        this.trailingLetters.innerHTML = post;
        this.enkindleController.close();
    }

    getDom() {
        return this.dom;
    }
};// This file is a part of EnkindleReader project.
// Copyright (c) 2017 Aleksander Gajewski <adiog@brainfuck.pl>.

var PlayerComponent = PlayerComponent || class{
    constructor(enkindleController) {
        let that = this;

        this.enkindleController = enkindleController;

        this.dom =
            $$(div({class: 'ui segment', style: 'width: 100%'}),
                this.fastBackwardButton = Button('fast backward'),
                this.playButton = Button('play'),
                this.decreaseSpeedButton = Button('minus'),
                this.speedLabel = Button('speed'),
                this.increaseSpeedButton = Button('plus'),
                this.timeLabel = Button('time'),
                this.closeButton = Button('close')
            );

        this.fastBackwardButton.addEventListener('click', function () {
            that.enkindleController.context.position = 0;
            that.enkindleController.doSetPosition(0);
        });

        this.playButton.addEventListener('click', function () {
            that.togglePlay();
        });

        this.increaseSpeedButton.addEventListener('click', function () {
            that.enkindleController.lineReaderComponent.changeSpeed(10);
        });

        this.decreaseSpeedButton.addEventListener('click', function () {
            that.enkindleController.lineReaderComponent.changeSpeed(-10);
        });

        this.closeButton.addEventListener('click', function(){
           that.enkindleController.close();
        });
    }

    getDom() {
        return this.dom;
    }

    togglePlay() {
        this.enkindleController.isPlaying = !this.enkindleController.isPlaying;
    }

    updateTimeButton() {
        this.timeLabel.innerHTML = this.enkindleController.context.position + '/' + this.enkindleController.lineReaderComponent.textArray.length;
    }

    updateProgressBar(position) {
        this.enkindleController.doSetPosition(position);
    }
};// This file is a part of EnkindleReader project.
// Copyright (c) 2017 Aleksander Gajewski <adiog@brainfuck.pl>.

var EnkindleController = EnkindleController || class {
    constructor(text) {
        let that = this;

        console.log(window.pageYOffset);

        this.dom = $$(div({style: 'position: absolute; left: 0px; top: ' + window.pageYOffset + 'px; width: 100%; height: 100%; background-color: rgba(255, 255, 255, 0.95); z-index: 1024;'}),
            this.middleSegment = $$(div({style: 'position: absolute; top: 45%; left: 5%; width: 90%;'}),
                this.lineReaderSegment = div()
            ),
            this.bottomSegment = $$(div({
                    class: 'ui segment',
                    style: 'position: absolute; bottom: 2%; left: 5%; width: 90%;'
                }),
                this.playerButtonsSegment = div()
            )
        );

        let defaultText = text;

        let defaultSettings = {
            fontSize: 2.0,
            showRadius: true,
            radius: 30
        };

        this.settings = defaultSettings;

        let defaultContext = {
            position: 0,
            speed: 500,
            bookmarks: {}
        };

        this.context = defaultContext;

        this.text = text;

        this.lineReaderComponent = new LineReaderComponent(this);
        this.lineReaderSegment.appendChild(this.lineReaderComponent.getDom());

        this.playerComponent = new PlayerComponent(this);
        this.playerButtonsSegment.appendChild(this.playerComponent.getDom());

        this.lineReaderComponent.load(this.text);
        this.lineReaderComponent.changeSpeed(0);
        this.setPosition(this.context.position);

        this.addTogglePlayEventListeners();

        setTimeout(function() {
            that.isPlaying = true;
            that.lineReaderComponent.play();
        }, 200);
    }

    close(){
        this.dom.parentNode.removeChild(this.dom);
    }

    addTogglePlayEventListeners() {
        let that = this;
        document.body.onkeyup = function (e) {
            if (e.keyCode === 32) {
                that.playerComponent.togglePlay();
            }
        };
    }

    setPosition(position) {
        this.context.position = position;
        this.doSetPosition(position);

    }

    doSetPosition(position) {
        this.context.position = position;
        this.playerComponent.updateTimeButton();
        this.lineReaderComponent.refresh(position);
    }

    setFontSize(fontSize) {
        this.settings.fontSize = fontSize;
        if (this.lineReaderComponent) {
            this.lineReaderComponent.getDom().style.fontSize = fontSize + 'em';
        }
    }

    setRadius(radius) {
        this.settings.radius = radius;
        if (this.lineReaderComponent) {
            this.lineReaderComponent.refresh(this.position);
        }
    }

    toggleRadius(showRadius = null) {
        if (showRadius === null) {
            this.settings.showRadius = !this.settings.showRadius;
        }
        else {
            this.settings.showRadius = showRadius;
        }
        if (this.lineReaderComponent) {
            if (this.settings.showRadius) {
                this.lineReaderComponent.leadingLetters.style.visibility = 'visible';
                this.lineReaderComponent.trailingLetters.style.visibility = 'visible';
            }
            else {
                this.lineReaderComponent.leadingLetters.style.visibility = 'hidden';
                this.lineReaderComponent.trailingLetters.style.visibility = 'hidden';
            }
        }
    }
};

var bootstrap = bootstrap || function() {
    let enkindleController = new EnkindleController(enkindle_reader_text);
    document.body.appendChild(enkindleController.dom);
};