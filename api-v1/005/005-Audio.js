//
// 005-Audio.js
// 005-Audio

/**
 * Nyx handles both audio and video. Music or sound effects can be added to the timeline
 * the same way you would add video.
 * In this quick tutorial we'll build a timeline using our audio clip length as the target
 * playback duration and create clips to fill that space.
*/

HYPNO.composition.timeFormat = "frames"
HYPNO.composition.preferredTimescale = 30
HYPNO.composition.renderSize.width = 960
HYPNO.composition.renderSize.height = 1280

function sequence(inputs) {
    let mediaInput1 = inputs["a.mp4"]
    let audioInput = inputs["music.mp3"]
    
    let track1 = new Track("track1")
    let audioTrack = new Track("audio")
    
    // let's figure out how long the audio is in our timebase (30fps)
    let audioDurationOriginal = audioInput.duration
    let audioDuration = new Time(
        Math.floor((audioDurationOriginal.value / audioDurationOriginal.timescale) * 30),
        30
    )
    
    // ticks represents how many frames exists in the audio file
    let ticks = audioDuration.value
    // we can break the audio's duration up into 8ths
    let measureDuration = Math.floor(ticks / 8)
    // the last measure is a little flexible to account for rounding to the nearest frame
    let lastMeasureDuration = ticks - (measureDuration * 7)
    
	let start = new Time(0, 30)
    let measure = new Time(measureDuration, 30)
    let lastMeasure = new Time(lastMeasureDuration, 30)

    let lastClip = new Clip(start, lastMeasure, mediaInput1, "video")
    
    for (let i = 0; i < 7; i++) {
        // we'll make every clip start a little later in our media for variety
        let clip = new Clip(new Time(0 + i * 14, 30), measure, mediaInput1, "video")
        
        track1.add(clip)
    }
    
    track1.add(lastClip)
    
    // audio track
    audioClip = new Clip(start, new Time(ticks, 30), audioInput, "audio")
    audioTrack.add(audioClip)
    
    return [
        track1,
        audioTrack
    ]
}

function render(context, instruction) {
    
}