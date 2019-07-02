import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';
import { Card, Icon } from 'react-native-elements';
import { connect } from 'react-redux';

import { baseUrl } from '../shared/baseUrl';
import { postFavorite } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
  }

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId))
})

function RenderComments(props) {

    const comments = props.comments;

    const renderCommentItem = ({ item, index }) =>{
        return(
            <View key={index} style={{ margin: 10 }} > 
                <Text style={{ fontSize: 14 }}>
                    { item.comment }
                </Text>
                <Text style={{ fontSize: 12 }}>
                    { item.rating } Stars
                </Text>
                <Text style={{ fontSize: 12 }}>
                    {'-- '+ item.author + ', '+ item.date}
                </Text>
            </View>
        )
    }

    return(
        <Card title='Comments'>
            <FlatList data={ comments } renderItem={ renderCommentItem } keyExtractor={ item => item.id.toString() } />
        </Card>
    );
}

function RenderDish(props) {
    const dish = props.dish;

    if (dish!= null){
        return(
            <Card
                featuredTitle={dish.name}
                image={{ uri: baseUrl + dish.image }}
            >
                <Text style={{ margin:10 }}>
                    { dish.description }
                </Text>
                <Icon raised reverse name={ props.favorite ? 'heart' : 'heart-o' } type='font-awesome' color='#f50' 
                    onPress={ () => props.favorite ? console.log('Already favorite') : props.onPress()} /> 
            </Card>
        );
    }else{
        return(
            <View></View>
        )
    }
}

class DishDetail extends Component {

    constructor(props){
        super(props)

        this.state = {
            favorites : []
        }
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    static navigationOptions = {
        title   :   'Dish Details'
    };

    render(){
        //getPram('nome do parametro usado em navigate', 'valor default caso o parametro seja null')
        // no caso foi passado navigate('Dishdetail', { dishId : item.id } )
        const dishId = this.props.navigation.getParam('dishId','');

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
                    onPress={ () => this.markFavorite(dishId) } />
                <RenderComments comments={this.props.comments.comments.filter( (comment) => comment.dishId === dishId )} />
            </ScrollView>
            
        )
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);