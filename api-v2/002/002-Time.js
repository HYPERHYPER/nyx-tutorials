//
// 002-Time.js
// 002-Time

/**
 * Nyx has Time{}, TimeRange{} and various methods of manipulating time.
 * These are important for creating effects like slowmo, or just creating
 * an edit to a tempo or specific run length.
 * 
 * It is best to consider Time in integer values over a denominator set in Time.timescale
 * Time(1, 30) would be 1/30 of a second, or one frame at 30 fps
 */

import { Asset, Time, TimeRange, Clip, Vector, Transform } from 'hypno'

/** Time.timescale
 * The default timescale to use when creating Time objects with the 
 * timescale value omitted. Defaults to 600. Setting this will only 
 * affect any newly created Time objects.
 */
Time.timescale = 30

/** Time
 * Creates a Time object with a specified value and timescale. If 
 * timescale is omitted then the default see [[Time.timescale]] value will 
 * be used. 
 * 
 * Throws an exception if the values passed in result in an invalid 
 * time.
 */
let oneThirtieth = new Time(1, 30) // Time(1) would return the same value, because we set timescale above

composition.frameDuration = oneThirtieth 
composition.renderSize = new Vector(960, 1280)

const media = new Asset("../../media/a.mp4")

let track = composition.track("media")

let start = new Time(0, 30)
let oneMeasure = new Time(30, 30)
let halfMeasure = new Time(15, 30)
let twoMeasures = new Time(60, 30)

let clip1 = media.clip(new TimeRange(start, oneMeasure))
let clip2 = media.clip(new TimeRange(halfMeasure, oneMeasure))
let clip3 = media.clip(new TimeRange(oneMeasure, halfMeasure))
// you can create time objects inline if they're one-off
let clip4 = media.clip(new TimeRange(new Time(70, 30), new Time(60, 30)))

// we can change the playback speed of a clip
clip2 = clip2.scaled(twoMeasures) // this will play back at half speed
clip4 = clip4.scaled(new Time(20, 30)) // this will play back at 3x speed

let clips = [
    clip1,
    clip2,
    clip3,
    clip4 
]

track.add(clip1)
track.add(clip2)
track.add(clip3)
track.add(clip4)

// let's add a few additional clips, but do it randomly each time playback starts
for (let i = 0; i < 4; i++) {
    let whichClip = Math.floor(Math.random() * 4.0)
    
    track.add(clips[whichClip])
}
