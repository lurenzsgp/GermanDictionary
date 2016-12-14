var dictionary = {};
$(document).ready(function () {
    $.getJSON("vocabolary.json", function(data) {
        dictionary = data;

        clearInputText();
        showVocabolaryList(dictionary);
    });

    $('#searchBar').focus();
    $('#searchBar').on("change paste keyup", updateList);
    $('#swap').click(swap);
    $('#addWord').click(newWord);
    $('#modalNewWord').on('shown.bs.modal', function () {
        $('#german-word').focus();
    })

    $('#searchBar').keypress(function (e) {
        if (e.which == 13) {
            $('#addButton').click();
        }
    });
    $('#italian-word').keypress(function (e) {
        if (e.which == 13) {
            $('#german-word').focus();
        }
    });
    $('#german-word').keypress(function (e) {
        if (e.which == 13) {
            $('#addWord').click();
        }
    });
});

function newWord () {
    var it = $('#italian-word').val();
    var de = $('#german-word').val();
    dictionary[it] = {};
    dictionary[it].frequency = 0;
    dictionary[it].translation = de;

    $('#modalNewWord').modal('toggle');
    clearInputText();

    refreshVocabolaryList();
}

function clearInputText() {
    $('#searchBar').val('');
    $('#italian-word').val('');
    $('#german-word').val('');
}

function swap () {
    var it = $('#italian-word').val();
    var de = $('#german-word').val();
    $('#italian-word').val(de);
    $('#german-word').val(it);
}

function updateList() {
    var text = $('#searchBar').val();
    $('#italian-word').val(text);
    var word = $('#vocabolary table tbody tr');
    $.each(word, function(index, row) {
        var ita = $($(row).children('td')[1]).text();
        var ger = $($(row).children('td')[2]).text();

        var pattern = new RegExp('\w*' + text + '\w*', 'i');
        if (pattern.test(ita) || pattern.test(ger)) {
            $(row).removeClass('hide');
        } else {
            $(row).addClass('hide');
        }
    });
}

function showVocabolaryList() {
    // empty table
    $('#vocabolary table tbody tr').remove();

    //order dictionary
    var sortable = [];
    for (var item in dictionary)
    sortable.push([item, dictionary[item].frequency]);

    sortable.sort(function(a, b) {
        return b[1] - a[1]
    })

    // add element to table
    for (var index in sortable) {
        var key = sortable[index][0];
        $('#vocabolary table tbody').append('<tr><td><span class="badge">' + dictionary[key].frequency + '</span></td><td>' + key + '</td><td>' + dictionary[key].translation + '</td></tr>');
    }

    $('#vocabolary table tbody tr').click(updateFrequency);
}

function refreshVocabolaryList() {
    // empty table
    $('#vocabolary table tbody tr').remove();
    showVocabolaryList();
}

function updateFrequency() {
    var key = $($(this).children()[1]).text();
    dictionary[key].frequency ++;

    refreshVocabolaryList();
}
