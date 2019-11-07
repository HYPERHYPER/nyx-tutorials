//
// 004-Filters.js
// 004-Layers

/**
 * Nyx contains many built-in filters and effects you would expect for your video arsenal.
 * We'll pick up where we left off last time, but add some fun effects and a blend mode.
*/

import { Asset, Time, TimeRange, Clip, Vector, Transform, coreimage } from 'hypno'
import { Image, Filter, Kernel } from 'hypno/coreimage'

Time.timescale = 30
composition.frameDuration = new Time(1)
composition.renderSize = new Vector(960, 1280)

const media1 = new Asset("../../media/a.mp4")
const media2 = new Asset("../../media/b.mp4")

let track1 = composition.track("track1")
let track2 = composition.track("track2")

let clip1 = media1.clip(new TimeRange(new Time(0), new Time(120)))
let clip2 = media2.clip(new TimeRange(new Time(5), new Time(60)))
let clip3 = media1.clip(new TimeRange(new Time(5), new Time(60)))

track1.add(clip1)
track1.add(clip2)
track2.add(clip2, new Time(60))
track2.add(clip3)

composition.render = function(context) {
    const instruction = context.instruction
    const progress = (instruction.time.value / instruction.timeRange.duration.value)
    
    /**
     * instruction.index represents the index of each individual cut in the timeline.
     * It is often used to split up effects and target only certain cuts.
     * 
     * In this case, we're using instruction.index:
     * == 1 to target the animation from before
     * < 2 to use our color effects on every cut before the last one
     * == 2 to add our blend mode only to the last cut
     */
    
    if (instruction.index == 1) {
        let frame = context.getFrame("track2")
        
        let translation = Transform.translation(progress * -960, progress * 400)
        
        frame = frame.transformed(translation)
        
        context.setFrame("track2", frame)
    }
    
    if (instruction.index < 2) {
        let frame1 = context.getFrame("track1")
        let frame2 = context.getFrame("track2")
        
        /** Filter
         * Creates a Core Image Filter object for a specified name and with
         * optional input parameters.
         * 
         * @param name The name of the filter. You must make sure the name 
         * is spelled correctly, otherwise your app will run but not produce 
         * any output images.
         * 
         * @param inputParameters A list of key-value pairs to set as input 
         * values to the filter. Each key is a constant that specifies the 
         * name of an input parameter for the filter, and the corresponding 
         * value is the value for that parameter. 
         * See https://developer.apple.com/library/archive/documentation/GraphicsImaging/Reference/CoreImageFilterReference/index.html 
         * for built-in filters and their allowed parameters.
         */
         
        // add the blur filter to the "track1" track
        frame1 = new Filter(coreimage.GaussianBlur, {
        	inputRadius: 20,
        	inputImage: frame1
        }).apply()
        
        context.setFrame("track1", frame1)
        
        // here we're using the progess value to animate the hue adjustment in an extreme way
        frame2 = new Filter(coreimage.HueAdjust, {
            inputAngle: progress * 10.0,
            inputImage: frame2
        }).apply()
        
        context.setFrame("track2", frame2)
    }
    
    if (instruction.index == 2) {
        // you may set blend modes on specific layers so they can affect the footage underneat
        context.setBlendMode("track2", "overlay")
    }
    
}