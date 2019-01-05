// ==UserScript==
// @name         Neopets Sidebar Pets
// @namespace    http://samkeddy.com
// @version      1.0
// @description  Adds all 4 pets into your sidebar!
// @author       Sam Keddy (skeddles)
// @match        http://www.neopets.com/*
// @grant       GM.setValue
// @grant       GM.getValue
// ==/UserScript==

console.log('SIDEBAR PETS - script loaded');

(async function() {
    'use strict';

    var sidebar = document.querySelector('td.sidebar .sidebarModule:first-child');

    function getPage (url, callback) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                callback(this.responseText);
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    }


    function updateData () {
        console.log('updating data');
        var username = document.querySelector('.user a:first-child');

        if (!username) return console.log('SIDEBAR PETS - not logged in');
        else username = username.innerHTML;

        getPage( '/userlookup.phtml?user='+username, function (response) {
                var results = response.match(/<a .*><img src="http:\/\/pets\.neopets\.com.*\.png"/gmi);
                var petObjects = [];
                var pets = results.slice(0,4);
                console.log('pets',pets);


                function getPet () {
                    console.log('SIDEBAR PETS - getting pet',pets[0]);

                    var pet = {
                        name: /href="\/petlookup\.phtml\?pet=(.*?)"/gmi.exec(pets[0])[1],
                        page: /href="(.*?)"/gmi.exec(pets[0])[1],
                        image: /src="(.*?)"/gmi.exec(pets[0])[1],
                    };

                    getPage (pet.page, function (result) {
                          //console.log(result);
                        var sick = /suffering from/mi.exec(result);
                        pet.sick = sick ? true : false;

                        petObjects.push(pet);
                        //remove pet from array and start fetching next one
                        pets.shift();
                        if (pets.length > 0)
                            getPet();
                        else {


                           GM.setValue('showpetsdata', JSON.stringify({lastUpdate: new Date(), pets: petObjects}));
                           draw(petObjects);
                        }
                    });

                }
               getPet();
        });
    }

    function draw (data) {
       console.log('SIDEBAR PETS - putting pets on sidebar',data);


        if (!sidebar) return console.log('SIDEBAR PETS - sidebar not found, not adding sidebar pets');

        sidebar.innerHTML = 'Loading Pets';
        sidebar.style.width = "154px";
        sidebar.style.position = "relative";
        //sidebar.style.backgroundColor = "#ffd026";
        //sidebar.style.padding = "2px";

        var html = '';

       data.forEach(pet => {
           html += '<div style="font-weight: bold; padding: 0.5em 0 ;text-align: center; border: solid 2px #c9c9c9; background: #ffd026; width: 154px; overflow: hidden"><a style="color: black" title="View '+pet.name +'\'s Pet Page" href="'+pet.page+'">'+pet.name +'</a></div>';
           if (pet.sick) html += '<img title="This pet is sick!" style="position: absolute; right: 10px; margin-top: 10px;" src="https://i.imgur.com/iH67xQX.png" />';
           html += '<a title="Customize '+pet.name+'" href="/customise/?view='+pet.name+'"><img style="background: white; box-sizing: border-box; padding: 2px; border: solid 2px #c9c9c9; border-top: 0; border-bottom: 0;" src="'+pet.image +'" /></a>';
       });

        html += '<div style="border: solid 2px #c9c9c9; padding:10px;"><a href="/quickref.phtml">Quick Reference</a></div>'

        html += '<div style="border: solid 2px #c9c9c9; padding:10px; font-size: 0.75em; border-top: 0"><a id="sidebar-pets-update" href="#">Update Sidebar</a><img id="sidebar-pets-settings" style="cursor:pointer; margin-bottom: -4px; margin-left: 10px;" src="https://i.imgur.com/4yI03Q0.png" /></div>'

        sidebar.innerHTML = html;

        document.getElementById('sidebar-pets-update').addEventListener('click', function (e) {
            e.target.outerHTML = 'loading...';
            e.preventDefault();
            updateData();
        });


        document.getElementById('sidebar-pets-settings').addEventListener('click', async function (e) {
            var currentValue = await GM.getValue('refresh') || 12;
            var newValue = prompt('Sidebar Pets: How many hours should I wait before refreshing?',currentValue);
            GM.setValue('refresh',newValue);
        });
    }


    var pets = await GM.getValue('showpetsdata');



    if (pets) {
        var saveData = JSON.parse(pets)
        console.log('SIDEBAR PETS - data:',saveData);

        var hoursSinceUpdate = (new Date() - new Date(saveData.lastUpdate)) / 1000 / 60 / 60;


        draw(saveData.pets);

        var refreshTime = await GM.getValue('refresh') || 12;

        console.log('SIDEBAR PETS - hours since update:',hoursSinceUpdate,'/',refreshTime,hoursSinceUpdate > refreshTime ? 'time to refresh' : 'not ready to refresh');

        if (hoursSinceUpdate > refreshTime) {
            updateData();
        }


    }
    else {
        sidebar.innerHTML = '<div style="font-weight: bold; padding: 0.5em 0 ;text-align: center; border: solid 2px #c9c9c9; background: #ffd026; width: 154px; overflow: hidden">Sidebar Pets</div><div style="border: solid 2px #c9c9c9; padding:10px; font-size: 0.75em; border-top: 0">Loading...</div>';
        console.log('SIDEBAR PETS - not yet configured, getting pet data');

        updateData();

    }
    

    //


})();