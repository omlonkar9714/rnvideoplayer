import React, {Component} from 'react';
import {createRef} from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  ToastAndroid,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {BackHandler} from 'react-native';

import Video from 'react-native-video';

import FontIcon from 'react-native-vector-icons/Ionicons';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import Fontisto from 'react-native-vector-icons/Fontisto';

import Slider from 'react-native-slider';

import Orientation from 'react-native-orientation';

class VideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      data: this.props.data ? this.props.data : {},
      paused: this.props.paused ? this.props.paused : false,
      videosList: this.props.list ? this.props.list : [],
      playInBackground: this.props.playInBackground
        ? this.props.playInBackground
        : false,
      repeat: this.props.repeat ? this.props.repeat : false,
      seekTime: this.props.seekTime ? this.props.seekTime : 5,
      videoPlayerBackgroundColor: this.props.videoPlayerBackgroundColor
        ? this.props.videoPlayerBackgroundColor
        : 'black',
      resizeMode: this.props.resizeMode ? this.props.resizeMode : 'contain',

      //controls
      videoLoading: false,
      controlsVisible: false,
      currentTime: 0,
      seekableDuration: 0,
      isLandscape: false,
    };
  }

  componentDidMount() {
    StatusBar.setHidden(true);
    Orientation.addOrientationListener(this._orientationDidChange);
  }

  _orientationDidChange = orientation => {
    if (orientation === 'LANDSCAPE') {
      // do something with landscape layout
    } else {
      // do something with portrait layout
    }
  };

  UNSAFE_componentWillUnmount() {
    Orientation.getOrientation((err, orientation) => {});
    // Remember to remove listener
    Orientation.removeOrientationListener(this._orientationDidChange);
  }

  onPlayerScreenTapped = () => {
    if (this.state.controlsVisible) {
    } else if (!this.state.controlsVisible) {
      this.setState({controlsVisible: true});
      setTimeout(() => {
        this.setState({controlsVisible: false}, () => {});
      }, 3000);
    }
  };

  async handleBackButtonClick() {
    // this locks the view to Portrait Mode
    await Orientation.lockToPortrait();
    this.setState({paused: true}, () => {
      this.props.navigation.goBack(null);
    });

    return true;
  }

  onPrevNextPress = type => {
    let tmp = this.state.videosList;
    if (tmp.length > 0) {
      if (type === 'prev') {
        if (this.state.data.title == tmp[0].title) {
          ToastAndroid.show('First video', ToastAndroid.SHORT);
        } else {
          for (let i = 0; i < tmp.length; i++) {
            if (tmp[i].title == this.state.data.title) {
              // ToastAndroid.show('Playing previous video', ToastAndroid.SHORT);
              this.setState({data: tmp[i - 1]});
            }
          }
        }
      } else if (type == 'next') {
        if (this.state.data.title == tmp[tmp.length - 1].title) {
          ToastAndroid.show('Last video.', ToastAndroid.SHORT);
        } else {
          for (let i = 0; i < tmp.length; i++) {
            if (tmp[i].title == this.state.data.title) {
              // ToastAndroid.show('Playing next video', ToastAndroid.SHORT);
              this.setState({data: tmp[i + 1]});
            }
          }
        }
      }
    }
  };

  getTime = () => {
    let date = new Date();

    let hour =
      date.getHours() < 12
        ? '0' + date.getHours()
        : date.getHours() - 12 < 10
        ? '0' + date.getHours() - 12
        : date.getHours() - 12;

    let mins =
      date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

    let ampm = date.getHours() < 12 ? 'AM' : 'PM';

    return hour + ':' + mins + ampm;
  };

  millisToMinutesAndSeconds = millis => {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  };

  changeOrientation = () => {
    if (this.state.isLandscape) {
      Orientation.lockToPortrait();
      this.setState({isLandscape: false});
    } else if (!this.state.isLandscape) {
      Orientation.lockToLandscape();

      this.setState({isLandscape: true});
    }
  };

  render() {
    return (
      <View
        style={{
          height: '100%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: this.state.videoPlayerBackgroundColor,
        }}>
        <TouchableWithoutFeedback onPress={this.onPlayerScreenTapped}>
          <View style={{height: '100%', width: '100%'}}>
            <Video
              playInBackground={this.state.playInBackground}
              repeat={this.state.repeat}
              onLoadStart={() => {
                this.setState({videoLoading: true});
              }}
              onLoad={async data => {
                this.setState({
                  videoLoading: false,
                  seekableDuration: data.duration,
                });
                if (data.naturalSize.orientation === 'landscape') {
                  Orientation.lockToLandscape();
                  this.setState({isLandscape: true});
                } else if (data.naturalSize.orientation === 'portrait') {
                  Orientation.lockToPortrait();
                  this.setState({isLandscape: false});
                }
              }}
              onProgress={prg => {
                this.setState({
                  currentTime: prg.currentTime,
                });
              }}
              onEnd={() => {
                this.setState({paused: true});
              }}
              paused={this.state.paused}
              resizeMode={this.state.resizeMode}
              source={{
                uri: this.state.data.url,
              }} // Can be a URL or a local file.
              ref={ref => {
                this.player = ref;
              }} // Store reference
              style={{height: '100%', width: '100%'}}
            />

            {this.state.videoLoading && (
              <View
                style={{
                  position: 'absolute',
                  height: '100%',
                  width: '100%',
                  backgroundColor: 'black',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    color: '#4156f6',
                    marginVertical: 10,
                  }}></Text>
                <ActivityIndicator
                  size="large"
                  color="black"></ActivityIndicator>
              </View>
            )}
            {this.state.controlsVisible && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  width: '100%',
                  backgroundColor: '#00000033',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    padding: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      paddingHorizontal: 10,
                      justifyContent: 'space-evenly',
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.handleBackButtonClick();
                      }}>
                      <View
                        style={{
                          marginHorizontal: 10,
                          borderRadius: 25,
                          backgroundColor: 'transparent',
                          justifyContent: 'center',
                          alignItems: 'center',
                          alignSelf: 'center',
                        }}>
                        <FontIcon
                          size={23}
                          color="white"
                          name="arrow-back-outline"></FontIcon>
                      </View>
                    </TouchableOpacity>

                    <View
                      style={{
                        flex: 1,
                        alignSelf: 'center',
                      }}>
                      <Text style={{fontSize: 15, color: 'white'}}>
                        {this.state.data.title}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        paddingRight: 20,
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                        alignSelf: 'flex-end',
                      }}>
                      <Text
                        style={{marginLeft: 20, fontSize: 15, color: 'white'}}>
                        {this.getTime()}
                      </Text>
                      <TouchableOpacity onPress={this.changeOrientation}>
                        <MaterialCommunityIcons
                          style={{marginLeft: 20}}
                          size={23}
                          color={'white'}
                          name={
                            this.state.isLandscape
                              ? 'phone-rotate-portrait'
                              : 'phone-rotate-landscape'
                          }></MaterialCommunityIcons>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {this.state.controlsVisible && (
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                  backgroundColor: '#00000033',
                }}>
                <Slider
                  tapToSeek
                  step={1}
                  onSlidingStart={() => {
                    this.setState({controlsVisible: true});
                  }}
                  onSlidingComplete={() => {
                    setTimeout(() => {
                      this.setState({controlsVisible: false});
                    }, 2000);
                  }}
                  minimumTrackTintColor="#4156f6"
                  maximumTrackTintColor="#e7e7e733"
                  thumbTintColor="#4156f6"
                  value={this.state.currentTime}
                  onValueChange={value => {
                    this.player.seek(value);
                    this.setState({currentTime: value});
                  }}
                  maximumValue={this.state.seekableDuration}
                  minimumValue={0}
                  thumbTouchSize={{height: 50, width: 50}}></Slider>

                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: 20,
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{fontSize: 15, color: 'white'}}>
                    {this.millisToMinutesAndSeconds(
                      this.state.currentTime * 1000,
                    )}
                  </Text>
                  <Text style={{fontSize: 15, color: 'white'}}>
                    {this.millisToMinutesAndSeconds(
                      this.state.seekableDuration * 1000 -
                        this.state.currentTime * 1000,
                    )}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.player.seek(
                          this.state.currentTime - this.state.seekTime + 1,
                        );
                      }}>
                      <View
                        style={{
                          height: 40,
                          marginHorizontal: 30,
                          width: 40,
                          borderRadius: 25,
                          backgroundColor: 'transparent',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Fontisto
                          style={{
                            position: 'absolute',
                            transform: [{scaleX: -1}],
                          }}
                          size={30}
                          color="white"
                          name="spinner-rotate-forward"></Fontisto>
                        <Text
                          style={{
                            color: 'white',
                            position: 'absolute',
                            fontSize: 10,
                          }}>
                          -{this.state.seekTime}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {this.state.videosList.length > 0 && (
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({currentTime: 0});
                          this.onPrevNextPress('prev');
                        }}>
                        <View
                          style={{
                            height: 40,
                            marginHorizontal: 30,
                            width: 40,
                            borderRadius: 25,
                            backgroundColor: 'transparent',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <FontIcon
                            style={{position: 'absolute'}}
                            size={23}
                            color="white"
                            name="play-skip-back"></FontIcon>
                        </View>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      onPress={() => {
                        if (this.state.controlsVisible) {
                          this.setState({paused: !this.state.paused});
                        }
                      }}>
                      <View
                        style={{
                          marginHorizontal: 30,
                          height: 40,
                          width: 40,
                          borderRadius: 25,
                          backgroundColor: 'transparent',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <FontIcon
                          style={{position: 'absolute'}}
                          size={23}
                          color="white"
                          name={
                            this.state.paused ? 'play' : 'pause'
                          }></FontIcon>
                      </View>
                    </TouchableOpacity>

                    {this.state.videosList.length > 0 && (
                      <TouchableOpacity
                        onPress={() => {
                          this.setState({currentTime: 0});
                          this.onPrevNextPress('next');
                        }}>
                        <View
                          style={{
                            marginHorizontal: 30,
                            height: 40,
                            width: 40,
                            borderRadius: 25,
                            backgroundColor: 'transparent',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <FontIcon
                            style={{position: 'absolute'}}
                            size={23}
                            color="white"
                            name="play-skip-forward"></FontIcon>
                        </View>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      onPress={() => {
                        this.player.seek(
                          this.state.currentTime + this.state.seekTime + 1,
                        );
                      }}>
                      <View
                        style={{
                          marginHorizontal: 30,
                          height: 40,
                          width: 40,
                          borderRadius: 25,
                          backgroundColor: 'transparent',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Fontisto
                          style={{position: 'absolute'}}
                          size={30}
                          color="white"
                          name="spinner-rotate-forward"></Fontisto>
                        <Text
                          style={{
                            color: 'white',
                            position: 'absolute',
                            fontSize: 10,
                          }}>
                          +{this.state.seekTime}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

export default VideoPlayer;
