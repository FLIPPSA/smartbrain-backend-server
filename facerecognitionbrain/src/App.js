import React, { Component } from 'react';
import ParticlesBg from 'particles-bg';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Navigation from './Components/Navigation/Navigation';

import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';
import './App.css';

window.process = { };

const USER_ID = 'flipp_06p';
// Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = 'fe0a6faf44ac4907ac389cf933456831';
const APP_ID = 'FaceRecognitionBrain';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'face-detection'; 

const initialState = {
  input: '', 
  imageURL: '',
  box: {},
  route: 'signin',
  isSignIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0, 
    joined: ''
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries, 
      joined: data.joined
    }})
  }


  calculateFaceLocation = (boxdata) => {
    //const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage'); //Grabing image properties
    const width = Number(image.width); //grabing width from image
    const height = Number(image.height); //height from image
    return {
      leftCol: boxdata.left_col * width,
      topRow: boxdata.top_row * height,
      rightCol: width - (boxdata.right_col * width),
      bottomRow: height - (boxdata.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }

  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input});
    const raw = JSON.stringify({
      "user_app_id": {
        "user_id": USER_ID,
        "app_id": APP_ID
      },
      "inputs": [
          {
            "data": {
                "image": {
                    "url": this.state.input
                  }
              }
          }
      ]
  });

  const requestOptions = {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Authorization': 'Key ' + PAT
      },
      body: raw
  };

  fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions)
    .then(response => response.json())
    .then(result => (result.outputs[0].data.regions[0].region_info.bounding_box))
    .then(boxdata => {
      if(boxdata) {
       fetch('https://smartbrain-backend-server.onrender.com/image',{
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries: count}))
        })
        .catch(console.log)
      }
      this.displayFaceBox(this.calculateFaceLocation(boxdata))
    })
    .catch(error => console.log('error', error));
}

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState(initialState)
    } else if(route === 'home'){
      this.setState({isSignIn: true})
    }
    this.setState({route: route});
  }


  render() {
    const {isSignIn, imageURL, route, box} = this.state;
    return (
      <div className="App">
        <ParticlesBg type="cobweb" bg={true} num={150} color="#FFFFFF"/>
        <Navigation isSignIn={isSignIn} onRouteChange={this.onRouteChange}/>
        { this.state.route === 'home' 
          ? <div> {/*if true*/}
           
              <Rank name={this.state.user.name} entries={this.state.user.entries}/>
              <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={box} imageURL={imageURL}/>
            </div>
          : ( //otherwise
              route === 'register' 
              ? <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>  //if true
              : <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}

export default App;