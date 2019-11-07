//
// 003-Layers.js
// 003-Layers

/**
 * Nyx tracks work like layers and allow each to be animated or effected separately.
*/

import { Asset, Time, TimeRange, Clip, Vector, Transform } from 'hypno'

Time.timescale = 30
composition.frameDuration = new Time(1)
composition.renderSize = new Vector(960, 1280)

const media1 = new Asset("../../media/a.mp4")
const media2 = new Asset("../../media/b.mp4")

let track1 = composition.track("track1")
let track2 = composition.track("track2")

let clip1 = media1.clip(new TimeRange(new Time(0), new Time(120)))
let clip2 = media2.clip(new TimeRange(new Time(5), new Time(60)))

track1.add(clip1)
/**
 * if you specify a second parameter while adding a clip to a track, the clip is
 * inserted at that time offset in the track
 */
track2.add(clip2, new Time(60))

composition.render = function(context) {
   /**
     * We'll be creating a 0-1 normalized value (progress) that represents how far through the current
     * instruction the playback currently is 
     * 
     * Here we're using it to cause the "track2" layer to translate to the left and slightly up
     * over the course of the instruction.
     */
    const instruction = context.instruction
    const progress = (instruction.time.value / instruction.timeRange.duration.value)
    
    if (instruction.index == 1) {
        let frame = context.getFrame("track2")
        
        let translation = Transform.translation(progress * -960, progress * 400)
        
        frame = frame.transformed(translation)
        
        context.setFrame("track2", frame)
    }
}