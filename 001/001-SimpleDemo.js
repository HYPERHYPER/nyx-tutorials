//
// 001-SimpleDemo.js
// 001-SimpleDemo

/**
 * Welcome to NYX! This is a simple example script to get you started.
 * Everything you need to do to get started happens right here in this javascript file.
*/

HYPNO.composition.renderSize.width = 960
HYPNO.composition.renderSize.height = 1280

function sequence(inputs) {
    /**
     * The sequence function is where you set up the clips and tracks shown along the timeline below.
    */

    let mediaInput = inputs["a.mp4"]
    
    /** Track
     * Creates a Track object with the specified name. If the name is empty a
     * system track name will be generated automatically.
     * 
     * Track name(s) 'a - z' are reserved.
     * @param {string} name
	*/
    let cameraTrack = new Track("media")

    /** 
     * Clip
     * Creates a Clip with a specified start time, duration, inputName and inputType
     * 
     * @param {number} startTime - The start time of a source inputs
     * @param {number} duration
     * @param {string} inputName - The name of the "input" (video, audio) to 
     *   use. The input name is the file name including the extension. example: 
     *   watermark.mp4. If this is null the default "camera" input name will be 
     *   used.
     * @param {string} inputType - he type of the "input" (video, audio) to use. 
     *   Currently supported types: "video", "audio". If this is null the default 
     *   "video" type will be used.
	*/
    let cameraClip1 = new Clip(0.0, 1.5, mediaInput.name, "video")
    let cameraClip2 = new Clip(1.0, 2.0, mediaInput.name, "video")
    let cameraClip3 = new Clip(2.0, 0.5, mediaInput.name, "video")
    let cameraClip4 = new Clip(3.0, 2.0, mediaInput.name, "video")

    cameraTrack.add(cameraClip1)
    cameraTrack.add(cameraClip2)    
    cameraTrack.add(cameraClip3)    
    cameraTrack.add(cameraClip4)

    return [
        cameraTrack
    ]
}

function render(context, instruction) {
    /**
     * The render function is where you make any changes to the like scaling, adding effects, and blending tracks together.
    */
    
    // instruction.index reflects the numbered index of each clip in the timelineß
    if (instruction.index == 1) {
        // Use AffineTransform to apply a zoom + translation to the second clip

        let scale = AffineTransform.makeScale(1.5, 1.5)
        let translation = AffineTransform.makeTranslation(-(1.5 - 1.0) * (960/2), -(1.5 - 1.0) * (1280/2))
        let transform = AffineTransform.concat(scale, translation)
        
        instruction.setAffineTransform(transform, "media")
    }

}