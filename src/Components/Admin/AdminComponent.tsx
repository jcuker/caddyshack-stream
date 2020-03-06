import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../Redux/store';
import { Input, Button, message } from 'antd';
import { firebaseWrapper } from '../../Util/FirebaseWrapper';
import { login, LoginParams } from '../../Redux/Actions/AuthActions';
import { Dispatch } from 'redux';

interface State {
    email: string;
    password: string;
    loading: boolean;
}

interface OwnProps { }

interface MapStateToProps {
    user?: firebase.User;
}

interface MapDispatchToProps {
    login: typeof login;
}

type Props = OwnProps & MapStateToProps & MapDispatchToProps;

class AdminComponent extends Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            loading: false
        }

        this.emailChange = this.emailChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.loginAdmin = this.loginAdmin.bind(this);
    }

    private async loginAdmin() {
        await this.setState({ loading: true });
        try {
            const result = await firebaseWrapper.loginUser(this.state.email, this.state.password);
            console.log(result);
            message.success('Logged in successfully!');
        } catch (error) {
            console.log(error);
            message.error('Unable to login!');
        } finally {
            this.setState({ loading: false });
        }
    }

    private emailChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ email: event.target.value });
    }

    private passwordChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ password: event.target.value });
    }

    private renderLoginPage() {
        return (
            <div>
                <div>ADMIN</div>
                <Input value={this.state.email} size="large" placeholder="Email" onChange={this.emailChange} />
                <Input.Password value={this.state.password} size="large" placeholder="Password" onChange={this.passwordChange} />
                <Button loading={this.state.loading} onClick={this.loginAdmin}>Login</Button>
            </div>
        );
    }

    private renderAdminPage() {
        return (
            <div>Logged in :)</div>
        );
    }

    render() {
        const content = this.props.user
            ? this.renderAdminPage()
            : this.renderLoginPage();
        return (
            <div>
                {content}
            </div>
        );
    }
}

const mapState = (state: ApplicationState): MapStateToProps => ({
    ...state.authReducer
});

const mapDispatch = (dispatch: Dispatch): MapDispatchToProps => ({
    login: (params: LoginParams) => dispatch(login(params))
});

export default connect(mapState, mapDispatch)(AdminComponent);
