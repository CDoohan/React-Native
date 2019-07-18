import React, {Component} from 'react';
import { Text, View, ScrollView, StyleSheet, Picker, Switch, Button, Modal, Alert } from 'react-native';
import DatePicker from 'react-native-datepicker';
import * as Animatable from 'react-native-animatable';
import { Calendar, Permissions, Notifications } from 'expo';

class Reservation extends Component{
    constructor(props){
        super(props)

        this.state = {
            guests: 1,
            smoking: false,
            date: '',
            showModal: false
        }
    }

    static navigationOptions = {
        title   :   'Reserve Table'
    };

    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }

    resetForm() {
        this.setState({
            guests: 1,
            smoking: false,
            date: '',
            showModal: false
        });
    }

    _dateNow = () => {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        return today = yyyy + '-' + mm + '-' + dd;
    }

    async obtainNotificationPermission() {
        let permission = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to show notifications');
            }
        }
        Notifications.addListener(this.handleNotification);
        return permission;
    }

    async obtainCalendarPermission() {
        let permission = await Permissions.getAsync(Permissions.CALENDAR);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.CALENDAR);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to access the calendar');
            }
        }
        return permission;
    }

    // By Coursera Forum, IOS does not send push notification while app is running,
    // So, 1000 delay are added to Notifications to block get time to block screen and see the noficiations appear.
    async presentLocalNotification(date) {
        await this.obtainNotificationPermission();
        Notifications.scheduleLocalNotificationAsync({
            title: 'Your Reservation',
            body: 'Reservation for '+ date + ' requested',
            ios: {
                sound: true
            },
            android: {
                sound: true,
                vibrate: true,
                color: '#512DA8'
            }
        }, {time: new Date().getTime() + 10000})
    }

    handleNotification() {
        console.log('Listener OK');
    }

    async addReservationToCalendar(date) {
        await this.obtainCalendarPermission();
        const startDate = new Date(Date.parse(date));
        const endDate = new Date(Date.parse(date) + (2 * 60 * 60 * 1000));
        Calendar.createEventAsync(
            Calendar.DEFAULT,
            {
                title: 'Con Fusion Table Reservation',
                location: '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong',
                startDate,
                endDate,
                timeZone: 'Asia/Hong_Kong',
            },
        );
        Alert.alert('Reservation has been added to your calendar');
    }

    _handleReservation() {
        Alert.alert(
            'Your reservation is ok?',
            'Number of Guests:'+ this.state.guests + '\n' + 
            'Smoking? :' + (this.state.smoking ? 'Yes' : 'No') + '\n' +
            'Date and time :'+ this.state.date,
            [
                { text: 'Cancel', onPress: () => { this.resetForm() }, style: 'cancel'},
                { text: 'Ok', onPress : () => this.confirmReservation(this.state.date), style: 'default'}
            ],
            { cancelable: false } 
        )
    }

    confirmReservation(date) {
        this.presentLocalNotification(date);
        this.addReservationToCalendar(date);
        this.resetForm();
    }

    render(){

        const dateNow = this._dateNow();

        return(
            <ScrollView>
                <Animatable.View animation="zoomIn" duration={1000} delay={1000}>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>
                            Number of Guests
                        </Text>
                        <Picker 
                            style={styles.formItem}
                            selectedValue={this.state.guests}
                            onValueChange={(itemValue) => this.setState({guests: itemValue})}
                        >
                            <Picker.Item label='1' value='1' />
                            <Picker.Item label='2' value='2' />
                            <Picker.Item label='3' value='3' />
                            <Picker.Item label='4' value='4' />
                            <Picker.Item label='5' value='5' />
                            <Picker.Item label='6' value='6' />
                        </Picker>
                    </View>

                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>
                            Smoking/Non-Smoking
                        </Text>
                        <Switch 
                            style={styles.formItem}
                            value={this.state.smoking}
                            trackColor='#512DA8'
                            onTintColor='#512DA8'
                            onValueChange={ (value) => this.setState({ smoking: value }) } 
                        >
                        </Switch>
                    </View>

                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}>
                            Date and Time
                        </Text>
                        <DatePicker
                            style={{ flex:2, marginRight:20 }}
                            date={this.state.date}
                            format=''
                            mode='datetime'
                            placeholder='select date and time'
                            minDate={dateNow}
                            onDateChange={(date) => {this.setState({date: date})}}
                            confirmBtnText='Confirm'
                            cancelBtnText='Cancel'
                            customStyles={{
                                dateIcon:{
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft:0
                                },
                                dateInput:{
                                    marginLeft: 36,
                                },
                            }}
                        ></DatePicker>
                    </View>

                    <View style={styles.formRow}>
                        <Button title='Reserve' color='#512DA8' onPress={ () => this._handleReservation(this.state.date) } accessibilityLabel='Learn more about this puple button' />
                    </View>
                </Animatable.View>

                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    // onDismiss={ () => console.log('test')} DEPRECATED
                    onRequestClose={() => { this.toggleModal() }}    
                >
                    <View style={styles.modal}>
                        <Text style={styles.modalTitle}>
                            Your Reservation
                        </Text>
                        <Text style={styles.modalText}>
                            Number of Guests: {this.state.guests}
                        </Text>
                        <Text style={styles.modalText}>
                            Smoking? : {this.state.smoking ? 'Yes' : 'No'}
                        </Text>
                        <Text style={styles.modalText}>
                            Date and time : {this.state.date}
                        </Text>
                        <Button
                            onPress={ () => {this.toggleModal(); this.resetForm()} }
                            color='#512DA8'
                            title='Close'
                        />
                    </View>
                </Modal>

            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex:2,
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin:20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color:'white',
        marginBottom:20
    },
    modalText: {
        fontSize: 18,
        margin:10
    }
})

export default Reservation; 