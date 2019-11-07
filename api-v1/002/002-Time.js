//
// 002-Time.js
// 002-Time

/**
 * Nyx allows you to work in normal float number timescales or Time{} structures.
 * Time{} allows for additional accuracy with video timelines.
*/

// work in a more accurate time structure
HYPNO.composition.timeFormat = "frames"
// set timescale units of 1/30th of a second 
HYPNO.composition.preferredTimescale = 30

HYPNO.composition.renderSize.width = 960
HYPNO.composition.renderSize.height = 1280

function sequence(inputs) {
    /**
     * The sequence function is where you set up the clips and tracks shown along the timeline below.
    */

    let mediaInput = inputs["a.mp4"]
    let cameraTrack = new Track("media")
    
    /** Time
     * Creates a Time object
     * 
     * @param {number} value - number of units
     * @param {number} timescale - how many units per second
	*/
	let start = new Time(0, 30)
    let oneMeasure = new Time(30, 30)
    let halfMeasure = new Time(15, 30)
    let twoMeasures = new Time(60, 30)

    let cameraClip1 = new Clip(start, oneMeasure, mediaInput.name, "video")
    let cameraClip2 = new Clip(halfMeasure, twoMeasures, mediaInput.name, "video")
    let cameraClip3 = new Clip(oneMeasure, halfMeasure, mediaInput.name, "video")
    // you can create time objects inline if they're one-off
    let cameraClip4 = new Clip(new Time(70, 30), new Time(60, 30), mediaInput.name, "video")
    
    // we can change the playback speed of a clip
    cameraClip2.scaleToDuration(oneMeasure) // this will play back at half speed
    cameraClip4.scaleToDuration(new Time(20, 30)) // this will play back at 3x speed
    
    let clips = [
        cameraClip1,
        cameraClip2,
        cameraClip3,
        cameraClip4
    ]
    
    cameraTrack.add(cameraClip1)
    cameraTrack.add(cameraClip2)
    cameraTrack.add(cameraClip3)
    cameraTrack.add(cameraClip4)
    
    // let's add a few additional clips, but do it randomly each time playback starts
    for (let i = 0; i < 4; i++) {
        let whichClip = Math.floor(Math.random() * 4.0)
        
        cameraTrack.add(clips[whichClip])
    }

    return [
        cameraTrack
    ]
}

function render(context, instruction) {
    
}