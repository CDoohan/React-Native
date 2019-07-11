import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Card } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';

class ContactComponent extends Component{

    static navigationOptions = {
        title: 'Contact Us'
    };

    render(){
        return(
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
                <Card title="Contact Information">
                    <View>
                        <Text>121, Clear Water Bay Road</Text>
                        <Text style={{paddingTop: 10}}>Clear Water Bay, Kowloon</Text>
                        <Text style={{paddingTop: 10}}>HONG KONG</Text>
                        <Text style={{paddingTop: 10}}>Tel: +852 1234 5678</Text>
                        <Text style={{paddingTop: 10}}>Fax: +852 8765 4321</Text>
                        <Text style={{paddingTop: 10}}>Email:confusion@food.net</Text>
                    </View>
                </Card>
            </Animatable.View>
        )
    }

}

export default ContactComponent;