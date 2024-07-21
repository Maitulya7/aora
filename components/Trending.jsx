import { View, Text , FlatList, ImageBackground , TouchableOpacity} from "react-native";
import React, { useState } from "react";
import * as Animatable from "react-native-animatable";

const zoomIn = {
  0:{
    scale:0.9
  },
  1:{
    scale:1
  }
}
const zoomOut = {
  0:{
    scale:1
  },
  1:{
    scale:0.9
  }
}


const TrendingItems = ({activeItem , item}) => {
  const [play , setPlay] = useState(false)
  return(
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
        {play ? (
          <Text className="text-white">
              Playing...
          </Text>
        ):(
          <TouchableOpacity
          className="relative flex justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{
              uri: item.thumbnail,
            }}
            className="w-52 h-72 rounded-[33px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />

        </TouchableOpacity>
        )}
    </Animatable.View>
  )
}

const Trending = ({ posts }) => {
  const [activeItem , setActiveItem] = useState([0]);  
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
       <TrendingItems item={item} activeItem={activeItem} />
      )}
      horizontal
    />
  );
};

export default Trending;
