import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../Redux/store';
import { firebaseWrapper } from '../../Util/FirebaseWrapper';
import { getRandomInt } from '../../Util/numbers';

interface State {
    imgUrl: string,
    numImages: number,
    lastImageIndex: number;
}

interface OwnProps {

}

interface MapStateToProps {
}

interface MapDispatchToProps {

}

type Props = OwnProps & MapStateToProps & MapDispatchToProps;

class SlideshowComponent extends Component<Props, State> {
    private imageRefreshIntervalHandle: any;

    private readonly REFRESH_INTERVAL: number = 2000;
    private readonly loadingPlaceholderImage: string = 'https://via.placeholder.com/150';
    private readonly errorPlaceholderImage: string = 'https://p7.hiclipart.com/preview/711/621/180/error-computer-icons-orange-error-icon.jpg';

    constructor(props: any) {
        super(props);
        this.state = {
            imgUrl: '',
            numImages: 0,
            lastImageIndex: -1
        }
        this.getImageFromFirebase = this.getImageFromFirebase.bind(this);
    }

    async componentDidMount() {
        this.getImageFromFirebase();
        this.imageRefreshIntervalHandle = setInterval(this.getImageFromFirebase, this.REFRESH_INTERVAL);
    }

    componentWillUnmount() {
        clearInterval(this.imageRefreshIntervalHandle);
    }

    private async getImageFromFirebase() {
        let imgUrl: string = this.loadingPlaceholderImage;
        let allItems: firebase.storage.ListResult | null = null;
        let randIndex: number = this.state.lastImageIndex;

        try {
            allItems = await firebaseWrapper.storage.listAll();

            while (randIndex === this.state.lastImageIndex) {
                randIndex = getRandomInt(0, allItems.items.length - 1);
            }

            const path = allItems.items[randIndex].fullPath;
            const ref = firebaseWrapper.storage.child(path);

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

    render() {
        return (
            <div className="App" >
                <header className="App-header">
                    <img src={this.state.imgUrl} style={{ height: 300, width: 300 }} alt="" />
                </header>
            </div >
        )
    }
};

const mapState = (state: ApplicationState): MapStateToProps => ({
});

const mapDispatch: MapDispatchToProps = {

}

export default connect(mapState, mapDispatch)(SlideshowComponent);
