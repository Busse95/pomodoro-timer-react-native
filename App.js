// TODO: Export the Slider into it's own file and bind it here, together with the onChange methods
import * as React from 'react';
import { Text, View, Button, StyleSheet, Alert } from 'react-native';
import { Slider } from 'react-native';
import Constants from 'expo-constants';
import PropTypes from 'prop-types'

// You can import from local files
// import AssetExample from './components/AssetExample';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  counter: {
    fontSize: 72,
  }, // TODO: Add style for slider: see todo in render()
});

// MAIN APP SCREEN
export default class App extends React.Component {
  /*
  static propTypes = {
	count: PropTypes.number,
	isRunning: PropTypes.boolean,
	timerIndex: PropTypes.number,
	timerLenghts: PropTypes.array
  }
  */
  // CONSTRUCTOR
  constructor() {
    super();
    console.log('Consctructor called');
    this.state = {
      count: 0, // in seconds
      isRunning: false,
      timerIndex: 0, // toggle between 0 and 1, or up to timerLenghts.length
      timerLengths: [25, 5], // in minutes
    };
  }

  // UI METHOD
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.counter}>
          {('0' + ~~(this.state.count / 60)).slice(-2)}:
          {('0' + (this.state.count % 60)).slice(-2)}
        </Text>
        <Button 
          onPress={this.startStopTimer} 
          title="Start / Stop" 
        />
        <Button 
          onPress={this.resetTimer} 
          title="Reset" 
        />
        <Slider
          style={{width: 350, height: 40}} // todo: remove magic numbers
          step={1}
          minimumValue={2}
          maximumValue={45}
          onSlidingComplete={value => this.onSliderChange(0, value)}
          value={this.state.timerLengths[0]}
        />
        <Slider
          style={{width: 350, height: 40}} // todo: remove magic numbers
          step={1}
          minimumValue={1}
          maximumValue={15}
          onSlidingComplete={value => this.onSliderChange(1, value)}
          value={this.state.timerLengths[1]}
        />
      </View>
    );
  }

  // MOUNT METHOD
  componentDidMount() {
    // get a user input form
    console.log('ComponentDidMount called');
  }

  // UNMOUNT METHOD
  componentWillUnmount() {
    console.log('ComponentWillUnmount called');
    clearInterval(this.interval);
  }

  // SLIDER onChange METHOD
  onSliderChange = (_timerIndex, _timerLength) => {
    this.resetTimer()
	
	// TODO: Do we need to deepcopy here or anything?
	tempArr = this.state.timerLenghts
	tempArr[_timerIndex] = _timerLength // save a new Time
    this.setState(previousState => ({
			timerLengths: tempArr,
	})
  }

  // TIMER METHODS, BUTTON onPress METHODS
  startStopTimer = () => {
    if (this.state.isRunning === true) {
	  // Pause the Timer
      this.setState(previousState => ({
        isRunning: false,
      }));
      clearInterval(this.interval);
    } else if (this.state.isRunning === false && this.state.count === 0) {
	  // Start the Timer, first time
      this.setState(previousState => ({
        count: previousState.timerLengths[previousState.timerIndex] * 60,
        isRunning: true,
      }));
      this.interval = setInterval(this.incrementTimer, 1000);
    } else {
	  // Resume the paused timer
      this.setState(previousState => ({
        isRunning: true,
      }));
      this.interval = setInterval(this.incrementTimer, 1000);
    }
  };

  resetTimer = () => {
    clearInterval(this.interval);
    this.setState(previousState => ({
      count: 0,
      timerIndex: 0,
    }));
  };

  // it's not ~actually~ incrementing
  incrementTimer = () => {
    tempCount = this.state.count
	this.setState(prevState => ({
      count: prevState.count - 1,
    }));
	// we resort to a temp count here because setState is asynchronous
    if (tempCount - 1 === 0) {
	  // this method is invoked while the count is =1 and about to be 0
      this.switchTimer();
    }
  };

  switchTimer = () => {
	// this interval could be cleared before it hit 0, thusly the timer could be slightly inaccurate
    clearInterval(this.interval);
    this.setState(previousState => ({
      count: previousState.timerLengths[1 - previousState.timerIndex] * 60,
      timerIndex: 1 - previousState.timerIndex,
      isRunning: false,
    }));
  };
}
