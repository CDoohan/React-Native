import React, {Component} from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { Input, CheckBox} from 'react-native-elements';
import { SecureStore } from 'expo';

class Login extends Component{

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
        title: 'Login'
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
                        color='#512DA8'
                    />
                </View>
            </View>
        );
    }

}

export default Login;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        margin:10
    },
    formInput: {
        marginTop:40,
        marginBottom:40
    },
    formCheckBox: {
        margin:40,
        backgroundColor: null
    },
    formButton: {
        margin: 10
    }
})