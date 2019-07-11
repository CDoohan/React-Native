import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, Modal, StyleSheet, Button, Alert, PanResponder } from 'react-native';
import { Rating, Input, Icon, Card } from 'react-native-elements';
import { connect } from 'react-redux';
import * as Animatable from 'react-native-animatable';

import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
  }

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment : (id, dishId, rating, author, comment) => dispatch(postComment(id, dishId, rating, author, comment))
})

function RenderComments(props) {

    const comments = props.comments;

    const renderCommentItem = ({ item, index }) =>{
        return(
            <View key={index} style={{ margin: 10 }} > 
                <Text style={{ fontSize: 14 }}>
                    { item.comment }
                </Text>
                <Rating
                    startingValue={item.rating}
                    readonly
                    imageSize={10}
                    style={{ 
                        display: 'flex', flex: 1, flexDirection: 'row',
                        justifyContent: 'flex-start', padding: 5}
                    } 
                />
                <Text style={{ fontSize: 12 }}>
                    {'-- '+ item.author + ', '+ item.date}
                </Text>
            </View>
        )
    }

    return(
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
            <Card title='Comments'>
                <FlatList data={ comments } renderItem={ renderCommentItem } keyExtractor={ item => item.id.toString() } />
            </Card>
        </Animatable.View>
    );
}

function RenderDish(props) {
    const dish = props.dish;
    
    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
        console.log('RECOGNIZE', dx);
        if(dx < 0)
            return true;
        else
            return false;
    };

    const panResponder = PanResponder.create({
        // starts when the user start gesture on the screen
        onStartShouldSetPanResponder: (e, gestureState) => {
            console.log('STARTS');
            return true
        },
        // Invoke when the user lifts their finger off the screen after performing the gesture
        onPanResponderEnd: (e, gestureState) => {
            console.log("ENDS")
            if(recognizeDrag(gestureState)){
                Alert.alert(
                    'Add to Favorites?',
                    'Are you sure you wish to add '+ dish.name+ ' to your favorites?',
                    [
                        { text: 'Cancel', onPress: () => console.log('Not added'), style: 'cancel'},
                        { text: 'Ok', onPress : () => props.favorite ? console.log('Already favorite') : props.onPress() , style: 'default'}
                    ],
                    { cancelable: false } 
                )
                return true;
            }
        }
    });

    if (dish!= null){
        return(
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000} {...panResponder.panHandlers}>
                <Card
                    featuredTitle={dish.name}
                    image={{ uri: baseUrl + dish.image }}
                >
                    <Text style={{ margin:10 }}>
                        { dish.description }
                    </Text>
                    <View style={{display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                        <Icon raised reverse name={ props.favorite ? 'heart' : 'heart-o' } type='font-awesome' color='#f50' 
                            onPress={ () => props.favorite ? console.log('Already favorite') : props.onPress()} />
                        <Icon raised reverse name='pencil' type='font-awesome' color='#512DA8' onPress={ () => props.toggleModal() } /> 
                    </View>
                </Card>
            </Animatable.View>
        );
    }else{
        return(
            <View></View>
        )
    }
}

class ModalComment extends Component {
    constructor(props){
        super(props)

        this.state = {
            author: '',
            comment: '',
            rating: 0,
        }
    }

    _submitComment(){
        console.log('Dados vindo do formulario: ', JSON.stringify(this.state));
        let id = this.props.commentsLenght;
        this.props.postComment(id, this.props.dishId, this.state.rating, this.state.author, this.state.comment);
        setTimeout( () => {
            this._resetForm();
            this.props.toggleModal();
        }, 500)
    }

    _resetForm(){
        this.setState({
            rating: 0,
            author: '',
            comment: ''
        })
    }

    render(){
        const showModal = this.props.showModal;

        return(
            <Modal
                visible={showModal}
                animationType={'fade'}
                transparent={false}
                onRequestClose={() => this.props.toggleModal()} 
            >
                <View style={styles.modal}>
                    <Rating
                        showRating
                        readonly={false}
                        startingValue={this.state.rating}
                        imageSize={40}
                        style={{paddingVertical: 10, marginBottom: 30}}
                        onFinishRating={(value) => this.setState({rating: value})}
                    />
                    <Input
                        placeholder='Author'
                        leftIcon={
                            <Icon
                                name='user-o'
                                type='font-awesome'
                                size={24}
                                color='black'
                            />
                        }
                        style={{paddingBottom: 30}}
                        onChangeText={(text) => this.setState({author: text})}
                    />
                    <Input
                        placeholder='Comment'
                        leftIcon={
                            <Icon
                                name='comment-o'
                                type='font-awesome'
                                size={24}
                                color='black'
                            />
                        }
                        style={{paddingBottom: 30}}
                        onChangeText={(text) => this.setState({comment: text})}
                    />
                    <View style={{marginTop: 40}}>
                    <Button 
                        onPress={() => this._submitComment()}
                        color='#512DA8'
                        title='Submit'
                    />
                    </View>
                    <View style={{marginTop: 20}}>
                    <Button 
                        onPress={ () => this.props.toggleModal() }
                        color='grey'
                        title='Cancel'
                    />
                    </View>
                </View>
            </Modal>
        )
    }
}

class DishDetail extends Component {

    constructor(props){
        super(props)

        this.state = {
            favorites : [],
            showModal : false
        }
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    static navigationOptions = {
        title   :   'Dish Details'
    };

    _toggleModal(){
        this.setState({
            showModal: !this.state.showModal
        })
    }

    render(){
        //getPram('nome do parametro usado em navigate', 'valor default caso o parametro seja null')
        // no caso foi passado navigate('Dishdetail', { dishId : item.id } )
        const dishId = this.props.navigation.getParam('dishId','');
        const commentsLenght = this.props.comments.comments.length;

        return(
            // o '+' antes e dishId significa que o dishId está sendo transformado de 
            // string para number, onde no caso é usado para pegar o dishes[dishId]
            // exemplo: dishes[2], dishes[0], etc.

            // favorites.some() retorna true ou false se caso dentro do array favorites
            // existir algum elemento cujo id seja igual ao dishId
            <ScrollView>
                <RenderDish 
                    dish={this.props.dishes.dishes[+dishId]} 
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={ () => this.markFavorite(dishId) }
                    toggleModal={ () => this._toggleModal() } />
                <RenderComments comments={this.props.comments.comments.filter( (comment) => comment.dishId === dishId )} />
                <ModalComment commentsLenght={commentsLenght} dishId={dishId} showModal={this.state.showModal} toggleModal={ () => this._toggleModal() } postComment={this.props.postComment}/>
            </ScrollView>
        )
    }

}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        margin:20
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);