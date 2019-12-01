//
// 006-Overlay.js
// 006-Overlay

/**
 * iOS doesn't support videos with alpha channel, so the best way to produce an animated
 * overlay is to create a video asset with both an RGB full-color version and an alpha-only
 * black and white version to use as the mask and use a shader or filter to compose them
 * on your camera.
*/

HYPNO.composition.renderSize.width = 960
HYPNO.composition.renderSize.height = 1280

const overlayShader = new Kernel("overlayShader.cikernel")

function sequence(inputs) {
    let mediaInput1 = inputs["a.mp4"]
    let overlayrgbInput = inputs["overlay_rgb.mp4"]
    let overlayaInput = inputs["overlay_a.mp4"]
    
    let media = new Track("media")
    let overlayrgb = new Track("overlay_rgb")
    let overlaya = new Track("overlay_a")
    
    let clip = new Clip(0.0, 2.0, mediaInput1, "video")
    let overlayrgbClip = new Clip(0.0, 2.0, overlayrgbInput, "video")
    let overlayaClip = new Clip(0.0, 2.0, overlayaInput, "video")
    
    media.add(clip)
    overlaya.add(overlayaClip)
    overlayrgb.add(overlayrgbClip)
    
    /* we return the tracks in order so that the RGB overlay is on top of the media
     * and the alpha overlay is behind everything. We just need to reference its image,
     * in the compositing, not see the media itself for the alpha. */
    return [
        overlaya,
        media,
        overlayrgb
    ]
}

function render(context, instruction) {
    overlayShader.setValue(instruction.getImage("overlay_a"), "alpha")
    instruction.addKernel(overlayShader, "overlay_rgb")
}