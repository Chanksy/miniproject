let mapping = [49, 36, 46, 44, 47, 38];
let d = ["Crash", "Kick", "Open HiHat", "Closed HiHat", "Med Tom", "Snare"];
var isplaying;
var delay;
var beat = 1;
var bpm_slider;
var volume_slider;
var bpm;

function createDrumButtons() {
    var size = 28;
    for (var i = 1; i < 7; i++) {
        $('<div class="row" id="row-' + i + '"></div>').appendTo(document.getElementById("drumbuttons"));
        $('<button id="drum-' + i + '" type="button" class="btn btn-outline-primary active" data-toggle="button" aria-pressed="false" id="toggle-row-' + i + '" style="height: ' + size + 'px; width: ' + size*3.8 + 'px; margin: 1px;"></button>').prependTo(document.getElementById("row-" + i));
        for (var j = 1; j < 17; j++) {
            if (j < 5) {
                $('<button type="button" class="btn btn-outline-primary sample" data-toggle="button" aria-pressed="false" data-row="' + i + '" data-column="' + j + '" style="height:' + size + 'px;width:' + size + 'px; margin: 1px;"></button>').appendTo(document.getElementById("row-" + i));
            } else if (j < 9) {
                $('<button type="button" class="btn btn-outline-secondary sample" data-toggle="button" aria-pressed="false" data-row="' + i + '" data-column="' + j + '" style="height:' + size + 'px;width:' + size + 'px; margin: 1px;"></button>').appendTo(document.getElementById("row-" + i));
            } else if (j < 13) {
                $('<button type="button" class="btn btn-outline-primary sample" data-toggle="button" aria-pressed="false" data-row="' + i + '" data-column="' + j + '" style="height:' + size + 'px;width:' + size + 'px; margin: 1px;"></button>').appendTo(document.getElementById("row-" + i));
            } else {
                $('<button type="button" class="btn btn-outline-secondary sample" data-toggle="button" aria-pressed="false" data-row="' + i + '" data-column="' + j + '" style="height:' + size + 'px;width:' + size + 'px; margin: 1px;"></button>').appendTo(document.getElementById("row-" + i));
            }
        }
    }
}

function setDrumButtons() {
    for (var i = 1; i < 7; i++) {
        document.getElementById("drum-" + i).innerText = d[i-1];
        document.getElementById("drum-" + i).style.fontSize = "small";
    }
}

function controlsHandler() {
    let mode = $(":radio[name=controls]:checked").val();
    if (mode === "play") {
        isplaying = window.setInterval(function() {
            this.playAudio();
        }, Math.floor( 60000.0/bpm_slider.value));

    } else if (mode === "stop") {
        this.stopAudio();
        clearInterval(isplaying);
    }

}

function playAudio() {
    for(var i = 1; i < 7; i++) {
        var cBeat = $('.sample[data-row="' + i + '"][data-column="' + beat + '"]');
        if (cBeat.hasClass('active')) {
            if (document.getElementById("drum-" + i).classList.contains("active")) {
                MIDI.noteOn(0, mapping[i-1], parseInt(volume_slider.value));
            } else {
                MIDI.noteOff(0, mapping[i-1]);
            }
        }
    }
    if(beat < 16) {
        beat++;
    }else if(beat >= 16){
        beat = 1;
    }
}

function stopAudio() {
    for (var i = 0; i < 6; i++) {
        MIDI.noteOff(0, mapping[i]);
    }

}

/*
 * You need to write an event handling function for the instrument
 */


$(document).ready(function() {
    MIDI.loadPlugin({
        soundfontUrl: "./midi-js/soundfont/",
        instruments: [
            "drum"
            /*
             * You can preload the instruments here if you add the instrument
             * name in the list here
             */
        ],
        onprogress: function(state, progress) {
            console.log(state, progress);
        },
        onsuccess: function() {
            // Resuming the AudioContext when there is user interaction
            $("body").click(function() {
                if (MIDI.getContext().state != "running") {
                    MIDI.getContext().resume().then(function() {
                        console.log("Audio Context is resumed!");
                    });
                }
            });
            createDrumButtons();
            setDrumButtons();

            // Hide the loading text and show the container
            $(".loading").hide();
            $(".container").show();

            // At this point the MIDI system is ready
            MIDI.setVolume(0, 127);     // Set the volume level
            MIDI.programChange(0, 0);  // Use the General MIDI 'trumpet' number

        }
    });

    var controls_radio = document.getElementById("controls");
    controls_radio.onchange = function() {
        controlsHandler();
    }
    // Set up slider displays

    volume_slider = document.getElementById("volume");
    var volume_value = document.getElementById("volume-value");

    volume_slider.oninput = function() {
        volume_value.innerHTML = this.value;
    }

    bpm_slider = document.getElementById("bpm");
    var bpm_value = document.getElementById("bpm-value");

    bpm_slider.oninput = function() {
        bpm_value.innerHTML = this.value;
    }

});
