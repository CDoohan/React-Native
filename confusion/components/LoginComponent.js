import React, {Component} from 'react';
import { View, StyleSheet, Text, ScrollView, Image } from 'react-native';
import { Input, CheckBox, Button, Icon } from 'react-native-elements';
import { SecureStore, Permissions, ImagePicker, ImageManipulator, Asset } from 'expo';
import { createBottomTabNavigator } from 'react-navigation';
import { baseUrl } from '../shared/baseUrl';

class LoginTab extends Component{

    constructor(props){
        super(props)

        this.state = {
            username: '',
            password: '',
            remember: false
        }
    }

    componentDidMount(){
        SecureStore.getItemAsync('userinfo')
            .then((userdata) => {
                let userinfo = JSON.parse(userdata);

                if(userinfo){
                    this.setState({
                        username: userinfo.username,
                        password: userinfo.password,
                        remember: true
                    })
                }
            })
    }

    handleLogin(){
        if(this.state.remember){
            SecureStore.setItemAsync(
                'userinfo',
                 JSON.stringify({
                    username: this.state.username,
                    password: this.state.password
                })
            ).catch((error) => console.log('Could not save user info', error))
        }else{
            SecureStore.deleteItemAsync('userinfo')
                .catch( error => console.log('Could not dele user info', error))
        }
    }

    static navigationOptions = {
        title: 'Login',
        tabBarIcon : ({ tintColor }) => (
            <Icon name='sign-in' type='font-awesome' size={24} iconStyle={{ color: tintColor }} />
        )
    };

    render(){
        return(
            <View style={styles.container}>
                <Input
                    placeholder="Username"
                    leftIcon={{ type:'font-awesome', name: 'user-o' }}
                    onChangeText={ (username) => this.setState({ username }) }
                    value={this.state.username}
                    containerStyle={styles.formInput} 
                />
                <Input
                    placeholder="Password"
                    leftIcon={{ type:'font-awesome', name: 'key' }}
                    onChangeText={ (password) => this.setState({ password }) }
                    value={this.state.password}
                    containerStyle={styles.formInput} 
                />
                <CheckBox 
                    title="Remember Me"
                    center
                    checked={this.state.remember}
                    onPress={ () => this.setState({ remember: !this.state.remember }) }
                    containerStyle={styles.formCheckBox}
                />
                <View style={styles.formButton}>
                    <Button
                        onPress={ () => this.handleLogin() }
                        title='Login'
                        size={24}
                        icon={ <Icon name='sign-in' type='font-awesome' color='white' /> }
                        buttonStyle={{ backgroundColor: '#512DA8' }}
                    />
                </View>
                <View style={styles.formButton}>
                    <Button
                        onPress={ () => this.props.navigate('Register') }
                        title='Register'
                        clear
                        size={24}
                        icon={ <Icon name='user-plus' type='font-awesome' color='blue' /> }
                        titleStyle={{ color: 'blue' }}
                    />
                </View>
            </View>
        );
    }
}

class RegisterTab extends Component {

    constructor(props){
        super(props)

        this.state = {
            username: '',
            password: '',
            firstname: '',
            lastname: '',
            email: '',
            remember: false,
            imageUrl : baseUrl + 'images/logo.png'
        }
    }

    static navigationOptions = {
        title: 'Register',
        tabBarIcon : ({ tintColor }) => (
            <Icon name='user-plus' type='font-awesome' size={24} iconStyle={{ color: tintColor }} />
        )
    };

    processImage = async (imageUri ) => {
        try {
            const processedImage = await ImageManipulator.manipulateAsync(
                imageUri,
                [
                    { resize: { width: 400 } },
                ],
                { format: 'png' },
            );
        
            this.setState({ imageUrl: processedImage.uri });
        }
        catch (error) {
            console.log(error);
        }
    }

    getImageFromCamera = async () => {
        const cameraPermission = await Permissions.askAsync(Permissions.CAMERA);
        const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if ( cameraPermission.status === 'granted' && cameraRollPermission.status === 'granted' ){

            let capturedImage = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [4,3]
            });

