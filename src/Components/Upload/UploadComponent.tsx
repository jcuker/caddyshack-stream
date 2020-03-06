import React, { Component, RefObject } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { firebaseWrapper } from '../../Util/FirebaseWrapper';

class UploadComponent extends Component {
    private readonly inputOpenFileRef: RefObject<HTMLInputElement>

    constructor(props: any) {
        super(props);

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

            try {
                await imageRef.put(file);
            } catch (err) {
                console.log(err);
            }
        }
    }

    render() {
        return (
            <div>
                <button onClick={this.uploadImage}>Upload an image</button>
                <input type="file" id="file" ref={this.inputOpenFileRef} style={{ display: "none" }} onChange={this.handleFileSelection} />
            </div>
        );
    }
}

export default UploadComponent;
