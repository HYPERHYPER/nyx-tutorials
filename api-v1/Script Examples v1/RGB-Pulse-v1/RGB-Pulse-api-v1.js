//
// RGB-Pulse.js
// RGB-Pulse
//

const rgbSplit = Kernel("RGB-Splitter.cikernel")

HYPNO.composition.timeFormat = "frames"
HYPNO.composition.preferredTimescale = 30
HYPNO.composition.renderSize.width = 960
HYPNO.composition.renderSize.height = 1280

/** sequence
 * runs immediately and should be used to set up tracks and media
 * return an array of track objects
 */
function sequence(inputs) {

    let tracks = [];

    let cameraInput = inputs ["input.mp4"]
    let musicInput = inputs["music.mp3"]

    let musicDuration = Math.floor(30 * (((musicInput.duration).value) / (musicInput.duration).timescale))
    let oneMeasure = Math.floor(musicDuration / 10)
    
    /**
     * Instead of creating each clip brute-force, here we are 
     * using an array of objects that contain the cue and duration aka "ticks" (frames)
     * of each clip. The use of frame time here makes it easier to calculate exact
     * durations for the quick stutter clips and avoids empty frames in the timeline.
     * Above, we are calculating the duration of one measure, or bar, of the music track in
     * frame time to use as a metric when creating the cuts synced to the music.
     */

    let clips = [
        // SPEED STUTTER x 8
        {
            cue: 0,
            ticks: Math.floor(oneMeasure * 0.2)
        },        
        {
            cue: 4,
            ticks: Math.floor(oneMeasure * 0.2)
        },
        {
            cue: 4,
            ticks: Math.floor(oneMeasure * 0.1)
        },
        {
            cue: 5,
            ticks: Math.floor(oneMeasure * 0.1)
        },
        {
            cue: 7,
            ticks: Math.floor(oneMeasure * 0.1)
        },
        {
            cue: 9,
            ticks: Math.floor(oneMeasure * 0.1)
        },
        {
            cue: 11,
            ticks: Math.floor(oneMeasure * 0.1)
        },
        {
            cue: 13,
            ticks: Math.floor(oneMeasure * 0.1)
        },
        //
        {
            cue: 0,
            ticks: oneMeasure
        },
        {
            cue: 10,
            ticks: oneMeasure
        },
        {
            cue: 15,
            ticks: oneMeasure
        },
        {
            cue: 20,
            ticks: Math.floor(oneMeasure * 0.7)
        },
        //Stutter x 4
        {
            cue: 20,
            ticks: Math.floor(oneMeasure * 0.1)
        },
        {
            cue: 21,
            ticks: Math.floor(oneMeasure *  0.1)
        },
        {
            cue: 22,
            ticks: Math.floor(oneMeasure *  0.1)
        },
        {
            cue: 23,
            ticks: Math.floor(oneMeasure *  0.1)
        },
        //
        {
            cue: 30,
            ticks: oneMeasure
        },
        {
            cue: 50,
            ticks: oneMeasure
        },
        {
            cue: 80,
            ticks: oneMeasure
        },
        {
            cue: 90,
            ticks: Math.floor(oneMeasure * 0.7)
        },
        //Stutter x 4
        {
            cue: 90,
            ticks: Math.floor(oneMeasure * 0.1)
        },
        {
            cue: 91,
            ticks: Math.floor(oneMeasure *  0.1)
        },
        {
            cue: 92,
            ticks: Math.floor(oneMeasure *  0.1)
        },
        {
            cue: 93,
            ticks: Math.floor(oneMeasure *  0.1)
        },
        //
        {
            cue: 100,
            ticks: oneMeasure
        }
    ]

    let cameraTrack = new Track ("camera")
    let runtime = 0.0

    clips.forEach(c=>{

        // Here we iterate through each object in the clips array, create a Clip, and add 
        // it to the camera track.

        let clip = new Clip(new Time(c.cue, 30), new Time(c.ticks, 30), cameraInput, "video")
        cameraTrack.add(clip)
        runtime += c.ticks
    })

    let musicTrack = new Track("music")
    let musicClip = new Clip(new Time(0, 30), new Time(runtime, 30), musicInput, "audio")
    musicTrack.add(musicClip)

    return [
        musicTrack,
        cameraTrack
    ]
}

/** render
 * runs on each frame update and should be used to add effects to instructions
 */
function render(context, instruction) {

    /**
     * Here, we'll use hypnokit time and index objects to incorporate
     * effects and animation. We designate the variable 'i' to instruction.index,
     * which allows us to pick which clips we want to apply an effect to. You can see the index
     * numbers corresponding to each clip in the timeline UI below. 'c' uses context.time, a 
     * float value between 0.0 and 1.0, where 0.0 = beginning of the composition,
     * and 1.0 = the end. 
     */

    let i = instruction.index
    let c = context.time

    if((i > 7 && i < 12) || (i > 15 && i < 20)){

        // Affine Transform is the tool we use to scale, translate, and rotate. 
        // using the 'c' variable, we animate the zoom to create a pulsing/bouncing effect

        let s, t1, t2

        // Math.cos() and Math.sin() are great tools for oscillating a value
        s = 1.05 + 0.05 * Math.cos(80.0 * c * Math.PI)

        //t1 and t2 keep the image centered when scaling occurs
        t1 = -(s - 1.0) * (960/2) 
        t2 = -(s - 1.0) * (1280/2)

        let scale = AffineTransform.makeScale(s, s)
        let translation = AffineTransform.makeTranslation(t1, t2)
        let transform = AffineTransform.concat(scale, translation)
        instruction.setAffineTransform(transform, "camera")

        // add RGB-Splitter kernel which splits rgb channels in an image to create a glitch effect
        // you can look over the kernel source code for more info on how it works
        // incorporating 's' variable for continuity with the pulsing
        let r = (s - 1.0) * 0.1
        if(i % 2 == 0){
        //alternating channel splitting based on if the index number is odd or even
            rgbSplit.setValue(r, "rAmount")
            rgbSplit.setValue(-r, "bAmount")
            rgbSplit.setValue(0.0, "gAmount")
        } else {
            rgbSplit.setValue(-r, "rAmount")
            rgbSplit.setValue(0.0, "bAmount")
            rgbSplit.setValue(r, "gAmount")
        }
        instruction.addKernel(rgbSplit, "camera")
    }

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