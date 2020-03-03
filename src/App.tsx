import React, { RefObject } from 'react';
import './App.css';
import firebase from 'firebase';
import app from 'firebase/app';
import { firebaseConfig } from './firebase';
import { v4 as uuidv4 } from 'uuid';
import { Button, message } from 'antd';

interface State {
  imgUrl: string,
  numImages: number,
  lastImageIndex: number;
};

class App extends React.Component<{}, State> {
  private storageRef: any;
  private imageRefreshIntervalHandle: any;

  private readonly REFRESH_INTERVAL: number = 2000;
  private readonly loadingPlaceholderImage: string = 'https://via.placeholder.com/150';
  private readonly errorPlaceholderImage: string = 'https://p7.hiclipart.com/preview/711/621/180/error-computer-icons-orange-error-icon.jpg';
  private readonly inputOpenFileRef: RefObject<HTMLInputElement>

  constructor(props: any) {
    super(props);
    this.state = {
      imgUrl: '',
      numImages: 0,
      lastImageIndex: -1
    }
    this.getImageFromFirebase = this.getImageFromFirebase.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.handleFileSelection = this.handleFileSelection.bind(this);

    this.inputOpenFileRef = React.createRef();
  }

  async componentDidMount() {
    app.initializeApp(firebaseConfig);

    // Get a reference to the storage service, which is used to create references in your storage bucket
    const storage = firebase.storage();

    // Create a storage reference from our storage service
    this.storageRef = storage.ref();

    this.getImageFromFirebase();
    this.imageRefreshIntervalHandle = setInterval(this.getImageFromFirebase, this.REFRESH_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.imageRefreshIntervalHandle);
  }

  private async getImageFromFirebase() {
    let imgUrl: string = this.loadingPlaceholderImage;
    let allItems;
    let randIndex: number = this.state.lastImageIndex;

    try {
      allItems = await this.storageRef.listAll();

      while (randIndex === this.state.lastImageIndex) {
        randIndex = this.getRandomInt(0, allItems.items.length - 1);
      }

      const path = allItems.items[randIndex].location.path;
      const ref = this.storageRef.child(path);

      imgUrl = await ref.getDownloadURL();
    } catch (err) {
      console.log(err);
      imgUrl = this.errorPlaceholderImage;
    }

    this.setState({
      imgUrl,
      numImages: allItems ? allItems.items.length : 0,
      lastImageIndex: randIndex
    });
  }

  private uploadImage() {
    if (this.inputOpenFileRef.current) {
      this.inputOpenFileRef.current.click();
    }
  }

  private async handleFileSelection(data: any) {
    const fileList = data.target.files;

    for (const file of fileList) {
      if (!file.type.match('image*')) continue;

      const imageType = file.type.match('png')
        ? '.png'
        : '.jpg';

      const uuid = uuidv4();
      const imageRef = this.storageRef.child(uuid + imageType);

      try {
        await imageRef.put(file);
        this.setState({ numImages: this.state.numImages + 1 });
      } catch (err) {
        console.log(err);
      }
    }
  }

  private getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public render() {
    return (
      <div className="App" >
        <header className="App-header">
          <Button type="primary" onClick={() => message.info('This is a normal message')}>
            Display normal message
          </Button>
          <img src={this.state.imgUrl} style={{ height: 300, width: 300 }} />
          <button onClick={this.uploadImage}>Upload an image</button>
          <input type="file" id="file" ref={this.inputOpenFileRef} style={{ display: "none" }} onChange={this.handleFileSelection} />
        </header>
      </div >
    );
  }

}

export default App;
