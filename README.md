# Description

    npm package for playing videos for react native.

# Installation

    `npm i advacnced-react-native-video-player --save`
    ```
    import VideoPlayer from 'advacnced-react-native-video-player';
      <VideoPlayer data={title:"Video title", url:"video url"} >

# Options

Properties to pass to the video player component

## 1.data

This will be the data object containing current video title and url properties within(both properties are compulsory)

## 2.paused

This will be for setting video paused initially or starts when loded(default value is false)

## 3.resizeMode

Resize mode for the video. "cover" or "contain" (default value "contain")

## 4.list

If you are having list of videos and then pass it in above (1.data object format for each video) This will enable next and previous buttons in the player so that you can switch videos from the player itself.

## 5.playInBackground

If you want to play video in background.(default value false)

## 6.repeat

If you want to repeat video when ended.(Default value is false)

## 7.seekTime

If you want to use seekButtons. Pass the value in seconds.

## 8.videoPlayerBackgroundColor

Video player background color
