//
// 003-Layers.js
// 003-Layers

/**
 * Nyx tracks work like layers and allow each to be animated or effected separately.
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
    
    track1.add(clip1)
    
    /**
     * if you specify a second parameter while adding a clip to a track, the clip is
     * inserted at that time offset in the track
     */
    track2.add(clip2, halfMeasure)
    
    return [
        track1,
        track2
    ]
}

function render(context, instruction) {
    /**
     * instruction.time is a 0-1 normalized value that represents how far through the current
     * instruction you've traveled
     * 
     * Here we're using it to cause the "track2" layer to translate to the left and slightly up
     * over the course of the instruction. This does nothing on the first instruction, because
     * "track2" doesn't exist on that instruction.
     */
    let translation = AffineTransform.makeTranslation(instruction.time * -960, instruction.time * 400)
    
    instruction.setAffineTransform(translation, "track2")
}