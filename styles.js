import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  background: '#F2F2F7',
  text: '#1C1C1E',
  lightText: '#8E8E93',
  white: '#FFFFFF',
  error: '#FF3B30',
  success: '#34C759',
  cardBackground: '#FFFFFF',
  inputBackground: '#E5E5EA',
};

export default StyleSheet.create({
  // 공통 스타일
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: colors.lightText,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  image: {
    width: width * 0.6,
    height: width * 0.6,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },

  // 환자 정보 화면 스타일
  patientCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.text,
  },
  vitalSigns: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: colors.text,
  },
  vitalSignItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  vitalSignText: {
    fontSize: 16,
    marginLeft: 10,
    color: colors.text,
  },

  // AI 간호사 채팅 화면 스타일
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  chatBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginBottom: 10,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: colors.inputBackground,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  messageText: {
    fontSize: 16,
    color: colors.text,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: colors.white,
  },
  chatInput: {
    flex: 1,
    backgroundColor: colors.inputBackground,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 기타 유틸리티 스타일
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mt10: { marginTop: 10 },
  mb10: { marginBottom: 10 },
  ml10: { marginLeft: 10 },
  mr10: { marginRight: 10 },
});
