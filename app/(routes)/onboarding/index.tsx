import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'

const index = () => {
    const [loggedInUser, setloggedInUser] = useState(true);
    const [loading,setLoading] = useState(true);

    useEffect(()=>{

    },[])
  return (
    <View>
      <Text>index</Text>
    </View>
  )
}

export default index