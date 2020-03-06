import React, { RefObject } from 'react';
import './App.css';
import firebase from 'firebase';
import app from 'firebase/app';
import { firebaseConfig } from './firebase';
import { v4 as uuidv4 } from 'uuid';
import { message, Progress, Button } from 'antd';

interface State {
  imgUrl: string,
  numImages: number,
  lastImageIndex: number;
  progress: number;
  showProgress: boolean;
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
      lastImageIndex: -1,
      progress: 0,
      showProgress: false

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
      const uploadTask = imageRef.put(file);

      // try {
      //   await uploadTask
      //   uploadTask.on('state_changed', (snapshot: { bytesTransferred: number; totalBytes: number; }) => {
      //     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      //     console.log('Upload is ' + progress + '% done');
      //     this.setState({progress: this.state.progress});
      //     })
        
        
      //   message.success("Image uploaded successfully");
      //   this.setState({ numImages: this.state.numImages + 1 });
      // } catch (err) {
      //   message.error("Image failed to upload.");
      //   console.log(err);
      // }

      

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot: { bytesTransferred: number; totalBytes: number; state: any; }) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('upload is ' + progress + '% done');
          this.setState({ progress });

          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING:
              console.log('upload is running');
              break;           


          }
        }, function(error: any) {
          
            console.log('upload errored');
            message.error("Picture failed to upload");
            
        }, function(this: any, state: any) {
          
            console.log('upload complete');
            message.success("Picture uploaded successfully!");
            
           
        });
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
            Display basic b**** message
          </Button>
          <Progress showInfo={this.state.showProgress} percent={this.state.progress}/>
          <img src={this.state.imgUrl} style={{ height: 300, width: 300 }} />
          <Button onClick={this.uploadImage}>Upload an image</Button>
          <input type="file" id="file" ref={this.inputOpenFileRef} style={{ display: "none" }} onChange={this.handleFileSelection} />
        </header>
      </div >
    );
  }

}

export default App;
