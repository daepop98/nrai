import React, { useState, useEffect, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { 
  View, 
  Text, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  FlatList, 
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";

const Stack = createStackNavigator();

// API 기본 URL
const BASE_URL = 'https://api.example.com';

// 토큰 가져오기
const getToken = async () => {
  try {
    return await AsyncStorage.getItem('userToken');
  } catch (error) {
    console.error('Failed to get token', error);
    return null;
  }
};

// API 호출 함수
const apiCall = async (endpoint, method, body = null) => {
  const token = await getToken();
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };

  try {
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// 네트워크 연결 확인 훅
const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  return isConnected;
};

// 인트로 화면
const IntroScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isConnected = useNetworkStatus();

  const handleLogin = async () => {
    if (!isConnected) {
      Alert.alert('네트워크 오류', '인터넷 연결을 확인해주세요.');
      return;
    }

    if (!username || !password) {
      Alert.alert('입력 오류', '아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiCall('login', 'POST', { username, password });
      await AsyncStorage.setItem('userToken', response.token);
      setIsLoading(false);
      navigation.replace('PatientInfo');
    } catch (error) {
      setIsLoading(false);
      Alert.alert('로그인 실패', '아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>요양병원 AI</Text>
        <Image
          source={require('./assets/nursepatient.png')}
          style={styles.image}
        />
        <Text style={styles.subtitle}>실시간 요양병원 환자 정보 손쉽게 확인하세요</Text>
        <TextInput 
          style={styles.input} 
          placeholder="아이디" 
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput 
          style={styles.input} 
          placeholder="비밀번호" 
          secureTextEntry 
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={[styles.button, isLoading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>로그인</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

// 환자 정보 화면
const PatientInfoScreen = ({ navigation }) => {
  const [patientInfo, setPatientInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const isConnected = useNetworkStatus();

  const fetchPatientInfo = useCallback(async () => {
    if (!isConnected) {
      Alert.alert('네트워크 오류', '인터넷 연결을 확인해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      const data = await apiCall('patient-info', 'GET');
      setPatientInfo(data);
    } catch (error) {
      Alert.alert('오류', '환자 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [isConnected]);

  useEffect(() => {
    fetchPatientInfo();
  }, [fetchPatientInfo]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPatientInfo();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!patientInfo) {
    return (
      <View style={styles.container}>
        <Text>환자 정보를 불러올 수 없습니다.</Text>
        <TouchableOpacity style={styles.button} onPress={fetchPatientInfo}>
          <Text style={styles.buttonText}>다시 시도</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.scrollView}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.container}>
        <View style={styles.patientCard}>
          <Text style={styles.patientName}>{patientInfo.name} 님 / {patientInfo.gender}</Text>
          <Text>입원일: {patientInfo.admissionDate}</Text>
          <Text>병실번호: {patientInfo.roomNumber}</Text>
          <Text>담당의: {patientInfo.doctor}</Text>
        </View>
        <View style={styles.vitalSigns}>
          <Text style={styles.sectionTitle}>활력징후</Text>
          <View style={styles.vitalSignItem}>
            <Icon name="favorite" size={24} color="#FF4136" />
            <Text style={styles.vitalSignText}>심박수: {patientInfo.vitalSigns.heartRate} bpm</Text>
          </View>
          <View style={styles.vitalSignItem}>
            <Icon name="show-chart" size={24} color="#0074D9" />
            <Text style={styles.vitalSignText}>혈압: {patientInfo.vitalSigns.bloodPressure} mmHg</Text>
          </View>
          <View style={styles.vitalSignItem}>
            <Icon name="whatshot" size={24} color="#FF851B" />
            <Text style={styles.vitalSignText}>체온: {patientInfo.vitalSigns.temperature}°C</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('AINurse')}
        >
          <Text style={styles.buttonText}>AI 간호사와 상담하기</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// AI 간호사 채팅 화면
const AINurseScreen = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: '안녕하세요? 오늘은 어떤 도움이 필요하신가요?', isAI: true },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isConnected = useNetworkStatus();

  const sendMessage = async () => {
    if (!isConnected) {
      Alert.alert('네트워크 오류', '인터넷 연결을 확인해주세요.');
      return;
    }

    if (inputMessage.trim() === '') return;
    
    const userMessage = { id: messages.length + 1, text: inputMessage, isAI: false };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await apiCall('ai-nurse', 'POST', { message: inputMessage });
      const aiResponse = response.message;
      setMessages(prevMessages => [
        ...prevMessages,
        { id: prevMessages.length + 1, text: aiResponse, isAI: true },
      ]);
    } catch (error) {
      Alert.alert('오류', 'AI 응답을 받아오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <View style={[styles.chatBubble, item.isAI ? styles.aiMessage : styles.userMessage]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
        style={styles.chatContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.chatInput}
          placeholder="메시지를 입력하세요..."
          value={inputMessage}
          onChangeText={setInputMessage}
          editable={!isLoading}
        />
        <TouchableOpacity 
          style={[styles.sendButton, isLoading && styles.disabledButton]} 
          onPress={sendMessage} 
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Icon name="send" size={24} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// 메인 앱 컴포넌트
const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let token;
      try {
        token = await AsyncStorage.getItem('userToken');
      } catch (e) {
        console.error('Failed to get token', e);
      }
      setUserToken(token);
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {userToken == null ? (
          <Stack.Screen 
            name="Intro" 
            component={IntroScreen} 
            options={{ headerShown: false }} 
          />
        ) : (
          <>
            <Stack.Screen 
              name="PatientInfo" 
              component={PatientInfoScreen} 
              options={{ 
                title: '환자 정보',
                headerRight: () => (
                  <TouchableOpacity
                    onPress={async () => {
                      await AsyncStorage.removeItem('userToken');
                      setUserToken(null);
                    }}
                    style={{ marginRight: 10 }}
                  >
                    <Icon name="exit-to-app" size={24} color="#000" />
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen 
              name="AINurse" 
              component={AINurseScreen} 
              options={{ title: 'AI 간호사' }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
