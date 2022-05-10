let mapping = [49, 36, 46, 44, 47, 38];
var isplaying;
var delay;
var beat = 1;
var bpm_slider;
var volume_slider;
var bpm;

function handleNoteOn(key_number) {
    // Find the pitch
    let pitch = 60 + key_number;
    /*
     * You need to use the slider to get the lowest pitch number above
     * rather than the hardcoded value
     */

    let sliderPitch = parseInt($("#pitch").val());

    pitch = sliderPitch + key_number;

    // Extract the amplitude value from the slider
    let amplitude = parseInt($("#amplitude").val());

    // Use the two numbers to start a MIDI note
    MIDI.noteOn(0, pitch, amplitude);


    /*
     * You need to handle the chord mode here
     */
    let mode = $(":radio[name=play-mode]:checked").val();
    if (mode === "major") {
        pitch = sliderPitch + key_number + 4;
        MIDI.noteOn(0, pitch, amplitude);
        pitch = sliderPitch + key_number + 7;
        MIDI.noteOn(0, pitch, amplitude);
    }
    else if (mode === "minor") {
        pitch = sliderPitch + key_number + 3;
        MIDI.noteOn(0, pitch, amplitude);
        pitch = sliderPitch + key_number + 7;
        MIDI.noteOn(0, pitch, amplitude);
    }
        

}

function handleNoteOff(key_number) {
    // Find the pitch
    let pitch = 60 + key_number;
    /*
     * You need to use the slider to get the lowest pitch number above
     * rather than the hardcoded value
     */
    let sliderPitch = parseInt($("#pitch").val());

    pitch = sliderPitch + key_number;

    // Send the note off message for the pitch
    MIDI.noteOff(0, pitch); 


    /*
     * You need to handle the chord mode here
     */
    let mode = $(":radio[name=play-mode]:checked").val();
    if (mode === "major") {
        pitch = sliderPitch + key_number + 4;
        MIDI.noteOff(0, pitch);
        pitch = sliderPitch + key_number + 7;
        MIDI.noteOff(0, pitch);
    }
    else if (mode === "minor") {
        pitch = sliderPitch + key_number + 3;
        MIDI.noteOff(0, pitch);
        pitch = sliderPitch + key_number + 7;
        MIDI.noteOff(0, pitch);
    }

}

function createDrumButtons() {
    var size = 30;
    for (var i = 1; i < 7; i++) {
        $('<div class="row" id="row-' + i + '"></div>').appendTo(document.getElementById("drumbuttons"));
        $('<button type="button" class="btn btn-outline-primary active" data-toggle="button" aria-pressed="false" id="toggle-row-' + i + '" style="height: ' + size + 'px; width: ' + size*2.5 + 'px; margin: 1px;"></button>').prependTo(document.getElementById("row-" + i));
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
        for (var j = 1; j < 17; j++) {
            $("")
        }
    }
    $("#test-button").on("mousedown", test);
}

function toggleHandler() {
    document.getElementById()
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
    if(beat < 16) {
        beat++;
    }else if(beat >= 16){
        beat = 1;
    }
    for(var i = 1; i < 7; i++) {
        var cBeat = $('.sample[data-row="' + i + '"][data-column="' + beat + '"]');
        if (cBeat.hasClass('active')) {
            if (!cBeat.hasClass('disabled')) {
                MIDI.noteOn(0, mapping[i-1], parseInt(volume_slider.value));
            } else {
                MIDI.noteOff(0, mapping[i-1]);
            }
            cBeat.addClass('hit');
        }
    }
}

function stopAudio() {
    for (var i = 0; i < 6; i++) {
        MIDI.noteOff(0, mapping[i]);
    }

}

function test() {
    console.log("yee")
    MIDI.noteOn(0, 65, 60);
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
