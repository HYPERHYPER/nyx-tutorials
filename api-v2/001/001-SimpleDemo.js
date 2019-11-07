//
// 001-SimpleDemo.js
// 001-SimpleDemo

/**
 * Welcome to NYX! This is a simple example script to get you started.
 * Everything you need to do to get started happens right here in this javascript file.
 */

import { Asset, Time, TimeRange, Clip, Vector, Transform } from 'hypno'

Time.timescale = 30
composition.frameDuration = new Time(1)
composition.renderSize = new Vector(960, 1280)

const media = new Asset("../../media/a.mp4")

/** Composition.track
 * Gets or creates a [[Track]] object for the specified name and type. 
 * If a track with the specified name does not already exist, a new 
 * track will be created, otherwise a previously created track will be 
 * returned.
 * 
 * Throws an exception if the name passed in is empty or undefined.
 * 
 * @param name The name of the track to get/create.
 * @param type The type of the track to get/create. Possible values: 
 *             video, audio.
 */
let track = composition.track("media")

/** Asset.clip
 * Returns a new Clip object with the specified TimeRange and type. 
 * Possible "type" values: "video", "audio"; Throws an exception if 
 * the timeRange is invalid and or beyond this asset's total duration.
 * 
 * @param timeRange The source time range.
 * @param type The type, possible values: "video", "audio"
 */
let clip1 = media.clip(new TimeRange(new Time(0), new Time(45)))
let clip2 = media.clip(new TimeRange(new Time(30), new Time(60)))
let clip3 = media.clip(new TimeRange(new Time(60), new Time(15)))
let clip4 = media.clip(new TimeRange(new Time(90), new Time(60)))

/** Track.add
 * Adds a [[Clip]] to this track. If the insertTime is undefined the 
 * [[Clip]] will be added right after the last [[Clip]] on this track or
 * at [[Time]] (0) if there're no [[Clip]]s currently on this track.
 * 
 * @param clip The [[Clip]] to add to this track.
 * @param insertTime The [[Time]] at which to insert the [[Clip]]
 */
track.add(clip1)
track.add(clip2)
track.add(clip3)
track.add(clip4)

composition.render = function(context) {
    /**
     * The render function is where you make any changes to the output like scaling, adding effects, and blending tracks together.
     */
    
    // context.instructionIndex reflects the numbered index of each clip in the timeline
    if (context.instructionIndex == 1) {
        
        /** Context.getFrame
         * Gets the current frame for the specified track.
         * @param trackName 
         */
        let frame = context.getFrame("media")
        
        let scale = Transform.scale(1.5, 1.5)
        let translation = Transform.translation(-(1.5 - 1.0) * (960/2), -(1.5 - 1.0) * (1280/2))
        let transform = Transform.concat(scale, translation)
        
        frame = frame.transformed(transform)
        
        context.setFrame("media", frame)
    }
}