            if( !capturedImage.cancelled ){
                this.processImage( capturedImage.uri );
            }
        }
    }

    getImageFromGallery = async () => {
        const cameraRollPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (cameraRollPermission.status === 'granted') {
            const libraryImage = await ImagePicker.launchImageLibraryAsync({
                    allowsEditing: true,
                    aspect: [4, 3],
                    mediaTypes: 'Images',
            });

            if (!libraryImage.cancelled) {
                this.processImage(libraryImage.uri);
            }
        }

    }

    handleRegister() {
        console.log(JSON.stringify(this.state));

        if(this.state.remember){
            SecureStore.setItemAsync(
                'userinfo',
                 JSON.stringify({
                    username: this.state.username,
                    password: this.state.password
                })
            ).catch((error) => console.log('Could not save user info', error))
        }
    }

    render(){
        return(
            <ScrollView>
                <View style={styles.container}>

                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: this.state.imageUrl }}
                            loadingIndicatorSource={ require('./images/logo.png') }
                            style={styles.image}
                        />
                        <Button 
                            title='Camera'
                            onPress={this.getImageFromCamera}
                        />
                        <Button 
                            title='Gallery'
                            onPress={this.getImageFromGallery}
                        />
                    </View>

                    <Input
                        placeholder="Username"
                        leftIcon={{ type:'font-awesome', name: 'user-o' }}
                        onChangeText={ (username) => this.setState({ username }) }
                        value={this.state.username}
                        containerStyle={styles.formInput} 
                    />
                    <Input
                        placeholder="Password"
                        leftIcon={{ type:'font-awesome', name: 'key' }}
                        onChangeText={ (password) => this.setState({ password }) }
                        value={this.state.password}
                        containerStyle={styles.formInput} 
                    />
                    <Input
                        placeholder="Firstname"
                        leftIcon={{ type:'font-awesome', name: 'user-o' }}
                        onChangeText={ (firstname) => this.setState({ firstname }) }
                        value={this.state.firstname}
                        containerStyle={styles.formInput} 
                    />
                    <Input
                        placeholder="Lastname"
                        leftIcon={{ type:'font-awesome', name: 'user-o' }}
                        onChangeText={ (lastname) => this.setState({ lastname }) }
                        value={this.state.lastname}
                        containerStyle={styles.formInput} 
                    />
                    <Input
                        placeholder="E-mail"
                        leftIcon={{ type:'font-awesome', name: 'envelope-o' }}
                        onChangeText={ (email) => this.setState({ email }) }
                        value={this.state.email}
                        containerStyle={styles.formInput} 
                    />
                    <CheckBox 
                        title="Remember Me"
                        center
                        checked={this.state.remember}
                        onPress={ () => this.setState({ remember: !this.state.remember }) }
                        containerStyle={styles.formCheckBox}
                    />
                    <View style={styles.formButton}>
                        <Button
                            onPress={ () => this.handleRegister() }
                            title='Register'
                            size={24}
                            icon={ <Icon name='user-plus' type='font-awesome' color='white' /> }
                            buttonStyle={{ backgroundColor: '#512DA8' }}
                        />
                    </View>
                </View>
            </ScrollView>
        )
    }
}

const Login = createBottomTabNavigator({
    Login: LoginTab,
    Register: RegisterTab
}, {
    tabBarOptions: {
        activeBackgroundColor: '#9575CD',
        inactiveBackgroundColor: '#D1C4E9',
        activeTintColor: 'white',
        inactiveTintColor: 'gray'
    }
})

export default Login;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        margin:10
    },
    imageContainer: {
        flex: 1,
        flexDirection: 'row',
        margin: 20,
        justifyContent: 'space-around',
        alignItems: 'center',
        alignContent: 'center'
    },
    image: {
        margin:10,
        width:80,
        height:60
    },
    formInput: {
        marginTop:20,
        marginBottom:20
    },
    formCheckBox: {
        margin:20,
        backgroundColor: null
    },
    formButton: {
        margin: 10
    }
})