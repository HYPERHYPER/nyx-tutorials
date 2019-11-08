//
// Blends-And-Transitions-v8.js
// Blends-And-Transitions
//
// Created by Mena Sachdev on 8 Nov 2019 11:17:49am
// Copyright © 2019 Mena Sachdev. All rights reserved.

import { Asset, Time, TimeRange, Clip, Transform, Vector } from 'hypno'
import * as coreimage from 'hypno/coreimage'
import { Filter } from 'hypno/coreimage'

//timescale is 30 fps
Time.timescale = 30

const cameraAsset = argv [1] [0]
const musicAsset = new Asset ("music.mp3")
const maskAsset = new Asset ("mask.mp4")
const lightAsset = new Asset ("light-leaks.mp4")
const screenAsset = new Asset("screen.mp4")

// We're going to use this variable for the duration of 
// the music as our metric for the total length of the 
// sequence. 
let duration = Time.convertScale(musicAsset.duration)

//the order in which you create the tracks determines the order of the tracks on the timeline
const musicTrack = composition.track ("music", "audio")
const musicClip = musicAsset.clip(new TimeRange(new Time(0), duration))
musicTrack.add(musicClip)

const lightTrack = composition.track ("light")
const lightClip = lightAsset.clip(new TimeRange(new Time(0), duration))
lightTrack.add(lightClip)

const screenTrack = composition.track ("screen")
const screenClip = screenAsset.clip(new TimeRange(new Time(0), duration))
screenTrack.add(screenClip)

const maskTrack = composition.track ("mask")
const maskClip = maskAsset.clip(new TimeRange(new Time(0), maskAsset.duration))
//mask asset is slightly shorter than the music, scaling it to avoid empty frames
maskTrack.add(maskClip.scaled(duration))

const cameraBTrack = composition.track("cameraB")
const cameraATrack = composition.track("cameraA")

// create clips for two main camera tracks that we'll
// transition back and forth from using a mask set up in the render function
const clipA1 = cameraAsset.clip(new TimeRange (new Time (0), new Time (60)))
const clipA2 = cameraAsset.clip(new TimeRange (new Time (30), new Time (138)))
const clipA3 = cameraAsset.clip(new TimeRange (new Time (0), new Time (168)))
const clipA4 = cameraAsset.clip(new TimeRange (new Time (60), new Time (108)))
const clipA5 = cameraAsset.clip(new TimeRange (new Time (0), new Time (70)))

cameraATrack.add(clipA1)
cameraATrack.add(clipA2)
cameraATrack.add(clipA3)
cameraATrack.add(clipA4)
cameraATrack.add(clipA5)

const clipB1 = cameraAsset.clip(new TimeRange (new Time (30), new Time (120)))
const clipB2 = cameraAsset.clip(new TimeRange (new Time (0), new Time (138)))
const clipB3 = cameraAsset.clip(new TimeRange (new Time (0), new Time (180)))
const clipB4 = cameraAsset.clip(new TimeRange (new Time (0), new Time (36)))
const clipB5 = cameraAsset.clip(new TimeRange (new Time (30), new Time (70)))

cameraBTrack.add(clipB1)
cameraBTrack.add(clipB2)
cameraBTrack.add(clipB3)
cameraBTrack.add(clipB4)
cameraBTrack.add(clipB5)

// you can adjust this value to change output quality/size
const bitrate = 1.25

composition.videoExportSettings = {
    video: {
        averageBitRate: bitrate * 1000 * 1000 * 8, // convert to bits per second
        profileLevel: "H264High41"
    },
    audio: {
        numberOfChannels: 2,
        sampleRate: 44100,
        bitRate: 64000
    }
}

/** composition.render
 * runs on each frame update and should be used to add effects to instructions
 */
composition.render = function(context){

    const i = context.instructionIndex

    // using the 'mask' track as an alpha mask, we can use this Filter to transition between the two camera
    // images. If you check out the 'mask.mp4' source file, you'll see that when the mask input is black (alpha channel = 0), the output shows 
    // cameraA, and when the mask is white (alpha channel = 1), the output shows cameraB

    let frameA = context.getFrame ("cameraA")
    let frameB = context.getFrame ("cameraB")
    let maskFrame = context.getFrame("mask")

    const mask = new Filter ("CIBlendWithMask", {
        inputBackgroundImage: frameA,
        inputMaskImage: maskFrame,
        inputImage: frameB
    })

    frameA = mask.apply()

    // color correction
    const color = new Filter (coreimage.CIColorControls, {
        inputSaturation: 1.2,
        inputContrast: 1.35,
        inputImage: frameA
    })

    // color correction
    frameA = color.apply()

    let screenFrame = context.getFrame("screen")
    
    //screen is a bit too bright, so we will set the alpha channel to 50% 
    let screenFrameAlpha = new Filter (coreimage.ColorMatrix, { 
        inputAVector: new Vector (0.0, 0.0, 0.0, 0.5),
        inputImage: screenFrame
    }).apply()

    const screen = new Filter (coreimage.ScreenBlendMode, {
        inputBackgroundImage: screenFrameAlpha,
        inputImage: frameA
    })

    let lightFrame = context.getFrame("light")

    const light = new Filter (coreimage.ScreenBlendMode, {
        inputBackgroundImage: lightFrame,
        inputImage: frameA
    })

    // apply the effect to desired instructions

    if(i == 0 || i == 7){

        frameA = light.apply()

    } else {
        frameA = screen.apply()
    }

    //sets the output frame that should be rendered for the camera (main) track at the current composition
    context.setFrame("cameraA", frameA)
}