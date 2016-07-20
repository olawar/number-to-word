/**
 * Created by Awar on 2016-07-17.
 */
'use strict';

var values = {
ones: ['', 'jeden', 'dwa', 'trzy', 'cztery', 'pięć', 'sześć', 'siedem', 'osiem', 'dziewięć', 'dziesięć', 'jedenaście', 'dwanaście', 'trzynaście', 'czternaście', 'pietnaście', 'szesnaście', 'siedemnaście', 'osiemnaście','dziewiętnaście'],
tens: ['', '', 'dwadzieścia', 'trzydzieści', 'czterdzieści', 'pięćdziesiąt', 'sześćdziesiąt', 'siedemdziesiąt', 'osiemdziesiąt', 'dziewięćdziesiąt'],
hundreds: ['', 'sto', 'dwieście', 'trzysta', 'czterysta', 'pięćset', 'sześćset', 'siedemset', 'osiemset', 'dziewięćset'],
sufixes: [ ['', '', ''], ['tysiąc', 'tysiące', 'tysięcy'], ['milion', 'miliony', 'milionów'], ['miliard', 'miliardy', 'miliardów'], ['bilion', 'biliony', 'bilionów']  ],
currency: [ ['złoty', 'złote', 'złotych'], ['grosz', 'grosze', 'groszy']]
}

var app = {
    init: function() {
        this.validate();
    },
    validate: function() {
        var that = this,
            numberPattern = /^[0-9]{1,15}([.,][0-9]{1,2})?$/;

        $('form').on('submit', function(e){
            e.preventDefault();

            var inputArray = $('[data-number]').val().split(/[.,]/);

            // sprawdzamy czy wartosc inputa faktycznie jest pozadana liczbą
            if (! numberPattern.test($('[data-number]').val()))  {
              $('[data-alert]').css('color', 'red').text('tysiąc pięćset sto dziewięćset (czyli wpisz liczbę opcjonalnie z maksymalnie dwoma cyframi po przecinku lub kropce)');

            // jesli jest to konwertujemy ja na slowa - cene
            } else {
              $('[data-alert]').css('color', 'white').text(that.priceConverter(inputArray));
            }

        });
    },

    // dodanie warstwy cenowej
    priceConverter: function(numberArray) {
        var that = this,
            resultText = [];

        if (numberArray[1] !== undefined) {
            // jesli jest tylko jedna liczba po przecinku to musimy ja przeksztalcic na x * 10
            if (numberArray[1].length < 2) {
              numberArray[1] = 10 * parseInt(numberArray[1], 10);
            }
            resultText.push(that.numberToWord(parseInt(numberArray[0], 10)), chooseCurrency(parseInt(numberArray[0], 10), 0), that.numberToWord(parseInt(numberArray[1], 10)), chooseCurrency(parseInt(numberArray[1], 10), 1));
        } else {
          resultText.push(that.numberToWord(parseInt(numberArray[0], 10)), chooseCurrency(parseInt(numberArray[0], 10), 0));
        }
        return resultText.join(" ");

        // dobieranie odpowiedniej odmiany
        function chooseCurrency(number, currencyIndex) {
          var string = number.toString(),
              currencyChosen = [];

          if (number === 1) {
            currencyChosen.push(values.currency[currencyIndex][0]);
          }
          else if (parseInt(string.charAt(string.length - 1)) > 1 && parseInt(string.charAt(string.length - 1)) < 5) {
            currencyChosen.push(values.currency[currencyIndex][1]);
          } else {
            currencyChosen.push(values.currency[currencyIndex][2]);
          }
          return currencyChosen;
        }

    },

    // metoda zamiany liczby w tekst (tylko!)
    numberToWord: function(number) {
        var sayWords = [],
            stringNumber = number.toString(),
            arrayNumber = [];

            do {
                arrayNumber.unshift(stringNumber.slice(-3));
                stringNumber = stringNumber.slice(0, -3);
            }
            while (stringNumber.length > 0);

            // array padding aby wszystkie elementy miały 3 znaki
            arrayNumber[0] = String("000" + arrayNumber[0]).slice(-3);

            // okreslamy wartosci co 3
            for (var i = 0; i < arrayNumber.length; i ++) {
                var tempHundreds = parseInt(arrayNumber[i].charAt(0), 10),
                    tempTens     = parseInt(arrayNumber[i].charAt(1), 10),
                    tempOnes     = parseInt(arrayNumber[i].charAt(2), 10);

                sayWords.push(values.hundreds[tempHundreds]);
                sayWords.push(values.tens[tempTens]);
                if (tempTens === 1) {
                    tempOnes += 10;
                }
                // obsługa wyjątkow
                if ((arrayNumber[i] !== "001") || number === 1) {
                    sayWords.push(values.ones[tempOnes]);
                }
                if (number === 0) {
                    sayWords.push('zero');
                }
                // dodawanie sufiksow od tysiaca wzwyz
                if (arrayNumber[i] !== "000") {
                    if (arrayNumber[i] === "001") {
                        sayWords.push(values.sufixes[arrayNumber.length - i - 1][0]);
                    } else if (tempOnes > 1 && tempOnes < 5) {
                        sayWords.push(values.sufixes[arrayNumber.length - i - 1][1]);
                    } else {
                        sayWords.push(values.sufixes[arrayNumber.length - i - 1][2]);
                    }
                }
            }
        return sayWords.join(" ");
    }
};

$(document).ready(function() {
    app.init();
});
