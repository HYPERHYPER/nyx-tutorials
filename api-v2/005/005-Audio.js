//
// 005-Audio.js
// 005-Audio

/**
 * Nyx handles both audio and video. Music or sound effects can be added to the timeline
 * the same way you would add video.
 * In this quick tutorial we'll build a timeline using our audio clip length as the target
 * playback duration and create clips to fill that space.
*/

import { Asset, Time, TimeRange, Clip, Vector, Transform } from 'hypno'

Time.timescale = 30
composition.frameDuration = new Time(1)
composition.renderSize = new Vector(960, 1280)

const media = new Asset("../../media/a.mp4")
const audio = new Asset("../../media/music.mp3")

let videoTrack = composition.track("videoTrack")
let audioTrack = composition.track("audioTrack", "audio")

// let's figure out how long the audio is in our timebase (30fps)
const audioDuration = Time.convertScale(audio.duration)
// ticks represents how many frames exists in the audio file
let ticks = audioDuration.value
// we can break the audio's duration up into 8ths
let measureDuration = Math.floor(ticks / 8)
// the last measure is a little flexible to account for rounding to the nearest frame
let lastMeasureDuration = ticks - (measureDuration * 7)

let start = new Time(0)
let measure = new Time(measureDuration)
let lastMeasure = new Time(lastMeasureDuration)

for (let i = 0; i < 7; i++) {
    // we'll make every clip start a little later in our media for variety
    let clip = media.clip(new TimeRange(new Time(0 + i * 14), measure))
    
    videoTrack.add(clip)
}

// add our last, oddly-lengthed clip
let lastClip = media.clip(new TimeRange(start, lastMeasure))
    
videoTrack.add(lastClip)

// audio track
let audioClip = audio.clip(new TimeRange(start, new Time(ticks)))

audioTrack.add(audioClip)