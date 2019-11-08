//
// test.js
// RGB-Pulse
//
// Created by Mena Sachdev on 6 Nov 2019 3:54:20pm
// Copyright © 2019 Mena Sachdev. All rights reserved.

import { Asset, Time, TimeRange, Clip, Transform } from 'hypno'
import * as coreimage from 'hypno/coreimage'
import { Kernel } from 'hypno/coreimage'

//timescale is 30 fps
Time.timescale = 30

const cameraAsset = new Asset("input.mp4")
const musicAsset = new Asset ("music.mp3")

const musicDuration = Time.convertScale (musicAsset.duration)
const oneMeasure = new Time (musicDuration.value / 10)

/**
 * Instead of creating each clip brute-force, here we are 
 * using an array of objects that contains the TimeRange of each clip, which is 
 * represented by two time objects: the first specifying the start time of the range,
 * and the other sepcifying the duration. 
 * 
 * Above, we are calculating the duration of one measure of the music
 * to use as a metric to keep the cuts synched with the beat.
 */

let infos = [
    //Stutter
    { timeRange: new TimeRange (new Time (0), new Time (oneMeasure.value * 0.2))},
    { timeRange: new TimeRange (new Time (4), new Time (oneMeasure.value * 0.2))},
    { timeRange: new TimeRange (new Time (4), new Time (oneMeasure.value * 0.1))},
    { timeRange: new TimeRange (new Time (5), new Time (oneMeasure.value * 0.1))},
    { timeRange: new TimeRange (new Time (7), new Time (oneMeasure.value * 0.1))},
    { timeRange: new TimeRange (new Time (9), new Time (oneMeasure.value * 0.1))},
    { timeRange: new TimeRange (new Time (11), new Time (oneMeasure.value * 0.1))},
    { timeRange: new TimeRange (new Time (13), new Time (oneMeasure.value * 0.1))},
    //
    { timeRange: new TimeRange (new Time (0), oneMeasure)},
    { timeRange: new TimeRange (new Time (10), oneMeasure)},
    { timeRange: new TimeRange (new Time (15), oneMeasure)},
    { timeRange: new TimeRange (new Time (20), new Time (oneMeasure.value * 0.7))},
    //Stutter
    { timeRange: new TimeRange (new Time (20), new Time (oneMeasure.value * 0.1))},
    { timeRange: new TimeRange (new Time (21), new Time (oneMeasure.value * 0.1))},
    { timeRange: new TimeRange (new Time (22), new Time (oneMeasure.value * 0.1))},
    { timeRange: new TimeRange (new Time (23), new Time (oneMeasure.value * 0.1))},
    //
    { timeRange: new TimeRange (new Time (30), oneMeasure)},
    { timeRange: new TimeRange (new Time (50), oneMeasure)},
    { timeRange: new TimeRange (new Time (85), oneMeasure)},
    { timeRange: new TimeRange (new Time (90), new Time (oneMeasure.value * 0.7))},
    //Stutter
    { timeRange: new TimeRange (new Time (90), new Time (oneMeasure.value * 0.1))},
    { timeRange: new TimeRange (new Time (91), new Time (oneMeasure.value * 0.1))},
    { timeRange: new TimeRange (new Time (92), new Time (oneMeasure.value * 0.1))},
    { timeRange: new TimeRange (new Time (93), new Time (oneMeasure.value * 0.1))},
    //
    { timeRange: new TimeRange (new Time (100), oneMeasure)}
]

const cameraTrack = composition.track ("camera")

let runtime = 0

for(let i = 0; i < infos.length; i ++){

    // Here we iterate through each object in the infos array, create a clip, and add 
    // it to the camera track.
    
    const info = infos [i % infos.length]
    const clip = cameraAsset.clip(info.timeRange)
    cameraTrack.add(clip)
    runtime += info.timeRange.duration.value
}

const musicTrack = composition.track ("music", "audio")
const musicClip = musicAsset.clip(new TimeRange(new Time(0), new Time(runtime)))
musicTrack.add(musicClip)

/** render
 * runs on each frame update and should be used to add effects to instructions
 */
composition.render = function(context){

    /**
     * Here, we'll use time and index objects to incorporate
     * effects and animation. We designate the variable 'i' to the instruction index,
     * which allows us to pick which clips we want to apply an effect to. You can see the index
     * numbers corresponding to each clip in the timeline UI below. 't' gives us a 
     * float value between 0.0 and 1.0, where 0.0 = beginning of the instruction,
     * and 1.0 = the end. 
     */

    const instruction = context.instruction
    const i = context.instructionIndex
    const t = (instruction.time.value / instruction.timeRange.duration.value)
    let frameA = context.getFrame ("camera")

    if((i > 7 && i < 12) || (i > 15 && i < 20)){

        // Transform is the tool we use to scale, translate, and rotate. 
        // using the 't' variable, we animate the zoom to create a pulsing/bouncing effect

        // Math.cos() and Math.sin() are great tools for oscillating a value
        const s = 1.05 + 0.05 * Math.cos(8.0 * t * Math.PI)

        //tx and ty keep the image centered when scaling occurs
        const tx = -(s - 1.0) * (cameraAsset.width / 2)
        const ty = -(s - 1.0) * (cameraAsset.height / 2)
    
        const t1 = Transform.scale (s, s).concatenated (Transform.translation (tx, ty))
        frameA = frameA.transformed (t1)

        // add RGB-Splitter kernel which splits rgb channels in an image to create a glitch effect
        // you can look over the kernel source code for more info on how it works
        // incorporating 's' variable for continuity with the pulsing

        const rgbSplit = new Kernel("RGB-Splitter.cikernel")
        const r = (s - 1.0) * 0.1

        //alternating channel splitting based on if the index number is odd or even
        if(i % 2 == 0){
            frameA = rgbSplit.apply(frameA, r, 0.0, -r)
        } else {
            frameA = rgbSplit.apply(frameA, -r, r, 0.0)
        }
    }

    context.setFrame("camera", frameA)
}
