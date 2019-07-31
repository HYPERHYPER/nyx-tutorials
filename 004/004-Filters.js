//
// 004-Filters.js
// 004-Layers

/**
 * Nyx contains many built-in filters and effects you would expect for your video arsenal.
 * We'll pick up where we left off last time, but add some fun effects and a blend mode.
*/

HYPNO.composition.timeFormat = "frames"
HYPNO.composition.preferredTimescale = 30
HYPNO.composition.renderSize.width = 960
HYPNO.composition.renderSize.height = 1280

function sequence(inputs) {
    let mediaInput1 = inputs["a.mp4"]
    let mediaInput2 = inputs["b.mp4"]
    
    let track1 = new Track("track1")
    let track2 = new Track("track2")
    
	let start = new Time(0, 30)
    let oneMeasure = new Time(120, 30)
    let halfMeasure = new Time(60, 30)

    let clip1 = new Clip(start, oneMeasure, mediaInput1.name, "video")
    let clip2 = new Clip(new Time(5, 30), halfMeasure, mediaInput2.name, "video")
    let clip3 = new Clip(new Time(5, 30), halfMeasure, mediaInput1.name, "video")
    
    // add a few more clips than last time
    track1.add(clip1)
    track1.add(clip2)
    track2.add(clip2, halfMeasure)
    track2.add(clip3)
    
    return [
        track1,
        track2
    ]
}

function render(context, instruction) {
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
        let translation = AffineTransform.makeTranslation(instruction.time * -960, instruction.time * 400)
        
        instruction.setAffineTransform(translation, "track2")
    }
    
    if (instruction.index < 2) {
        /** Filter
         * Creates a Filter object with a specified name.
         * 
         * @param {string} effectName
         */
        let blur = new Filter("CIGaussianBlur")
        
        // set the radius of the blur to 20px
        blur.setValue(20.0, "inputRadius")
        
        // add the blur filter to the "track1" track
        instruction.addFilter(blur, "track1")
        
        let hueAdjust = new Filter("CIHueAdjust")
        
        // here we're using the instruction.time value to animate the hue adjustment in an extreme way
        hueAdjust.setValue(instruction.time * 10.0, "inputAngle")
        
        // add the hue adjustment only to the "track2" track (the one on top)
        instruction.addFilter(hueAdjust, "track2")
    }
    
    if (instruction.index == 2) {
        // you may set blend modes on specific layers so they can affect the footage underneath
        instruction.setBlendMode("overlay", "track2")
    }
    
}