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
  console.log(msg);
}

export function getMicrophonePermission ( onSuccess, onDenied, onError ) {
    window.audioinput.checkMicrophonePermission( function ( hasPermission ) {
        try {
            if ( hasPermission ) {
                if ( onSuccess )
                    onSuccess();
            } else {
                window.audioinput.getMicrophonePermission( function (
                    hasPermission,
                    message
                ) {
                    try {
                        if ( hasPermission ) {
                            if ( onSuccess )
                                onSuccess();
                        } else {
                            if ( onDenied )
                                onDenied( "User denied permission to record: " + message );
                        }
                    } catch ( ex ) {
                        if ( onError )
                            onError( "Start after getting permission exception: " + ex );
                    }
                } );
            }
        } catch ( ex ) {
            if ( onError )
                onError( "getMicrophonePermission exception: " + ex );
        }
    } );
}
