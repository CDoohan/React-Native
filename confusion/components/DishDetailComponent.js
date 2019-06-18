import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Card } from 'react-native-elements';
import { DISHES } from '../shared/dishes';

function RenderDish(props) {
    const dish = props.dish;

    if (dish!= null){
        return(
            <Card
                featuredTitle={dish.name}
                image={require('./images/uthappizza.png')}
            >
                <Text style={{ margin:10 }}>
                    { dish.description }
                </Text>
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
            dishes : DISHES
        }
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
            <RenderDish dish={this.state.dishes[+dishId]} />
        )
    }

}

export default DishDetail;