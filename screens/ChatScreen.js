import React from 'react'
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ChatList from '../components/ChatList'
import Header from '../components/Header'

const ChatScreen = () => {
    return (
        // <Saf>
        
        // </SafeAreaView>
        
        <SafeAreaView>
           <Header title="Chat" />
           <ChatList />


        </SafeAreaView>
    )
}

export default ChatScreen
