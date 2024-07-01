import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const index = () => {
  return (
    <View style={styles.container}>
      <Text>Maitulya</Text>
      <Link href="/profile" style={{color:"blue"}}>Go to Profile</Link>
    </View>
  )
}

export default index

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#f5fcff'
  }
})