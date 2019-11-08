//
// Blends-And-Transitions.js
// Blends-And-Transitions
//

HYPNO.composition.renderSize.width = 960
HYPNO.composition.renderSize.height = 1280

/** sequence
 * runs immediately and should be used to set up tracks and media
 * return an array of track objects
 */
function sequence(inputs) {

    let cameraInput = inputs ["camera"]
    let musicInput = inputs["music.mp3"]
    let maskInput = inputs["mask.mp4"]
    let lightInput = inputs["light-leaks.mp4"]
    let screenInput = inputs["screen.mp4"]

    let cameraATrack = new Track ("cameraA")
    let cameraBTrack = new Track("cameraB")
    let runtime = 0.0

    // We're going to use this variable for the duration of 
    // the music as our metric for the total length of the 
    // sequence. 

    let dur = musicInput.duration // = 18.15 seconds

    // create clips for two main camera tracks that we'll
    // transition back and forth from using a mask set up in the render function

    let clipA1 = new Clip(0.0, 2.0, cameraInput, "video")
    let clipA2 = new Clip(1.0, 4.6, cameraInput, "video")
    let clipA3 = new Clip(0.0, 5.6, cameraInput, "video")
    let clipA4 = new Clip(2.0, 3.6, cameraInput, "video")
    let clipA5 = new Clip(0.0, 2.35, cameraInput, "video")

    cameraATrack.add(clipA1)
    cameraATrack.add(clipA2)
    cameraATrack.add(clipA3)
    cameraATrack.add(clipA4)
    cameraATrack.add(clipA5)

    let clipB1 = new Clip(1.0, 4.0, cameraInput, "video")
    let clipB2 = new Clip(0.0, 4.6, cameraInput, "video")
    let clipB3 = new Clip(0.0, 6.0, cameraInput, "video")
    let clipB4 = new Clip(0.0, 1.2, cameraInput, "video")
    let clipB5 = new Clip(1.0, 2.35, cameraInput, "video")
    
    cameraBTrack.add(clipB1)
    cameraBTrack.add(clipB2)
    cameraBTrack.add(clipB3)
    cameraBTrack.add(clipB4)
    cameraBTrack.add(clipB5)

    let musicTrack = new Track("music")
    let musicClip = new Clip(0.0, dur, musicInput, "audio")
    musicTrack.add(musicClip)

    let maskTrack = new Track("mask")
    let maskClip = new Clip(0.0, maskInput.duration, maskInput, "video")
    //mask input is slightly shorter than the music, stretching it to avoid empty frames
    maskClip.scaleToDuration(dur)
    maskTrack.add(maskClip)

    let lightTrack = new Track("light")
    let lightClip = new Clip(0.0, musicInput.duration, lightInput, "video")
    lightTrack.add(lightClip)

    let screenTrack = new Track("screen")
    let screenClip = new Clip(0.0, dur, screenInput, "video")
    screenTrack.add(screenClip)

    return [
        musicTrack,
        lightTrack,
        screenTrack,
        maskTrack,
        cameraBTrack,
        cameraATrack
    ]
}

/** render
 * runs on each frame update and should be used to add effects to instructions
 */
function render(context, instruction) {

    let i = instruction.index

    // using the 'mask' track as an alpha mask, we can use this CIFilter to transition between the two camera
    // images. If you check out the 'mask.mp4' source file, you'll see that when the mask input is black (alpha channel = 0), the output shows 
    // cameraA, and when the mask is white (alpha channel = 1), the output shows cameraB

    let mask = new Filter("CIBlendWithMask")
    mask.setValue(instruction.getImage("cameraA"), "inputBackgroundImage")
    mask.setValue(instruction.getImage("mask"), "inputMaskImage")
    mask.setValue(instruction.getImage("cameraB"), "inputImage")
    instruction.addFilter(mask, "cameraA")

    // color correction
    let color = new Filter("CIColorControls")
    color.setValue(1.2, "inputSaturation")
    color.setValue(1.35, "inputContrast")
    instruction.addFilter(color, "cameraA")

    // screen blending to add textures and light leaks

    instruction.setAlpha(0.5, "screen")
    let blend = new Filter("CIScreenBlendMode")
    if(i == 0 || i == 7){
        blend.setValue(instruction.getImage("light"), "inputBackgroundImage")
    } else {
        blend.setValue(instruction.getImage("screen"), "inputBackgroundImage")
    }
    blend.setValue(instruction.getImage("cameraA"), "inputImage")
    instruction.addFilter(blend, "cameraA")
}

/** exportSettings
 * defines the output configuration for the exported mp4 file
 */
function exportSettings() {
    // bitrate in MB/sec
    let bitrate = 1.25

    return {
        video: {
            averageBitRate: bitrate * 1000 * 1000 * 8, // convert to bits per second
            profileLevel: "H264High41"
        },
        audio: {
            numberOfChannels: 2,
            sampleRate: 44100,
            bitRate: 64000
        }
    }
}
