import { on } from "@svgdotjs/svg.js";

export const onAudioInput = (evt) => {
  // 'evt.data' is an integer array containing raw audio data
  //
  consoleMessage("Audio data received: " + evt.data.length + " samples");
  console.log("Audio data received: " + evt.data.length + " samples");

  // ... do something with the evt.data array ...
};

export const onAudioInputError = (error) => {
  alert("onAudioInputError event recieved: " + JSON.stringify(error));
};

export function consoleMessage(msg, debugVar) {
    if ( debugVar ) {
        msg = `${msg}: ${debugVar}`;
        if ( typeof debugVar == 'object' ) console.dir( msg, debugVar );
        else console.log( msg );
    } 
    let stack = new Error().stack
    let splitStack = stack.split( "\n" )[3].trim();
    // console.log(stack)
  console.log(splitStack,msg);
}

export function getMicrophonePermission ( onSuccess, onDenied, onError ) {
    window.audioinput.checkMicrophonePermission( ( hasPermission ) => {
        // console.log( `onsuccess: ${onSuccess}` );
        // console.log( `onDenied: ${onDenied}` );
        // console.log( `onError: ${onError}` );
        try {
            if ( hasPermission ) {
                if ( onSuccess )
                    console.log( "Microphone already has permission granted" );
                    onSuccess();
            } else {
                window.audioinput.getMicrophonePermission( function (
                    hasPermission,
                    message
                ) {
                    try {
                        if ( hasPermission ) {
                            if ( onSuccess )
                                console.log( "Microphone permission granted" );
                                onSuccess();
                        } else {
                            if ( onDenied )
                                console.log( "Microphone permission denied" );
                                onDenied( "User denied permission to record: " + message );
                        }
                    } catch ( ex ) {
                        if ( onError )
                            console.log( "Error getting microphone permission: " + ex );
                            onError( "Start after getting permission exception: " + ex );
                    }
                } );
            }
        } catch ( ex ) {
            if ( onError )
                console.log( "Error getting microphone permission: " + ex );
                onError( "getMicrophonePermission exception: " + ex );
        }
    } );
}
