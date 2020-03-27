import React, { Component, RefObject } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { firebaseWrapper, FIREBASE_UPLOAD_TASK_EVENTS, FIREBASE_UPLOAD_TASK_STATE } from '../../Util/FirebaseWrapper';
import { message, Progress } from 'antd';
import { Button } from 'antd/lib/radio';
//@ts-ignore
import * as Pica from 'pica';


interface State {
    progress: number,
    loading: boolean
}

class UploadComponent extends Component<{}, State> {
    private readonly inputOpenFileRef: RefObject<HTMLInputElement>

    constructor(props: any) {
        super(props);

        this.state = {
            progress: 0,
            loading: false
        };

        this.uploadImage = this.uploadImage.bind(this);
        this.handleFileSelection = this.handleFileSelection.bind(this);

        this.inputOpenFileRef = React.createRef();
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
            const imageRef = firebaseWrapper.storage.child(uuid + imageType);

            /*
            var sizeOf = require('image-size');
            var dimensions = sizeOf(file);
            console.log(dimensions.width, dimensions.height);
            */

            //RESIZING IMAGE with recomended values
            const picaObj = new Pica();

            picaObj.resize(file, file, {
                unsharpAmount: 100,
                unsharpRadius: 0.6,
                unsharpThreshold: 2
            })

            //dimensions = sizeOf(file);
            //console.log(dimensions.width, dimensions.height);

            this.setState({ loading: true });
            const uploadTask = imageRef.put(file);

            uploadTask.on(FIREBASE_UPLOAD_TASK_EVENTS.STATE_CHANGED,
                (snapshot: { bytesTransferred: number; totalBytes: number; state: any; }) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('upload is ' + progress + '% done');
                    this.setState({ progress });

                    switch (snapshot.state) {
                        case FIREBASE_UPLOAD_TASK_STATE.PAUSED:
                            console.log('Upload is paused');
                            break;
                        case FIREBASE_UPLOAD_TASK_STATE.RUNNING:
                            console.log('upload is running');
                            break;


                    }
                }, (error: any) => {

                    console.log(error);
                    message.error("Picture failed to upload");

                }, () => {

                    console.log('upload complete');
                    message.success("Picture uploaded successfully!");
                    this.setState({ loading: false });


                });
        }
    }

    render() {

        const progressIndicator = this.state.loading
            ? <Progress percent={this.state.progress} type="line" />
            : undefined;

        return (
            <div>
                {progressIndicator}
                <Button onClick={this.uploadImage}>Upload an image</Button>
                <input type="file" id="file" ref={this.inputOpenFileRef} style={{ display: "none" }} onChange={this.handleFileSelection} />
            </div>
        );
    }
}

export default UploadComponent;
