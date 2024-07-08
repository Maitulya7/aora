import { View, Text } from 'react-native'
import React from 'react'
import { useGlobalContext } from '../../context/GlobalProvider';
const Home = () => {
  const {isLoggedIn} = useGlobalContext();
  console.log(isLoggedIn)
  return (
    <View>
      <Text>Home</Text>
    </View>
  )
}

export default Home