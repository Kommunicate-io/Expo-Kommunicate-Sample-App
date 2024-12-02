import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
  TextInput,
  NativeModules,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/StackNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const { RNKommunicateChat } = NativeModules;

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // Kommunicate Chat Handlers
  const handleOpenConversation = () => {
    RNKommunicateChat.openConversation((response: string, message: any) => {
      if (response === 'Error') console.error(message);
    });
  };

  const handleCreateConversation = () => {
    const conversationObject = {};
    RNKommunicateChat.buildConversation(
      conversationObject,
      (response: string, responseMessage: string) => {
        if (response === 'Success') {
          console.log(`Conversation created successfully: ${responseMessage}`);
          Alert.alert('Success', `ClientChannelKey: ${responseMessage}`);
        } else {
          console.error(`Create conversation failed: ${responseMessage}`);
        }
      }
    );
  };

  const handleOpenSpecificConversation = (clientChannelKey: string) => {
    const skipBackPress = true;
    RNKommunicateChat.openParticularConversation(
      clientChannelKey,
      skipBackPress,
      (response: string, responseMessage: any) => {
        if (response === 'Error') console.error(responseMessage);
        else console.log('Specific conversation opened successfully.');
      }
    );
  };

  const handleSendMessage = () => {
    const messageMetadata = { Name: 'Alex Williams', ID: 'X123Y24' };
    const conversationObject = { createOnly: true };

    RNKommunicateChat.buildConversation(
      conversationObject,
      (response: string, responseMessage: any) => {
        if (response === 'Success') {
          const channelID = responseMessage;
          console.log(`Conversation created successfully. ClientChannelKey: ${channelID}`);

          const messagePayload = {
            channelID,
            message: 'hi',
            messageMetadata: JSON.stringify(messageMetadata),
          };

          RNKommunicateChat.sendMessage(
            messagePayload,
            (sendResponse: string, sendResponseMessage: any) => {
              if (sendResponse === 'Success') {
                console.log(`Message sent successfully.`);
                handleOpenSpecificConversation(channelID);
              } else {
                console.error(`Error sending message: ${sendResponseMessage}`);
              }
            }
          );
        } else {
          console.error(`Error creating conversation: ${responseMessage}`);
        }
      }
    );
  };

  const handleLogout = () => {
    RNKommunicateChat.logout((response: string) => {
      if(response == "Success") {
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', 'Logout Failed.');
      }
    });
  };

  // Dialog Handlers
  const closeDialog = (isOkClicked: boolean) => {
    if (isOkClicked && inputText.trim()) handleOpenSpecificConversation(inputText.trim());
    setIsDialogVisible(false);
    setInputText('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Kommunicate!</Text>
      
      <View style={styles.buttonContainer}>
        <CustomButton text="Open Conversations" onPress={handleOpenConversation} />
        <CustomButton text="Create Conversation" onPress={handleCreateConversation} />
        <CustomButton text="Open Specific Conversation" onPress={() => setIsDialogVisible(true)} />
        <CustomButton text="Send Message" onPress={handleSendMessage} />
        <CustomButton text="Log Out" onPress={handleLogout} />
      </View>

      {/* Dialog Modal */}
      <DialogModal
        visible={isDialogVisible}
        inputValue={inputText}
        onChangeText={setInputText}
        onCancel={() => closeDialog(false)}
        onConfirm={() => closeDialog(true)}
      />
    </View>
  );
};

// Reusable Button Component
const CustomButton = ({ text, onPress }: { text: string; onPress: () => void }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

// Reusable Dialog Modal Component
const DialogModal = ({
  visible,
  inputValue,
  onChangeText,
  onCancel,
  onConfirm,
}: {
  visible: boolean;
  inputValue: string;
  onChangeText: (text: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) => (
  <Modal visible={visible} animationType="fade" transparent={true} onRequestClose={onCancel}>
    <View style={styles.modalOverlay}>
      <View style={styles.dialogBox}>
        <Text style={styles.dialogTitle}>Enter ClientChannelKey</Text>
        
        {/* Input Field */}
        <TextInput
          style={styles.textInput}
          placeholder="Type here"
          value={inputValue}
          onChangeText={onChangeText}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {/* Action Buttons */}
        <View style={styles.dialogButtons}>
          <TouchableOpacity style={[styles.dialogButton, styles.cancelButton]} onPress={onCancel}>
            <Text style={styles.dialogButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.dialogButton, styles.okayButton]} onPress={onConfirm}>
            <Text style={styles.dialogButtonText}>OKAY</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', paddingTop: 250, paddingHorizontal: 20 },

  text: { fontSize: 20, marginBottom: 30 },
  
  buttonContainer: { width: '100%', paddingHorizontal: 10 },
  
  button: { backgroundColor: '#007BFF', borderRadius: 10, paddingVertical: 15, marginVertical: 10, alignItems: 'center' },
  
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  
  dialogBox: { backgroundColor: '#ffffff', paddingHorizontal: 20, paddingVertical: 30, borderRadius: 10, width: '80%', maxWidth: 350 },
  
  dialogTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  
  textInput: { width: '100%', height: 40, borderColor:'#ccc', borderWidth :1 ,borderRadius :5,paddingLeft :10},
  
  dialogButtons:{flexDirection:'row',justifyContent:'space-between'},dialogButton:{flex :1,paddingVertical :12,borderRadius :5 ,marginHorizontal :5},cancelButton:{backgroundColor:'#f44336'},okayButton:{backgroundColor:'#4CAF50'},dialogButtonText:{color:'#fff',fontSize :16,fontWeight :'bold'}
});

export default HomeScreen
