﻿/// <reference path="badges.js" />
/// <reference path="timescore.js" />
/// <reference path="highscore.js" />

var elmTime = document.getElementById("time"),
    elmScore = document.getElementById("score"),
    rules = document.getElementById("rules"),
    reset = document.getElementById("reset"),
    elmBadges = document.getElementById("badges"),
    elmMeter = document.getElementById("meter"),
    ts = new TimeScore(),
    hs = new Highscore(),
    actives = [];

var current = new Date();
//current = new Date(2015, 4, 16, 4, 16);
//current.setHours(7); current.setMinutes(11); //localStorage.clear();

function calculate() {

    var result = ts.getScore(current),
        points = 0,
        lis = rules.getElementsByTagName("li");

    elmTime.innerHTML = result.time;
    clearResults();

    for (var i = 0; i < result.score.length; i++) {

        var score = result.score[i];
        points += score.points;

        for (var a = 0; a < lis.length; a++) {
            li = lis[a];

            if (score.points > 0 && li.innerHTML.lastIndexOf(score.rule) > -1) {
                li.className = "active";
                actives.push(li);
                break;
            }
        }
    }

    elmScore.innerHTML = points == 0 ? points : "<span class=\"active\">" + points + "</span>";
    if (points > 0) {
        hs.recordScore(current, points);
        updateHighscore();
        updateBadges();
    }
}

function clearResults() {

    for (var i = 0; i < actives.length; i++) {
        actives[i].className = "";
    }

    actives = [];
}

function updateHighscore() {
    var score = hs.getScore(current);
    document.getElementById("daily").firstElementChild.innerHTML = score.daily;
    document.getElementById("weekly").firstElementChild.innerHTML = score.weekly;
}

function showRules() {

    for (var name in ts.rules) {
        var rule = ts.rules[name];

        var point = rule.points === 1 ? "point" : "points";

        var li = document.createElement("li");
        li.innerHTML = "<span>" + rule.points + " " + point + "</span> - " + rule.rule;
        li.id = name;

        rules.appendChild(li);
    }
};

function updateBadges() {

    var badges = new Badges().getBadges();
    var badgesText = badges.length === 1 ? " badge" : " badges";

    elmBadges.firstElementChild.innerHTML = badges.length + badgesText;
    elmBadges.innerHTML = elmBadges.firstElementChild.outerHTML;

    if (elmBadges.childElementCount === badges.length + 1)
        return;

    for (var i = 0; i < badges.length; i++) {
        var badge = badges[i];

        var img = document.createElement("p")
        img.setAttribute("aria-label", badge.description);
        img.id = badge.id;
        img.tabIndex = 1;

        if (badge.user)
            img.className = "user";

        if (badge.level > 1) {
            var span = document.createElement("span");
            span.innerHTML = badge.level + "x";
            img.appendChild(span);
        }

        elmBadges.appendChild(img);
    }
}

showRules();
calculate();
updateHighscore();
updateBadges();

setInterval(function () {

    var date = new Date();

    elmMeter.style.width = (date.getSeconds() / 60 * 100) + "%";

    if (document.hidden || document.webkitHidden || document.mozHidden || document.msHidden || document.oHidden)
        return;

    if (date.getHours() != current.getHours() || date.getMinutes() != current.getMinutes()) {
        current = date;
        calculate();
    }
}, 1000);

reset.addEventListener("click", function (e) {
    e.preventDefault();

    if (confirm("This will reset the score. Are you sure?")) {
        localStorage.clear();
        updateHighscore();
        updateBadges();
    }
});

document.addEventListener("touchstart", function () { });